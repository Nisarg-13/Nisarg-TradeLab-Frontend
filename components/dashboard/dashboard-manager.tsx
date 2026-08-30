"use client";

import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/page-header";
import { AccountSwitchLoadingOverlay } from "@/components/layout/account-switch-loading-overlay";
import { DashboardSummaryCards } from "@/components/dashboard/dashboard-summary-cards";
import { DailyPerformanceCalendar } from "@/components/dashboard/daily-performance-calendar";
import { EquityCurveChart } from "@/components/dashboard/equity-curve-chart";
import {
  InstrumentPerformanceTable,
  StrategyPerformanceTable,
} from "@/components/dashboard/performance-tables";
import { RecentTradesCard } from "@/components/dashboard/recent-trades-card";
import { OpenPositionsCard } from "@/components/live-trades/open-positions-card";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Label } from "@/components/ui/label";
import {
  getAnalyticsSummary,
  getInstrumentPerformance,
  getStrategyPerformance,
} from "@/lib/api/analytics";
import { listTrades } from "@/lib/api/trades";
import { useClientAuthToken } from "@/lib/auth/client";
import {
  getCached,
  setCached,
  stableCacheKey,
} from "@/lib/cache/account-data-cache";
import { useLiveTradesRefresh } from "@/lib/hooks/use-live-trades-refresh";
import { useFormatDateTime } from "@/lib/hooks/use-format-datetime";
import { usePersistedAccountId } from "@/lib/hooks/use-persisted-account-id";
import {
  resolveAccountLabel,
  useAccountSwitchLoading,
} from "@/lib/hooks/use-account-switch-loading";
import { useTradeDataRefresh } from "@/lib/hooks/use-trade-data-refresh";
import { shouldSkipServerMatchedAccountLoad } from "@/lib/preferences/server-account-load";
import type { TradingAccount } from "@/types/account";
import type {
  AnalyticsSummary,
  InstrumentPerformance,
  StrategyPerformance,
} from "@/types/analytics";
import type { LiveTradesResponse } from "@/types/live-trades";
import type { Trade } from "@/types/trade";

type DashboardSnapshot = {
  summary: AnalyticsSummary;
  instruments: InstrumentPerformance[];
  strategies: StrategyPerformance[];
  recentTrades: Trade[];
};

function dashboardCacheKey(accountId: string) {
  return stableCacheKey({
    scope: "dashboard",
    accountId: accountId || "__all__",
  });
}

