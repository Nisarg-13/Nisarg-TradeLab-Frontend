import { Suspense } from "react";

import { AnalyticsManager } from "@/components/analytics/analytics-manager";
import { EMPTY_ANALYTICS_SUMMARY } from "@/lib/analytics/empty-summary";
import {
  EMPTY_BEHAVIOR_ANALYTICS,
  EMPTY_CONCENTRATION_ANALYTICS,
  EMPTY_DIRECTION_ANALYTICS,
  EMPTY_EDGE_FINDER_ANALYTICS,
  EMPTY_EXECUTION_ANALYTICS,
  EMPTY_INSIGHTS_ANALYTICS,
  EMPTY_PLANNED_RR_ANALYTICS,
  EMPTY_TAG_ANALYTICS,
} from "@/lib/analytics/empty-analytics";
import { listAccounts } from "@/lib/api/accounts";
import {
  getAnalyticsSummary,
  getBehaviorAnalytics,
  getConcentrationAnalytics,
  getDirectionAnalytics,
  getDurationAnalytics,
  getEdgeFinderAnalytics,
  getExecutionAnalytics,
  getHeatmapAnalytics,
  getInsightsAnalytics,
  getInstrumentPerformance,
  getMistakeAnalytics,
  getPeriodComparison,
  getPlannedRrAnalytics,
  getPlanCompliance,
  getPsychologyAnalytics,
  getRiskStats,
  getRollingPerformance,
  getStrategyPerformance,
  getTagAnalytics,
  getTimeAnalytics,
} from "@/lib/api/analytics";
import { listMistakes, listStrategies, listTags } from "@/lib/api/strategies";
import { getServerAuthToken } from "@/lib/auth/server";
import {
  buildTradingAccountQuery,
  getServerSelectedAccountId,
} from "@/lib/preferences/server-selected-account";
import type { TradingAccount } from "@/types/account";
import type {
  AnalyticsSummary,
  HeatmapCell,
  HeatmapMetric,
  InstrumentPerformance,
  MistakeAnalyticsGroup,
  PeriodComparison,
  PlanComplianceGroup,
  PsychologyAnalytics,
  RiskStatGroup,
  RollingPerformance,
  StrategyPerformance,
  TimeAnalytics,
  TradeMetricsGroup,
  InsightsAnalytics,
} from "@/types/analytics";
import type { Mistake, Strategy, Tag } from "@/types/strategy";

const EMPTY_TIME: TimeAnalytics = {
  hours: [],
  twoHourWindows: [],
  daysOfWeek: [],
  months: [],
  sessions: [],
};

const EMPTY_PSYCHOLOGY: PsychologyAnalytics = {
  preTradeEmotions: [],
  postTradeEmotions: [],
  confidence: [],
  marketBias: [],
  biasAlignment: [],
};

const EMPTY_ROLLING: RollingPerformance = {
  windowSize: 20,
  currentWindow: {
    key: "all",
    label: "Current window",
    tradeCount: 0,
    netPnl: "0.00",
    totalR: null,
    winRate: null,
    averageR: null,
    moneyExpectancy: null,
    rExpectancy: null,
    profitFactor: null,
    sampleConfidence: "INSUFFICIENT",
  },
  previousWindow: {
    key: "all",
    label: "Previous window",
    tradeCount: 0,
    netPnl: "0.00",
    totalR: null,
    winRate: null,
    averageR: null,
    moneyExpectancy: null,
    rExpectancy: null,
    profitFactor: null,
    sampleConfidence: "INSUFFICIENT",
  },
  points: [],
};

