import { AnalyticsManager } from "@/components/analytics/analytics-manager";
import { listAccounts } from "@/lib/api/accounts";
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
import { listMistakes, listStrategies } from "@/lib/api/strategies";
import { getServerAuthToken } from "@/lib/auth/server";
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
} from "@/types/analytics";
import type { Mistake, Strategy } from "@/types/strategy";

const EMPTY_SUMMARY: AnalyticsSummary = {
  currency: "USD",
  tradeCount: 0,
  closedTradeCount: 0,
  openTradeCount: 0,
  netPnl: "0.00",
  returnPercentage: null,
  winRate: null,
  profitFactor: null,
  moneyExpectancy: null,
  rExpectancy: null,
  averageR: null,
  averageWinner: null,
  averageLoser: null,
  largestWinner: null,
  largestLoser: null,
  maxDrawdownAmount: "0.00",
  maxDrawdownPercentage: "0.00",
  currentDrawdownAmount: "0.00",
  currentDrawdownPercentage: "0.00",
  longestWinningStreak: 0,
  longestLosingStreak: 0,
  currentWinningStreak: 0,
  currentLosingStreak: 0,
  currentOpenRisk: "0.00",
  sampleConfidence: "INSUFFICIENT",
  equityCurve: [],
  calendar: [],
};

const EMPTY_TIME: TimeAnalytics = {
  hours: [],
  daysOfWeek: [],
  months: [],
  sessions: [],
};

const EMPTY_PSYCHOLOGY: PsychologyAnalytics = {
  preTradeEmotions: [],
  postTradeEmotions: [],
};

const EMPTY_ROLLING: RollingPerformance = {
  windowSize: 20,
  currentWindow: {
    key: "all",
    label: "Current window",
    tradeCount: 0,
    netPnl: "0.00",
    totalR: "0.00",
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
    totalR: "0.00",
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
    winRate: null,
    averageR: null,
    moneyExpectancy: null,
    profitFactor: null,
    maxDrawdownAmount: "0.00",
    maxDrawdownPercentage: "0.00",
    mistakeRate: null,
    planComplianceRate: null,
    sampleConfidence: "INSUFFICIENT",
  },
  periodB: {
    label: "Previous 20 trades",
    tradeCount: 0,
    netPnl: "0.00",
    winRate: null,
    averageR: null,
    moneyExpectancy: null,
    profitFactor: null,
    maxDrawdownAmount: "0.00",
    maxDrawdownPercentage: "0.00",
    mistakeRate: null,
    planComplianceRate: null,
    sampleConfidence: "INSUFFICIENT",
  },
  deltas: {
    netPnl: null,
    winRate: null,
    averageR: null,
    moneyExpectancy: null,
    profitFactor: null,
    mistakeRate: null,
    planComplianceRate: null,
    maxDrawdownAmount: null,
    maxDrawdownPercentage: null,
  },
};

export default async function AnalyticsOverviewPage() {
  let accounts: TradingAccount[] = [];
  let strategies: Strategy[] = [];
  let mistakes: Mistake[] = [];
  let summary: AnalyticsSummary = EMPTY_SUMMARY;
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

  try {
    const accountsResponse = await listAccounts(getServerAuthToken);
    accounts = accountsResponse.data;
  } catch {
    accounts = [];
  }

  try {
    const [strategiesResponse, mistakesResponse] = await Promise.all([
      listStrategies(getServerAuthToken),
      listMistakes(getServerAuthToken),
    ]);
    strategies = strategiesResponse.data;
    mistakes = mistakesResponse.data;
  } catch {
    strategies = [];
    mistakes = [];
  }

  const query =
    accounts.length === 1 ? { tradingAccountId: accounts[0].id } : {};

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
  } catch {
    summary = EMPTY_SUMMARY;
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
  }

  return (
    <AnalyticsManager
      accounts={accounts}
      strategies={strategies}
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
    />
  );
}