export function DashboardManager({
  accounts,
  serverSelectedAccountId = "",
  initialSummary,
  initialInstruments,
  initialStrategies,
  initialRecentTrades,
  initialLiveTrades,
}: {
  accounts: TradingAccount[];
  serverSelectedAccountId?: string;
  initialSummary: AnalyticsSummary;
  initialInstruments: InstrumentPerformance[];
  initialStrategies: StrategyPerformance[];
  initialRecentTrades: Trade[];
  initialLiveTrades: LiveTradesResponse;
}) {
  const { user, isLoaded } = useUser();
  const getAuthToken = useClientAuthToken();
  const { formatApp } = useFormatDateTime();
  const displayName =
    user?.fullName ??
    user?.firstName ??
    user?.primaryEmailAddress?.emailAddress ??
    null;
  const { accountId, setAccountId, isReady } = usePersistedAccountId(
    accounts,
    serverSelectedAccountId,
  );
  const [summary, setSummary] = useState(initialSummary);
  const [instruments, setInstruments] = useState(initialInstruments);
  const [strategies, setStrategies] = useState(initialStrategies);
  const [recentTrades, setRecentTrades] = useState(initialRecentTrades);
  const requestIdRef = useRef(0);

  useEffect(() => {
    setCached(dashboardCacheKey(serverSelectedAccountId), {
      summary: initialSummary,
      instruments: initialInstruments,
      strategies: initialStrategies,
      recentTrades: initialRecentTrades,
    });
  }, [
    initialInstruments,
    initialRecentTrades,
    initialStrategies,
    initialSummary,
    serverSelectedAccountId,
  ]);

  const { positions, lastMt5SnapshotAt, refreshLiveTrades } =
    useLiveTradesRefresh({
      accountId,
      initialData: initialLiveTrades,
      isReady,
      limit: 5,
      skipInitialRefresh: false,
    });

  const accountOptions = [
    { value: "", label: "All accounts" },
    ...accounts.map((account) => ({
      value: account.id,
      label: account.name,
    })),
  ];

  const handleApplyFilter = useCallback(async () => {
    const cacheKey = dashboardCacheKey(accountId);
    const cached = getCached<DashboardSnapshot>(cacheKey);
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    if (cached) {
      setSummary(cached.summary);
      setInstruments(cached.instruments);
      setStrategies(cached.strategies);
      setRecentTrades(cached.recentTrades);
    }

    try {
      const query = accountId ? { tradingAccountId: accountId } : {};
      const [
        summaryResponse,
        instrumentsResponse,
        strategiesResponse,
        recentTradesResponse,
      ] = await Promise.all([
        getAnalyticsSummary(getAuthToken, query),
        getInstrumentPerformance(getAuthToken, query),
        getStrategyPerformance(getAuthToken, query),
        listTrades(getAuthToken, {
          limit: 5,
          sort: "openedAt_desc",
          ...query,
        }),
      ]);

      if (requestIdRef.current !== requestId) {
        return;
      }

      const snapshot: DashboardSnapshot = {
        summary: summaryResponse.data,
        instruments: instrumentsResponse.data,
        strategies: strategiesResponse.data,
        recentTrades: recentTradesResponse.data,
      };

      setCached(cacheKey, snapshot);
      setSummary(snapshot.summary);
      setInstruments(snapshot.instruments);
      setStrategies(snapshot.strategies);
      setRecentTrades(snapshot.recentTrades);
      await refreshLiveTrades({ silent: true });
    } catch (err) {
      if (requestIdRef.current !== requestId) {
        return;
      }

      if (!cached) {
        toast.error(
          err instanceof Error ? err.message : "Failed to refresh dashboard.",
        );
      }
    }
  }, [accountId, getAuthToken, refreshLiveTrades]);

  const { isAccountSwitchLoading } = useAccountSwitchLoading(
    isReady,
    accountId,
    handleApplyFilter,
    {
      skipInitial: shouldSkipServerMatchedAccountLoad(
        accountId,
        serverSelectedAccountId,
      ),
    },
  );

  useTradeDataRefresh(isReady, handleApplyFilter);

  const accountLabel = resolveAccountLabel(accounts, accountId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <PageHeader
          eyebrow="Dashboard"
          title={
            isLoaded && displayName
              ? `Welcome back, ${displayName}`
              : "Welcome back"
          }
          description="Performance overview powered by backend analytics."
        />
        <div className="w-full max-w-md space-y-2">
          <Label htmlFor="dashboard-account">Account</Label>
          <DropdownSelect
            id="dashboard-account"
            name="dashboard-account"
            options={accountOptions}
            value={accountId}
            onValueChange={setAccountId}
          />
        </div>
      </div>

      <AccountSwitchLoadingOverlay
        isLoading={isAccountSwitchLoading}
        accountLabel={accountLabel}
      >
        <DashboardSummaryCards summary={summary} />

        <OpenPositionsCard
          positions={positions}
          showViewAll
          title="Live positions"
          description={
            lastMt5SnapshotAt
              ? `Open journal positions with MT5 live pricing. MT5 data last received ${formatApp(lastMt5SnapshotAt)}.`
              : "Open journal positions with MT5 live pricing when sync is active."
          }
        />

        <div className="grid gap-6 xl:grid-cols-2 xl:items-stretch">
          <EquityCurveChart data={summary.equityCurve} />
          <DailyPerformanceCalendar
            days={summary.calendar}
            currency={summary.currency}
          />
        </div>

        <RecentTradesCard trades={recentTrades} />

        <div className="grid gap-6 xl:grid-cols-2">
          <InstrumentPerformanceTable
            rows={instruments}
            currency={summary.currency}
          />
          <StrategyPerformanceTable
            rows={strategies}
            currency={summary.currency}
          />
        </div>
      </AccountSwitchLoadingOverlay>
    </div>
  );
}
