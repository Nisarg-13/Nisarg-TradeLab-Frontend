import { AnalyticsManager } from "@/components/analytics/analytics-manager";
import { EMPTY_ANALYTICS_SUMMARY } from "@/lib/analytics/empty-summary";
import {
  EMPTY_CONCENTRATION_ANALYTICS,
  EMPTY_DIRECTION_ANALYTICS,
  EMPTY_INSIGHTS_ANALYTICS,
  EMPTY_SESSION_DASHBOARD,
  EMPTY_TAG_ANALYTICS,
} from "@/lib/analytics/empty-analytics";
import {
  getAnalyticsSummary,
  getPlanCompliance,
  getSessionDashboard,
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
    winCount: 0,
    lossCount: 0,
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
    winCount: 0,
    lossCount: 0,
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
    winCount: 0,
    lossCount: 0,
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
    winCount: 0,
    lossCount: 0,
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
  const { accounts, query } = await getServerAppContext();

  const [strategies, mistakes, tags, overviewBundle] = await Promise.all([
    listStrategies(getServerAuthToken)
      .then((response) => response.data)
      .catch(() => [] as Strategy[]),
    listMistakes(getServerAuthToken)
      .then((response) => response.data)
      .catch(() => [] as Mistake[]),
    listTags(getServerAuthToken)
      .then((response) => response.data)
      .catch(() => [] as Tag[]),
    Promise.all([
      getAnalyticsSummary(getServerAuthToken, query)
        .then((response) => response.data)
        .catch(() => EMPTY_ANALYTICS_SUMMARY),
      getSessionDashboard(getServerAuthToken, query)
        .then((response) => response.data)
        .catch(() => EMPTY_SESSION_DASHBOARD),
      getPlanCompliance(getServerAuthToken, query)
        .then((response) => response.data)
        .catch(() => []),
    ]),
  ]);

  const [summary, sessionDashboard, planCompliance] = overviewBundle;

  return (
    <AnalyticsManager
      accounts={accounts}
      strategies={strategies}
      tags={tags}
      mistakes={mistakes}
      initialSummary={summary}
      initialInstruments={[]}
      initialSessionDashboard={sessionDashboard}
      initialStrategies={[]}
      initialPlanCompliance={planCompliance}
      initialRiskStats={[]}
      initialTime={EMPTY_TIME}
      initialHeatmapMetric={heatmapMetric}
      initialHeatmap={[]}
      initialPsychology={EMPTY_PSYCHOLOGY}
      initialMistakeAnalytics={[]}
      initialDuration={[]}
      initialRolling={EMPTY_ROLLING}
      initialComparison={EMPTY_COMPARISON}
      initialDirection={EMPTY_DIRECTION_ANALYTICS}
      initialTagAnalytics={EMPTY_TAG_ANALYTICS}
      initialConcentration={EMPTY_CONCENTRATION_ANALYTICS}
      initialInsights={EMPTY_INSIGHTS_ANALYTICS}
    />
  );
}
