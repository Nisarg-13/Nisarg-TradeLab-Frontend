"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { AnalyticsFilters } from "@/components/analytics/analytics-filters";
import { AnalyticsOverviewCards } from "@/components/analytics/analytics-overview-cards";
import { ConcentrationPanel } from "@/components/analytics/concentration-panel";
import { DirectionAnalyticsPanel } from "@/components/analytics/direction-analytics-panel";
import { MetricsGroupsTable } from "@/components/analytics/metrics-groups-table";
import { PeriodComparisonPanel } from "@/components/analytics/period-comparison-panel";
import { TradeCountPhrase } from "@/components/analytics/trade-count-display";
import { SessionPerformancePanel } from "@/components/analytics/session-performance/session-performance-panel";
import { TimeHeatmap } from "@/components/analytics/time-heatmap";
import { useTimezone } from "@/components/providers/timezone-provider";
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
  getConcentrationAnalytics,
  getDirectionAnalytics,
  getDurationAnalytics,
  getHeatmapAnalytics,
  getInsightsAnalytics,
  getInstrumentPerformance,
  getMistakeAnalytics,
  getPeriodComparison,
  getPlanCompliance,
  getPsychologyAnalytics,
  getRiskStats,
  getRollingPerformance,
  getSessionDashboard,
  getStrategyPerformance,
  getTagAnalytics,
  getTimeAnalytics,
} from "@/lib/api/analytics";
import { useClientAuthToken } from "@/lib/auth/client";
import {
  ANALYTICS_TABS,
  analyticsTabFromParams,
  countActiveAnalyticsFilters,
  parseAnalyticsQuery,
  serializeAnalyticsTab,
  type AnalyticsTabId,
} from "@/lib/analytics/query-state";
import { usePersistedAccountId } from "@/lib/hooks/use-persisted-account-id";
import { useAutoReloadOnAccountChange } from "@/lib/hooks/use-auto-reload-on-account-change";
import { useTradeDataRefresh } from "@/lib/hooks/use-trade-data-refresh";
import {
  TIMEZONE_CHANGE_EVENT,
  getTimezoneLabel,
} from "@/lib/constants/timezones";
import {
  applyProfileTimeLabels,
  formatTwoHourWindow24,
  getCurrentTwoHourWindowStart,
} from "@/lib/formatting/time-windows";
import { cn } from "@/lib/utils";
import type { TradingAccount } from "@/types/account";
import type {
  AnalyticsQuery,
  AnalyticsSummary,
  ConcentrationAnalytics,
  DirectionAnalytics,
  HeatmapMetric,
  InstrumentPerformance,
  MistakeAnalyticsGroup,
  PeriodComparison,
  PeriodComparisonMode,
  PlanComplianceGroup,
  PsychologyAnalytics,
  RiskStatGroup,
  RollingPerformance,
  SessionDashboard,
  StrategyPerformance,
  TagAnalyticsGroup,
  TimeAnalytics,
  TradeMetricsGroup,
  HeatmapCell,
  InsightsAnalytics,
} from "@/types/analytics";
import type { Mistake, Strategy, Tag } from "@/types/strategy";