const EMPTY_COMPARISON: PeriodComparison = {
  mode: "LATEST_20_VS_PREVIOUS_20",
  periodA: {
    label: "Latest 20 trades",
    tradeCount: 0,
    netPnl: "0.00",
    totalR: null,
    winRate: null,
    averageR: null,
    moneyExpectancy: null,
    profitFactor: null,
    maxDrawdownAmount: "0.00",
    maxDrawdownPercentage: "0.00",
    mistakeRate: null,
    planComplianceRate: null,
    averageRiskPercentage: null,
    averageHoldingTimeMinutes: null,
    totalTradingCosts: "0.00",
    sampleConfidence: "INSUFFICIENT",
  },
  periodB: {
    label: "Previous 20 trades",
    tradeCount: 0,
    netPnl: "0.00",
    totalR: null,
    winRate: null,
    averageR: null,
    moneyExpectancy: null,
    profitFactor: null,
    maxDrawdownAmount: "0.00",
    maxDrawdownPercentage: "0.00",
    mistakeRate: null,
    planComplianceRate: null,
    averageRiskPercentage: null,
    averageHoldingTimeMinutes: null,
    totalTradingCosts: "0.00",
    sampleConfidence: "INSUFFICIENT",
  },
  deltas: {
    netPnl: null,
    totalR: null,
    winRate: null,
    averageR: null,
    moneyExpectancy: null,
    profitFactor: null,
    mistakeRate: null,
    planComplianceRate: null,
    maxDrawdownAmount: null,
    maxDrawdownPercentage: null,
    averageRiskPercentage: null,
    averageHoldingTimeMinutes: null,
    totalTradingCosts: null,
  },
};

