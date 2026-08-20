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
  getSessionPerformance,
  getStrategyPerformance,
  getTagAnalytics,
  getTimeAnalytics,
} from "@/lib/api/analytics";
import { listMistakes, listStrategies, listTags } from "@/lib/api/strategies";
import { getServerAuthToken } from "@/lib/auth/server";
import { getServerAppContext } from "@/lib/server/app-context";
import type {
  HeatmapMetric,
  PeriodComparison,
  PsychologyAnalytics,
  RollingPerformance,
  TimeAnalytics,
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
  const heatmapMetric: HeatmapMetric = "pnl";
  const contextPromise = getServerAppContext();

  const [{ accounts }, strategies, mistakes, tags, analyticsBundle] =
    await Promise.all([
      contextPromise,
      listStrategies(getServerAuthToken)
        .then((response) => response.data)
        .catch(() => [] as Strategy[]),
      listMistakes(getServerAuthToken)
        .then((response) => response.data)
        .catch(() => [] as Mistake[]),
      listTags(getServerAuthToken)
        .then((response) => response.data)
        .catch(() => [] as Tag[]),
      contextPromise
        .then(({ query: accountQuery }) =>
          Promise.all([
            getAnalyticsSummary(getServerAuthToken, accountQuery),
            getInstrumentPerformance(getServerAuthToken, accountQuery),
            getSessionPerformance(getServerAuthToken, accountQuery),
            getStrategyPerformance(getServerAuthToken, accountQuery),
            getPlanCompliance(getServerAuthToken, accountQuery),
            getRiskStats(getServerAuthToken, accountQuery),
            getTimeAnalytics(getServerAuthToken, accountQuery),
            getHeatmapAnalytics(
              getServerAuthToken,
              accountQuery,
              heatmapMetric,
            ),
            getPsychologyAnalytics(getServerAuthToken, accountQuery),
            getMistakeAnalytics(getServerAuthToken, accountQuery),
            getDurationAnalytics(getServerAuthToken, accountQuery),
            getRollingPerformance(getServerAuthToken, accountQuery),
            getPeriodComparison(getServerAuthToken, accountQuery),
            getDirectionAnalytics(getServerAuthToken, accountQuery),
            getBehaviorAnalytics(getServerAuthToken, accountQuery),
            getTagAnalytics(getServerAuthToken, accountQuery),
            getPlannedRrAnalytics(getServerAuthToken, accountQuery),
            getConcentrationAnalytics(getServerAuthToken, accountQuery),
            getExecutionAnalytics(getServerAuthToken, accountQuery),
            getEdgeFinderAnalytics(getServerAuthToken, accountQuery),
            getInsightsAnalytics(getServerAuthToken, accountQuery),
          ]),
        )
        .catch(() => null),
    ]);

  const summary = analyticsBundle?.[0]?.data ?? EMPTY_ANALYTICS_SUMMARY;
  const instruments = analyticsBundle?.[1]?.data ?? [];
  const sessionPerformance = analyticsBundle?.[2]?.data ?? [];
  const strategyRows = analyticsBundle?.[3]?.data ?? [];
  const planCompliance = analyticsBundle?.[4]?.data ?? [];
  const riskStats = analyticsBundle?.[5]?.data ?? [];
  const timeAnalytics = analyticsBundle?.[6]?.data ?? EMPTY_TIME;
  const heatmapCells = analyticsBundle?.[7]?.data.cells ?? [];
  const psychology = analyticsBundle?.[8]?.data ?? EMPTY_PSYCHOLOGY;
  const mistakeAnalytics = analyticsBundle?.[9]?.data ?? [];
  const durationAnalytics = analyticsBundle?.[10]?.data ?? [];
  const rolling = analyticsBundle?.[11]?.data ?? EMPTY_ROLLING;
  const comparison = analyticsBundle?.[12]?.data ?? EMPTY_COMPARISON;
  const directionAnalytics =
    analyticsBundle?.[13]?.data ?? EMPTY_DIRECTION_ANALYTICS;
  const behaviorAnalytics =
    analyticsBundle?.[14]?.data ?? EMPTY_BEHAVIOR_ANALYTICS;
  const tagAnalytics = analyticsBundle?.[15]?.data ?? EMPTY_TAG_ANALYTICS;
  const plannedRrAnalytics =
    analyticsBundle?.[16]?.data ?? EMPTY_PLANNED_RR_ANALYTICS;
  const concentrationAnalytics =
    analyticsBundle?.[17]?.data ?? EMPTY_CONCENTRATION_ANALYTICS;
  const executionAnalytics =
    analyticsBundle?.[18]?.data ?? EMPTY_EXECUTION_ANALYTICS;
  const edgeFinderAnalytics =
    analyticsBundle?.[19]?.data ?? EMPTY_EDGE_FINDER_ANALYTICS;
  const insightsAnalytics =
    analyticsBundle?.[20]?.data ?? EMPTY_INSIGHTS_ANALYTICS;

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
        initialSessionPerformance={sessionPerformance}
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
