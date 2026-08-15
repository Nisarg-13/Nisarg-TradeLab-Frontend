"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/page-header";
import { DashboardSummaryCards } from "@/components/dashboard/dashboard-summary-cards";
import { EquityCurveChart } from "@/components/dashboard/equity-curve-chart";
import { PlanComplianceCard } from "@/components/dashboard/plan-compliance-card";
import {
  InstrumentPerformanceTable,
  StrategyPerformanceTable,
} from "@/components/dashboard/performance-tables";
import { RecentTradesCard } from "@/components/dashboard/recent-trades-card";
import { RiskStatsTable } from "@/components/dashboard/risk-stats-table";
import { TradingCalendar } from "@/components/dashboard/trading-calendar";
import { OpenPositionsCard } from "@/components/live-trades/open-positions-card";
import { Button } from "@/components/ui/button";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Label } from "@/components/ui/label";
import {
  getAnalyticsSummary,
  getInstrumentPerformance,
  getPlanCompliance,
  getRiskStats,
  getStrategyPerformance,
} from "@/lib/api/analytics";
import { listTrades } from "@/lib/api/trades";
import { useClientAuthToken } from "@/lib/auth/client";
import type { TradingAccount } from "@/types/account";
import type {
  AnalyticsSummary,
  InstrumentPerformance,
  PlanComplianceGroup,
  RiskStatGroup,
  StrategyPerformance,
} from "@/types/analytics";
import type { Trade } from "@/types/trade";

export function DashboardManager({
  welcomeEmail,
  accounts,
  initialSummary,
  initialInstruments,
  initialStrategies,
  initialPlanCompliance,
  initialRiskStats,
  recentTrades,
  openTrades,
}: {
  welcomeEmail: string | null;
  accounts: TradingAccount[];
  initialSummary: AnalyticsSummary;
  initialInstruments: InstrumentPerformance[];
  initialStrategies: StrategyPerformance[];
  initialPlanCompliance: PlanComplianceGroup[];
  initialRiskStats: RiskStatGroup[];
  recentTrades: Trade[];
  openTrades: Trade[];
}) {
  const router = useRouter();
  const getAuthToken = useClientAuthToken();
  const [accountId, setAccountId] = useState("");
  const [summary, setSummary] = useState(initialSummary);
  const [instruments, setInstruments] = useState(initialInstruments);
  const [strategies, setStrategies] = useState(initialStrategies);
  const [planCompliance, setPlanCompliance] = useState(initialPlanCompliance);
  const [riskStats, setRiskStats] = useState(initialRiskStats);
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
        planComplianceResponse,
        riskStatsResponse,
        openTradesResponse,
      ] = await Promise.all([
        getAnalyticsSummary(getAuthToken, query),
        getInstrumentPerformance(getAuthToken, query),
        getStrategyPerformance(getAuthToken, query),
        getPlanCompliance(getAuthToken, query),
        getRiskStats(getAuthToken, query),
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
      setPlanCompliance(planComplianceResponse.data);
      setRiskStats(riskStatsResponse.data);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <PageHeader
          eyebrow="Dashboard"
          title={
            welcomeEmail ? `Welcome back, ${welcomeEmail}` : "Welcome back"
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
        trades={positions}
        showViewAll
        title="Live positions"
        description="Open journal positions. MT5 live sync arrives in a later phase."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <EquityCurveChart data={summary.equityCurve} />
        <RecentTradesCard trades={recentTrades} />
      </div>

      <TradingCalendar days={summary.calendar} currency={summary.currency} />

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

      <div className="grid gap-6 xl:grid-cols-2">
        <PlanComplianceCard
          groups={planCompliance}
          currency={summary.currency}
        />
        <RiskStatsTable groups={riskStats} currency={summary.currency} />
      </div>
    </div>
  );
}