export function AnalyticsManager({
  accounts,
  strategies,
  tags,
  mistakes,
  initialSummary,
  initialInstruments,
  initialSessionDashboard,
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
  initialDirection,
  initialTagAnalytics,
  initialConcentration,
  initialInsights,
}: {
  accounts: TradingAccount[];
  strategies: Strategy[];
  tags: Tag[];
  mistakes: Mistake[];
  initialSummary: AnalyticsSummary;
  initialInstruments: InstrumentPerformance[];
  initialSessionDashboard: SessionDashboard;
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
  initialDirection: DirectionAnalytics;
  initialTagAnalytics: TagAnalyticsGroup[];
  initialConcentration: ConcentrationAnalytics;
  initialInsights: InsightsAnalytics;
}) {
  const getAuthToken = useClientAuthToken();
  const { isLoaded: isAuthLoaded } = useAuth();
  const { timezone } = useTimezone();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilters = useMemo(
    () => parseAnalyticsQuery(searchParams),
    [searchParams],
  );
  const tabFromUrl = useMemo(
    () => analyticsTabFromParams(searchParams),
    [searchParams],
  );
  const activeTab = tabFromUrl;
  const { accountId, setAccountId, isReady } = usePersistedAccountId(accounts);
  const skipAccountReloadRef = useRef(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<AnalyticsQuery>(initialFilters);
  const [draftFilters, setDraftFilters] =
    useState<AnalyticsQuery>(initialFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState(initialSummary);
  const [instruments, setInstruments] = useState(initialInstruments);
  const [sessionDashboard, setSessionDashboard] = useState(
    initialSessionDashboard,
  );
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
  const [directionAnalytics, setDirectionAnalytics] =
    useState(initialDirection);
  const [tagAnalytics, setTagAnalytics] = useState(initialTagAnalytics);
  const [concentrationAnalytics, setConcentrationAnalytics] =
    useState(initialConcentration);
  const [insightsAnalytics, setInsightsAnalytics] = useState(initialInsights);
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
      ...appliedFilters,
      tradingAccountId:
        (appliedFilters.tradingAccountId ?? accountId) || undefined,
      timezone,
    }),
    [accountId, appliedFilters, timezone],
  );

  const localizedTimeAnalytics = useMemo(
    () => applyProfileTimeLabels(timeAnalytics),
    [timeAnalytics],
  );

  const currentTwoHourWindow = useMemo(
    () => formatTwoHourWindow24(getCurrentTwoHourWindowStart(timezone)),
    [timezone],
  );

  const timezoneLabel = useMemo(() => getTimezoneLabel(timezone), [timezone]);

  const activeFilterCount = countActiveAnalyticsFilters(
    appliedFilters,
    accountId,
  );

  function buildQueryFromFilters(filters: AnalyticsQuery): AnalyticsQuery {
    return {
      ...filters,
      tradingAccountId: (filters.tradingAccountId ?? accountId) || undefined,
      timezone,
    };
  }

  function syncUrl(nextFilters: AnalyticsQuery, tab = activeTab) {
    router.replace(
      `/analytics/overview${serializeAnalyticsTab(tab, nextFilters)}`,
      { scroll: false },
    );
  }

  function handleTabChange(tab: AnalyticsTabId) {
    syncUrl(queryFilters, tab);
  }

  function openFilters() {
    setDraftFilters(appliedFilters);
    setFiltersOpen(true);
  }

  function toggleFilters() {
    if (filtersOpen) {
      setFiltersOpen(false);
      return;
    }

    openFilters();
  }

  function handleFiltersChange(next: AnalyticsQuery) {
    setDraftFilters(next);
  }

  async function applyFilters(overrideDraft?: AnalyticsQuery) {
    const nextDraft = overrideDraft ?? draftFilters;
    const nextAccountId = nextDraft.tradingAccountId ?? "";

    if (nextAccountId !== accountId) {
      skipAccountReloadRef.current = true;
      setAccountId(nextAccountId);
    }

    setDraftFilters(nextDraft);
    setAppliedFilters(nextDraft);
    setFiltersOpen(false);

    const nextQuery = buildQueryFromFilters(nextDraft);
    syncUrl(nextQuery);
    await loadAnalytics(nextQuery);
  }

  function handleAccountFilterChange(value: string) {
    const nextDraft: AnalyticsQuery = {
      ...draftFilters,
      tradingAccountId: value || undefined,
    };

    void applyFilters(nextDraft);
  }

  function clearFilters() {
    const cleared: AnalyticsQuery = {
      tradingAccountId: accountId || undefined,
    };

    setDraftFilters(cleared);
    setAppliedFilters(cleared);
    setFiltersOpen(false);

    const nextQuery = buildQueryFromFilters(cleared);
    syncUrl(nextQuery);
    void loadAnalytics(nextQuery);
  }

  const loadAnalytics = useCallback(
    async (query: AnalyticsQuery = queryFilters) => {
      setIsLoading(true);

      const failures: string[] = [];

      try {
        const results = await Promise.allSettled([
          getAnalyticsSummary(getAuthToken, query),
          getInstrumentPerformance(getAuthToken, query),
          getSessionDashboard(getAuthToken, query),
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
          getDirectionAnalytics(getAuthToken, query),
          getTagAnalytics(getAuthToken, query),
          getConcentrationAnalytics(getAuthToken, query),
          getInsightsAnalytics(getAuthToken, query),
        ]);

        const [
          summaryResult,
          instrumentsResult,
          sessionDashboardResult,
          strategiesResult,
          planComplianceResult,
          riskStatsResult,
          timeResult,
          heatmapResult,
          psychologyResult,
          mistakesResult,
          durationResult,
          rollingResult,
          comparisonResult,
          directionResult,
          tagsResult,
          concentrationResult,
          insightsResult,
        ] = results;

        if (summaryResult.status === "fulfilled") {
          setSummary(summaryResult.value.data);
        } else {
          failures.push("overview");
        }

        if (instrumentsResult.status === "fulfilled") {
          setInstruments(instrumentsResult.value.data);
        } else {
          failures.push("instruments");
        }

        if (sessionDashboardResult.status === "fulfilled") {
          setSessionDashboard(sessionDashboardResult.value.data);
        } else {
          failures.push("sessions");
        }

        if (strategiesResult.status === "fulfilled") {
          setStrategyRows(strategiesResult.value.data);
        } else {
          failures.push("strategies");
        }

        if (planComplianceResult.status === "fulfilled") {
          setPlanCompliance(planComplianceResult.value.data);
        } else {
          failures.push("plan compliance");
        }

        if (riskStatsResult.status === "fulfilled") {
          setRiskStats(riskStatsResult.value.data);
        } else {
          failures.push("risk");
        }

        if (timeResult.status === "fulfilled") {
          setTimeAnalytics(timeResult.value.data);
        } else {
          failures.push("time");
        }

        if (heatmapResult.status === "fulfilled") {
          setHeatmapCells(heatmapResult.value.data.cells);
        } else {
          failures.push("heatmap");
        }

        if (psychologyResult.status === "fulfilled") {
          setPsychology(psychologyResult.value.data);
        } else {
          failures.push("psychology");
        }

        if (mistakesResult.status === "fulfilled") {
          setMistakeAnalytics(mistakesResult.value.data);
        } else {
          failures.push("mistakes");
        }

        if (durationResult.status === "fulfilled") {
          setDurationAnalytics(durationResult.value.data);
        } else {
          failures.push("duration");
        }

        if (rollingResult.status === "fulfilled") {
          setRolling(rollingResult.value.data);
        } else {
          failures.push("rolling");
        }

        if (comparisonResult.status === "fulfilled") {
          setComparison(comparisonResult.value.data);
        } else {
          failures.push("comparison");
        }

        if (directionResult.status === "fulfilled") {
          setDirectionAnalytics(directionResult.value.data);
        } else {
          failures.push("direction");
        }

        if (tagsResult.status === "fulfilled") {
          setTagAnalytics(tagsResult.value.data);
        } else {
          failures.push("tags");
        }

        if (concentrationResult.status === "fulfilled") {
          setConcentrationAnalytics(concentrationResult.value.data);
        } else {
          failures.push("concentration");
        }

        if (insightsResult.status === "fulfilled") {
          setInsightsAnalytics(insightsResult.value.data);
        } else {
          failures.push("insights");
        }

        if (failures.length > 0) {
          toast.error(
            failures.length === results.length
              ? "Failed to load analytics."
              : `Some analytics sections failed to load: ${failures.join(", ")}.`,
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [comparisonMode, customDates, getAuthToken, heatmapMetric, queryFilters],
  );

  useAutoReloadOnAccountChange(
    isReady && isAuthLoaded,
    accountId,
    () => loadAnalytics(),
    {
      skipInitial: false,
      consumeSkipReload: () => {
        if (!skipAccountReloadRef.current) {
          return false;
        }

        skipAccountReloadRef.current = false;
        return true;
      },
    },
  );

  useTradeDataRefresh(isReady && isAuthLoaded, () => loadAnalytics());

  useEffect(() => {
    function handleTimezoneChange() {
      void loadAnalytics();
    }

    window.addEventListener(TIMEZONE_CHANGE_EVENT, handleTimezoneChange);
    return () => {
      window.removeEventListener(TIMEZONE_CHANGE_EVENT, handleTimezoneChange);
    };
  }, [loadAnalytics]);

  const mistakeRows = useMemo(
    () =>
      mistakeAnalytics.map((row) => ({
        key: row.mistakeId,
        label: row.mistakeName,
        tradeCount: row.tradeCount,
        winCount: row.winCount,
        lossCount: row.lossCount,
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

  const tagRows = useMemo(
    () =>
      tagAnalytics.map((row) => ({
        key: row.tagId,
        label: row.tagName,
        tradeCount: row.tradeCount,
        winCount: row.winCount,
        lossCount: row.lossCount,
        netPnl: row.netPnl,
        totalR: row.totalR,
        winRate: row.winRate,
        averageR: row.averageR,
        moneyExpectancy: row.moneyExpectancy,
        rExpectancy: row.rExpectancy,
        profitFactor: row.profitFactor,
        sampleConfidence: row.sampleConfidence,
      })),
    [tagAnalytics],
  );

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
        tags={tags}
        mistakes={mistakes}
        draftFilters={draftFilters}
        accountId={accountId}
        activeFilterCount={activeFilterCount}
        filtersOpen={filtersOpen}
        isLoading={isLoading}
        onToggleOpen={toggleFilters}
        onChange={handleFiltersChange}
        onAccountChange={handleAccountFilterChange}
        onApply={() => void applyFilters()}
        onClear={() => void clearFilters()}
      />

      <div className="border-border flex flex-wrap gap-2 border-b pb-2">
        {ANALYTICS_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabChange(tab.id)}
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
          <AnalyticsOverviewCards summary={summary} />
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

      {activeTab === "sessions" ? (
        <SessionPerformancePanel
          dashboard={sessionDashboard}
          highlights={insightsAnalytics.highlights}
          sessionSymbols={insightsAnalytics.sessionSymbols}
          currency={currency}
        />
      ) : null}

      {activeTab === "instruments" ? (
        <InstrumentPerformanceTable rows={instruments} currency={currency} />
      ) : null}

      {activeTab === "strategies" ? (
        <StrategyPerformanceTable rows={strategyRows} currency={currency} />
      ) : null}

      {activeTab === "direction" ? (
        <DirectionAnalyticsPanel
          data={directionAnalytics}
          currency={currency}
        />
      ) : null}

      {activeTab === "time" ? (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Profile timezone</CardTitle>
              <CardDescription>
                Time windows use the same timezone as the header clock (
                {timezoneLabel}). Current 2-hour window: {currentTwoHourWindow}.
              </CardDescription>
            </CardHeader>
          </Card>
          <MetricsGroupsTable
            title="2-hour windows"
            description={`Closed-trade stats grouped by 2-hour entry (open) windows in ${timezoneLabel}. A trade is counted when it was opened during that window, not when it closed.`}
            rows={localizedTimeAnalytics.twoHourWindows}
            currency={currency}
            nameHeader="Window"
            showTimeEntries
            showConfidence={false}
            showRColumns={false}
          />
          <MetricsGroupsTable
            title="Hour of day"
            description={`Closed-trade stats grouped by entry (open) hour in ${timezoneLabel}.`}
            rows={localizedTimeAnalytics.hours}
            currency={currency}
            nameHeader="Hour"
            showTimeEntries
            showConfidence={false}
            showRColumns={false}
          />
          <MetricsGroupsTable
            title="Day of week"
            description="Closed-trade stats grouped by weekday."
            rows={localizedTimeAnalytics.daysOfWeek}
            currency={currency}
            nameHeader="Day"
            showConfidence={false}
            showRColumns={false}
          />
          <MetricsGroupsTable
            title="Month"
            description="Closed-trade stats grouped by calendar month."
            rows={localizedTimeAnalytics.months}
            currency={currency}
            nameHeader="Month"
            showConfidence={false}
            showRColumns={false}
          />
          <MetricsGroupsTable
            title="Trade duration"
            description="How long closed trades stayed open before exit."
            rows={durationAnalytics}
            currency={currency}
            nameHeader="Duration"
            showConfidence={false}
            showRColumns={false}
          />
          <TimeHeatmap
            cells={heatmapCells}
            metric={heatmapMetric}
            timezoneLabel={timezoneLabel}
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
          <MetricsGroupsTable
            title="Confidence score"
            description="Performance grouped by pre-trade confidence buckets."
            rows={psychology.confidence}
            currency={currency}
            nameHeader="Bucket"
          />
          <MetricsGroupsTable
            title="Market bias"
            description="Performance grouped by your pre-trade market bias."
            rows={psychology.marketBias}
            currency={currency}
            nameHeader="Bias"
          />
          <MetricsGroupsTable
            title="Bias alignment"
            description="Whether trade direction matched your stated market bias."
            rows={psychology.biasAlignment}
            currency={currency}
            nameHeader="Alignment"
          />
          <PlanComplianceCard groups={planCompliance} currency={currency} />
        </div>
      ) : null}

      {activeTab === "setups" ? (
        <MetricsGroupsTable
          title="Entry criteria analytics"
          description="Performance for trades tagged with each entry criterion."
          rows={tagRows}
          currency={currency}
          nameHeader="Tag"
        />
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
          <ConcentrationPanel
            data={concentrationAnalytics}
            currency={currency}
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
                    <TradeCountPhrase
                      tradeCount={rolling.currentWindow.tradeCount}
                      winCount={rolling.currentWindow.winCount}
                      lossCount={rolling.currentWindow.lossCount}
                    />
                    {" · win rate "}
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
                    <TradeCountPhrase
                      tradeCount={rolling.previousWindow.tradeCount}
                      winCount={rolling.previousWindow.winCount}
                      lossCount={rolling.previousWindow.lossCount}
                    />
                    {" · win rate "}
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
