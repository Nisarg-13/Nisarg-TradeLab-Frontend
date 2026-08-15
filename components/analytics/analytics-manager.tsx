"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AnalyticsFilters } from "@/components/analytics/analytics-filters";
import { MetricsGroupsTable } from "@/components/analytics/metrics-groups-table";
import { PeriodComparisonPanel } from "@/components/analytics/period-comparison-panel";
import { TimeHeatmap } from "@/components/analytics/time-heatmap";
import { DashboardSummaryCards } from "@/components/dashboard/dashboard-summary-cards";
import { DailyPerformanceCalendar } from "@/components/dashboard/daily-performance-calendar";
import { EquityCurveChart } from "@/components/dashboard/equity-curve-chart";
import {
  InstrumentPerformanceTable,
  StrategyPerformanceTable,
} from "@/components/dashboard/performance-tables";
import { PlanComplianceCard } from "@/components/dashboard/plan-compliance-card";
import { RiskStatsTable } from "@/components/dashboard/risk-stats-table";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getAnalyticsSummary,
  getDurationAnalytics,
  getHeatmapAnalytics,
  getInstrumentPerformance,
  getMistakeAnalytics,
  getPeriodComparison,
  getPlanCompliance,
  getPsychologyAnalytics,
  getRiskStats,
  getRollingPerformance,
  getStrategyPerformance,
  getTimeAnalytics,
} from "@/lib/api/analytics";
import { useClientAuthToken } from "@/lib/auth/client";
import {
  useInitialPersistedAccountLoad,
  usePersistedAccountId,
} from "@/lib/hooks/use-persisted-account-id";
import { cn } from "@/lib/utils";
import type { TradingAccount } from "@/types/account";
import type {
  AnalyticsQuery,
  AnalyticsSummary,
  HeatmapMetric,
  InstrumentPerformance,
  MistakeAnalyticsGroup,
  PeriodComparison,
  PeriodComparisonMode,
  PlanComplianceGroup,
  PsychologyAnalytics,
  RiskStatGroup,
  RollingPerformance,
  StrategyPerformance,
  TimeAnalytics,
  TradeMetricsGroup,
  HeatmapCell,
} from "@/types/analytics";
import type { Mistake, Strategy } from "@/types/strategy";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "instruments", label: "Instruments" },
  { id: "strategies", label: "Strategies" },
  { id: "time", label: "Time" },
  { id: "risk", label: "Risk" },
  { id: "psychology", label: "Psychology" },
  { id: "mistakes", label: "Mistakes" },
  { id: "compare", label: "Compare" },
] as const;

type AnalyticsTab = (typeof TABS)[number]["id"];

