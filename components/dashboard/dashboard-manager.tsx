"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/page-header";
import { DashboardSummaryCards } from "@/components/dashboard/dashboard-summary-cards";
import { DailyPerformanceCalendar } from "@/components/dashboard/daily-performance-calendar";
import { EquityCurveChart } from "@/components/dashboard/equity-curve-chart";
import {
  InstrumentPerformanceTable,
  StrategyPerformanceTable,
} from "@/components/dashboard/performance-tables";
import { RecentTradesCard } from "@/components/dashboard/recent-trades-card";
import { OpenPositionsCard } from "@/components/live-trades/open-positions-card";
import { mapTradeToLivePosition } from "@/lib/live-trades/map";
import { Button } from "@/components/ui/button";
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
  useInitialPersistedAccountLoad,
  usePersistedAccountId,
} from "@/lib/hooks/use-persisted-account-id";
import type { TradingAccount } from "@/types/account";
import type {
  AnalyticsSummary,
  InstrumentPerformance,
  StrategyPerformance,
} from "@/types/analytics";
import type { Trade } from "@/types/trade";

export function DashboardManager({
  accounts,
  initialSummary,
  initialInstruments,
  initialStrategies,
  recentTrades,
  openTrades,
}: {
  accounts: TradingAccount[];
  initialSummary: AnalyticsSummary;
  initialInstruments: InstrumentPerformance[];
  initialStrategies: StrategyPerformance[];
  recentTrades: Trade[];
  openTrades: Trade[];
}) {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const getAuthToken = useClientAuthToken();
  const displayName =
    user?.fullName ??
    user?.firstName ??
    user?.primaryEmailAddress?.emailAddress ??
    null;
  const { accountId, setAccountId, isReady } = usePersistedAccountId(accounts);
  const [summary, setSummary] = useState(initialSummary);
  const [instruments, setInstruments] = useState(initialInstruments);
  const [strategies, setStrategies] = useState(initialStrategies);
  const [positions, setPositions] = useState(openTrades);
  const [isLoading, setIsLoading] = useState(false);

  const accountOptions = [
    { value: "", label: "All accounts" },
    ...accounts.map((account) => ({
      value: account.id,
      label: account.name,
    })),
  ];

  async function handleApplyFilter() {
    setIsLoading(true);

    try {
      const query = accountId ? { tradingAccountId: accountId } : {};
      const [
        summaryResponse,
        instrumentsResponse,
        strategiesResponse,
        openTradesResponse,
      ] = await Promise.all([
        getAnalyticsSummary(getAuthToken, query),
        getInstrumentPerformance(getAuthToken, query),
        getStrategyPerformance(getAuthToken, query),
        listTrades(getAuthToken, {
          status: "OPEN",
          limit: 5,
          sort: "openedAt_desc",
          ...query,
        }),
      ]);

      setSummary(summaryResponse.data);
      setInstruments(instrumentsResponse.data);
      setStrategies(strategiesResponse.data);
      setPositions(openTradesResponse.data);
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to refresh dashboard.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useInitialPersistedAccountLoad(
    isReady,
    () => handleApplyFilter(),
    Boolean(accountId),
  );

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
        <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="dashboard-account">Account</Label>
            <DropdownSelect
              id="dashboard-account"
              name="dashboard-account"
              options={accountOptions}
              value={accountId}
              onValueChange={setAccountId}
            />
          </div>
          <Button
            type="button"
            disabled={isLoading}
            onClick={() => void handleApplyFilter()}
          >
            {isLoading ? "Loading..." : "Apply"}
          </Button>
        </div>
      </div>

      <DashboardSummaryCards summary={summary} />

      <OpenPositionsCard
        positions={positions.map(mapTradeToLivePosition)}
        showViewAll
        title="Live positions"
        description="Open journal positions with MT5 live pricing when sync is active."
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
    </div>
  );
}