export default async function AnalyticsOverviewPage() {
  let accounts: TradingAccount[] = [];
  let strategies: Strategy[] = [];
  let tags: Tag[] = [];
  let mistakes: Mistake[] = [];
  let summary: AnalyticsSummary = EMPTY_ANALYTICS_SUMMARY;
  let instruments: InstrumentPerformance[] = [];
  let strategyRows: StrategyPerformance[] = [];
  let planCompliance: PlanComplianceGroup[] = [];
  let riskStats: RiskStatGroup[] = [];
  let timeAnalytics: TimeAnalytics = EMPTY_TIME;
  let heatmapCells: HeatmapCell[] = [];
  const heatmapMetric: HeatmapMetric = "pnl";
  let psychology: PsychologyAnalytics = EMPTY_PSYCHOLOGY;
  let mistakeAnalytics: MistakeAnalyticsGroup[] = [];
  let durationAnalytics: TradeMetricsGroup[] = [];
  let rolling: RollingPerformance = EMPTY_ROLLING;
  let comparison: PeriodComparison = EMPTY_COMPARISON;
  let directionAnalytics = EMPTY_DIRECTION_ANALYTICS;
  let behaviorAnalytics = EMPTY_BEHAVIOR_ANALYTICS;
  let tagAnalytics = EMPTY_TAG_ANALYTICS;
  let plannedRrAnalytics = EMPTY_PLANNED_RR_ANALYTICS;
  let concentrationAnalytics = EMPTY_CONCENTRATION_ANALYTICS;
  let executionAnalytics = EMPTY_EXECUTION_ANALYTICS;
  let edgeFinderAnalytics = EMPTY_EDGE_FINDER_ANALYTICS;
  let insightsAnalytics: InsightsAnalytics = EMPTY_INSIGHTS_ANALYTICS;

  try {
    const accountsResponse = await listAccounts(getServerAuthToken);
    accounts = accountsResponse.data;
  } catch {
    accounts = [];
  }

  try {
    const [strategiesResponse, mistakesResponse, tagsResponse] =
      await Promise.all([
        listStrategies(getServerAuthToken),
        listMistakes(getServerAuthToken),
        listTags(getServerAuthToken),
      ]);
    strategies = strategiesResponse.data;
    mistakes = mistakesResponse.data;
    tags = tagsResponse.data;
  } catch {
    strategies = [];
    mistakes = [];
    tags = [];
  }

  const selectedAccountId = await getServerSelectedAccountId(
    getServerAuthToken,
    accounts,
  );
  const query = buildTradingAccountQuery(selectedAccountId);

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
      directionResponse,
      behaviorResponse,
      tagsResponse,
      plannedRrResponse,
      concentrationResponse,
      executionResponse,
      edgeFinderResponse,
      insightsResponse,
    ] = await Promise.all([
      getAnalyticsSummary(getServerAuthToken, query),
      getInstrumentPerformance(getServerAuthToken, query),
      getStrategyPerformance(getServerAuthToken, query),
      getPlanCompliance(getServerAuthToken, query),
      getRiskStats(getServerAuthToken, query),
      getTimeAnalytics(getServerAuthToken, query),
      getHeatmapAnalytics(getServerAuthToken, query, heatmapMetric),
      getPsychologyAnalytics(getServerAuthToken, query),
      getMistakeAnalytics(getServerAuthToken, query),
      getDurationAnalytics(getServerAuthToken, query),
      getRollingPerformance(getServerAuthToken, query),
      getPeriodComparison(getServerAuthToken, query),
      getDirectionAnalytics(getServerAuthToken, query),
      getBehaviorAnalytics(getServerAuthToken, query),
      getTagAnalytics(getServerAuthToken, query),
      getPlannedRrAnalytics(getServerAuthToken, query),
      getConcentrationAnalytics(getServerAuthToken, query),
      getExecutionAnalytics(getServerAuthToken, query),
      getEdgeFinderAnalytics(getServerAuthToken, query),
      getInsightsAnalytics(getServerAuthToken, query),
    ]);

    summary = summaryResponse.data;
    instruments = instrumentsResponse.data;
    strategyRows = strategiesResponse.data;
    planCompliance = planComplianceResponse.data;
    riskStats = riskStatsResponse.data;
    timeAnalytics = timeResponse.data;
    heatmapCells = heatmapResponse.data.cells;
    psychology = psychologyResponse.data;
    mistakeAnalytics = mistakesResponse.data;
    durationAnalytics = durationResponse.data;
    rolling = rollingResponse.data;
    comparison = comparisonResponse.data;
    directionAnalytics = directionResponse.data;
    behaviorAnalytics = behaviorResponse.data;
    tagAnalytics = tagsResponse.data;
    plannedRrAnalytics = plannedRrResponse.data;
    concentrationAnalytics = concentrationResponse.data;
    executionAnalytics = executionResponse.data;
    edgeFinderAnalytics = edgeFinderResponse.data;
    insightsAnalytics = insightsResponse.data;
  } catch {
    summary = EMPTY_ANALYTICS_SUMMARY;
    instruments = [];
    strategyRows = [];
    planCompliance = [];
    riskStats = [];
    timeAnalytics = EMPTY_TIME;
    heatmapCells = [];
    psychology = EMPTY_PSYCHOLOGY;
    mistakeAnalytics = [];
    durationAnalytics = [];
    rolling = EMPTY_ROLLING;
    comparison = EMPTY_COMPARISON;
    directionAnalytics = EMPTY_DIRECTION_ANALYTICS;
    behaviorAnalytics = EMPTY_BEHAVIOR_ANALYTICS;
    tagAnalytics = EMPTY_TAG_ANALYTICS;
    plannedRrAnalytics = EMPTY_PLANNED_RR_ANALYTICS;
    concentrationAnalytics = EMPTY_CONCENTRATION_ANALYTICS;
    executionAnalytics = EMPTY_EXECUTION_ANALYTICS;
    edgeFinderAnalytics = EMPTY_EDGE_FINDER_ANALYTICS;
    insightsAnalytics = EMPTY_INSIGHTS_ANALYTICS;
  }

  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground p-6">Loading analytics...</div>
      }
    >
      <AnalyticsManager
        accounts={accounts}
        strategies={strategies}
        tags={tags}
        mistakes={mistakes}
        initialSummary={summary}
        initialInstruments={instruments}
        initialStrategies={strategyRows}
        initialPlanCompliance={planCompliance}
        initialRiskStats={riskStats}
        initialTime={timeAnalytics}
        initialHeatmapMetric={heatmapMetric}
        initialHeatmap={heatmapCells}
        initialPsychology={psychology}
        initialMistakeAnalytics={mistakeAnalytics}
        initialDuration={durationAnalytics}
        initialRolling={rolling}
        initialComparison={comparison}
        initialDirection={directionAnalytics}
        initialBehavior={behaviorAnalytics}
        initialTagAnalytics={tagAnalytics}
        initialPlannedRr={plannedRrAnalytics}
        initialConcentration={concentrationAnalytics}
        initialExecution={executionAnalytics}
        initialEdgeFinder={edgeFinderAnalytics}
        initialInsights={insightsAnalytics}
      />
    </Suspense>
  );
}