export function AnalyticsManager({
  accounts,
  strategies,
  mistakes,
  initialSummary,
  initialInstruments,
  initialStrategies,
  initialPlanCompliance,
  initialRiskStats,
  initialTime,
  initialHeatmapMetric,
  initialHeatmap,
  initialPsychology,
  initialMistakeAnalytics,
  initialDuration,
  initialRolling,
  initialComparison,
}: {
  accounts: TradingAccount[];
  strategies: Strategy[];
  mistakes: Mistake[];
  initialSummary: AnalyticsSummary;
  initialInstruments: InstrumentPerformance[];
  initialStrategies: StrategyPerformance[];
  initialPlanCompliance: PlanComplianceGroup[];
  initialRiskStats: RiskStatGroup[];
  initialTime: TimeAnalytics;
  initialHeatmapMetric: HeatmapMetric;
  initialHeatmap: HeatmapCell[];
  initialPsychology: PsychologyAnalytics;
  initialMistakeAnalytics: MistakeAnalyticsGroup[];
  initialDuration: TradeMetricsGroup[];
  initialRolling: RollingPerformance;
  initialComparison: PeriodComparison;
}) {
  const getAuthToken = useClientAuthToken();
  const { accountId, setAccountId, isReady } = usePersistedAccountId(accounts);
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("overview");
  const [filters, setFilters] = useState<AnalyticsQuery>({});
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState(initialSummary);
  const [instruments, setInstruments] = useState(initialInstruments);
  const [strategyRows, setStrategyRows] = useState(initialStrategies);
  const [planCompliance, setPlanCompliance] = useState(initialPlanCompliance);
  const [riskStats, setRiskStats] = useState(initialRiskStats);
  const [timeAnalytics, setTimeAnalytics] = useState(initialTime);
  const [heatmapMetric, setHeatmapMetric] =
    useState<HeatmapMetric>(initialHeatmapMetric);
  const [heatmapCells, setHeatmapCells] = useState(initialHeatmap);
  const [psychology, setPsychology] = useState(initialPsychology);
  const [mistakeAnalytics, setMistakeAnalytics] = useState(
    initialMistakeAnalytics,
  );
  const [durationAnalytics, setDurationAnalytics] = useState(initialDuration);
  const [rolling, setRolling] = useState(initialRolling);
  const [comparison, setComparison] = useState(initialComparison);
  const [comparisonMode, setComparisonMode] = useState<PeriodComparisonMode>(
    initialComparison.mode,
  );
  const [customDates, setCustomDates] = useState({
    periodAFrom: "",
    periodATo: "",
    periodBFrom: "",
    periodBTo: "",
  });

  const currency = summary.currency;

  const queryFilters = useMemo<AnalyticsQuery>(
    () => ({
      ...filters,
      tradingAccountId: (filters.tradingAccountId ?? accountId) || undefined,
    }),
    [accountId, filters],
  );

  function handleFiltersChange(next: AnalyticsQuery) {
    setFilters(next);

    const nextAccountId = next.tradingAccountId ?? "";
    const currentAccountId = filters.tradingAccountId ?? accountId ?? "";

    if (nextAccountId !== currentAccountId) {
      setAccountId(nextAccountId);
    }
  }

  useInitialPersistedAccountLoad(
    isReady,
    () => loadAnalytics(),
    Boolean(accountId),
  );

  const mistakeRows = useMemo(
    () =>
      mistakeAnalytics.map((row) => ({
        key: row.mistakeId,
        label: row.mistakeName,
        tradeCount: row.tradeCount,
        netPnl: row.netPnl,
        totalR: row.totalR,
        winRate: row.winRate,
        averageR: row.averageR,
        moneyExpectancy: row.moneyExpectancy,
        rExpectancy: row.rExpectancy,
        profitFactor: row.profitFactor,
        sampleConfidence: row.sampleConfidence,
      })),
    [mistakeAnalytics],
  );

  async function loadAnalytics(query: AnalyticsQuery = queryFilters) {
    setIsLoading(true);

    try {
      const [
        summaryResponse,
        instrumentsResponse,
        strategiesResponse,
        planComplianceResponse,
        riskStatsResponse,
        timeResponse,
        heatmapResponse,
        psychologyResponse,
        mistakesResponse,
        durationResponse,
        rollingResponse,
        comparisonResponse,
      ] = await Promise.all([
        getAnalyticsSummary(getAuthToken, query),
        getInstrumentPerformance(getAuthToken, query),
        getStrategyPerformance(getAuthToken, query),
        getPlanCompliance(getAuthToken, query),
        getRiskStats(getAuthToken, query),
        getTimeAnalytics(getAuthToken, query),
        getHeatmapAnalytics(getAuthToken, query, heatmapMetric),
        getPsychologyAnalytics(getAuthToken, query),
        getMistakeAnalytics(getAuthToken, query),
        getDurationAnalytics(getAuthToken, query),
        getRollingPerformance(getAuthToken, query),
        getPeriodComparison(
          getAuthToken,
          query,
          comparisonMode,
          comparisonMode === "CUSTOM" ? customDates : undefined,
        ),
      ]);

      setSummary(summaryResponse.data);
      setInstruments(instrumentsResponse.data);
      setStrategyRows(strategiesResponse.data);
      setPlanCompliance(planComplianceResponse.data);
      setRiskStats(riskStatsResponse.data);
      setTimeAnalytics(timeResponse.data);
      setHeatmapCells(heatmapResponse.data.cells);
      setPsychology(psychologyResponse.data);
      setMistakeAnalytics(mistakesResponse.data);
      setDurationAnalytics(durationResponse.data);
      setRolling(rollingResponse.data);
      setComparison(comparisonResponse.data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to refresh analytics.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleHeatmapMetricChange(metric: HeatmapMetric) {
    setHeatmapMetric(metric);

    try {
      const response = await getHeatmapAnalytics(
        getAuthToken,
        queryFilters,
        metric,
      );
      setHeatmapCells(response.data.cells);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to refresh heatmap.",
      );
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Analytics"
        title="Advanced analytics"
        description="Slice performance by time, psychology, mistakes, risk, and period comparisons."
      />

      <AnalyticsFilters
        accounts={accounts}
        strategies={strategies}
        mistakes={mistakes}
        filters={filters}
        accountId={accountId}
        isLoading={isLoading}
        onChange={handleFiltersChange}
        onApply={() => void loadAnalytics()}
      />

      <div className="border-border flex flex-wrap gap-2 border-b pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-lg px-3 py-2 text-sm transition-colors",
              activeTab === tab.id
                ? "bg-card-hover text-primary font-medium"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" ? (
        <div className="space-y-6">
          <DashboardSummaryCards summary={summary} />
          <div className="grid gap-6 xl:grid-cols-2 xl:items-stretch">
            <EquityCurveChart data={summary.equityCurve} />
            <DailyPerformanceCalendar
              days={summary.calendar}
              currency={currency}
            />
          </div>
          <PlanComplianceCard groups={planCompliance} currency={currency} />
        </div>
      ) : null}

      {activeTab === "instruments" ? (
        <InstrumentPerformanceTable rows={instruments} currency={currency} />
      ) : null}

      {activeTab === "strategies" ? (
        <StrategyPerformanceTable rows={strategyRows} currency={currency} />
      ) : null}

      {activeTab === "time" ? (
        <div className="space-y-6">
          <MetricsGroupsTable
            title="Trading sessions"
            description="Performance grouped by Asia, London, New York, and off-hours in your profile timezone."
            rows={timeAnalytics.sessions}
            currency={currency}
            nameHeader="Session"
          />
          <MetricsGroupsTable
            title="Hour of day"
            description="Closed-trade stats grouped by entry hour."
            rows={timeAnalytics.hours}
            currency={currency}
            nameHeader="Hour"
          />
          <MetricsGroupsTable
            title="Day of week"
            description="Closed-trade stats grouped by weekday."
            rows={timeAnalytics.daysOfWeek}
            currency={currency}
            nameHeader="Day"
          />
          <MetricsGroupsTable
            title="Month"
            description="Closed-trade stats grouped by calendar month."
            rows={timeAnalytics.months}
            currency={currency}
            nameHeader="Month"
          />
          <MetricsGroupsTable
            title="Trade duration"
            description="How long closed trades stayed open before exit."
            rows={durationAnalytics}
            currency={currency}
            nameHeader="Duration"
          />
          <TimeHeatmap
            cells={heatmapCells}
            metric={heatmapMetric}
            onMetricChange={(metric) => void handleHeatmapMetricChange(metric)}
          />
        </div>
      ) : null}

      {activeTab === "risk" ? (
        <RiskStatsTable groups={riskStats} currency={currency} />
      ) : null}

      {activeTab === "psychology" ? (
        <div className="space-y-6">
          <MetricsGroupsTable
            title="Pre-trade emotions"
            description="Measured association between pre-trade emotion tags and outcomes."
            rows={psychology.preTradeEmotions}
            currency={currency}
            nameHeader="Emotion"
          />
          <MetricsGroupsTable
            title="Post-trade emotions"
            description="Measured association between post-trade emotion tags and outcomes."
            rows={psychology.postTradeEmotions}
            currency={currency}
            nameHeader="Emotion"
          />
          <PlanComplianceCard groups={planCompliance} currency={currency} />
        </div>
      ) : null}

      {activeTab === "mistakes" ? (
        <MetricsGroupsTable
          title="Mistake analytics"
          description="Association only — mistakes tagged on closed trades, without causation claims."
          rows={mistakeRows}
          currency={currency}
          nameHeader="Mistake"
        />
      ) : null}

      {activeTab === "compare" ? (
        <div className="space-y-6">
          <PeriodComparisonPanel
            comparison={comparison}
            mode={comparisonMode}
            customDates={customDates}
            isLoading={isLoading}
            onModeChange={setComparisonMode}
            onCustomDatesChange={(field, value) =>
              setCustomDates((current) => ({ ...current, [field]: value }))
            }
            onApply={() => void loadAnalytics()}
          />
          <div className="grid gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Rolling {rolling.windowSize}</CardTitle>
                <CardDescription>
                  Latest closed-trade window versus the previous window.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-xs uppercase">
                    Current window
                  </p>
                  <p className="tabular-data text-2xl font-semibold">
                    {rolling.currentWindow.netPnl}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {rolling.currentWindow.tradeCount} trades · win rate{" "}
                    {rolling.currentWindow.winRate ?? "—"}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase">
                    Previous window
                  </p>
                  <p className="tabular-data text-2xl font-semibold">
                    {rolling.previousWindow.netPnl}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {rolling.previousWindow.tradeCount} trades · win rate{" "}
                    {rolling.previousWindow.winRate ?? "—"}%
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Rolling trend</CardTitle>
                <CardDescription>
                  Window net PnL after each closed trade.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {rolling.points.slice(-8).map((point) => (
                  <div
                    key={point.index}
                    className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                  >
                    <span className="text-muted-foreground">
                      Trade {point.index}
                    </span>
                    <span className="tabular-data font-medium">
                      {point.windowNetPnl}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
