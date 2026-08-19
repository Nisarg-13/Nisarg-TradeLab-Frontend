import type {
  BehaviorAnalytics,
  ConcentrationAnalytics,
  DirectionAnalytics,
  ExecutionAnalytics,
  EdgeFinderAnalytics,
  InsightsAnalytics,
  PlannedRrAnalytics,
  TagAnalyticsGroup,
} from "@/types/analytics";

export const EMPTY_DIRECTION_ANALYTICS: DirectionAnalytics = {
  overall: [],
  byInstrument: [],
};

export const EMPTY_BEHAVIOR_ANALYTICS: BehaviorAnalytics = {
  afterLossBuckets: [],
  afterWinBuckets: [],
  afterLossesComparison: {
    lossStreakThreshold: 2,
    tradeCount: 0,
    netPnl: "0.00",
    winRate: null,
    averageR: null,
    rExpectancy: null,
    sampleConfidence: "INSUFFICIENT",
    baselineTradeCount: 0,
    baselineWinRate: null,
    baselineNetPnl: "0.00",
  },
  earlyWinnerExit: {
    winnerCount: 0,
    earlyExitCount: 0,
    earlyExitRate: null,
    averagePlannedR: null,
    averageRealizedR: null,
    averageCaptureRatio: null,
    sampleConfidence: "INSUFFICIENT",
  },
};

export const EMPTY_TAG_ANALYTICS: TagAnalyticsGroup[] = [];

export const EMPTY_PLANNED_RR_ANALYTICS: PlannedRrAnalytics = {
  buckets: [],
  summary: {
    tradeCount: 0,
    averagePlannedR: null,
    averageRealizedR: null,
    averageRealizedWinnerR: null,
    targetAchievementRate: null,
  },
};

export const EMPTY_CONCENTRATION_ANALYTICS: ConcentrationAnalytics = {
  profit: {
    winnerCount: 0,
    grossProfit: "0.00",
    top1Percent: null,
    top3Percent: null,
    top5Percent: null,
    top10Percent: null,
    netPnlExcludingTop1: "0.00",
    netPnlExcludingTop3: "0.00",
    netPnlExcludingTop5: "0.00",
  },
  loss: {
    loserCount: 0,
    grossLoss: "0.00",
    worst1Percent: null,
    worst3Percent: null,
    worst5Percent: null,
    worst10Percent: null,
  },
};

export const EMPTY_EXECUTION_ANALYTICS: ExecutionAnalytics = {
  tradeCount: 0,
  averageEntryPrice: null,
  averageExitPrice: null,
  entryCount: 0,
  exitCount: 0,
  partialExitCount: 0,
  averageHoldTimeMinutes: null,
  plannedVsRealized: EMPTY_PLANNED_RR_ANALYTICS.summary,
  slModificationCount: 0,
  tpModificationCount: 0,
  movedToBreakevenCount: 0,
  widenedSlCount: 0,
  reducedRiskCount: 0,
  increasedRiskCount: 0,
  mfeAvailableCount: 0,
  averageExitEfficiency: null,
};

export const EMPTY_EDGE_FINDER_ANALYTICS: EdgeFinderAnalytics = {
  minimumSampleSize: 10,
  evaluatedCombinationCount: 0,
  strongest: [],
  weakest: [],
};

export const EMPTY_INSIGHTS_ANALYTICS: InsightsAnalytics = {
  highlights: {
    bestHour: null,
    worstHour: null,
    bestSession: null,
    worstSession: null,
    bestDayOfWeek: null,
    worstDayOfWeek: null,
    bestSymbol: null,
    worstSymbol: null,
    bestTimeframe: null,
    worstTimeframe: null,
  },
  sessionSymbols: [],
  timeframes: [],
  timeframeOutcomes: [],
  journalCoverage: {
    closedTrades: 0,
    withChartTimeframe: 0,
    withPreTradePlan: 0,
    withPostTradePlan: 0,
    withWhatWentWell: 0,
    withWhatWentWrong: 0,
    withPlanCompliance: 0,
    withEntryCriteria: 0,
    withStrategies: 0,
    withMistakesTagged: 0,
  },
  planComplianceByTimeframe: [],
  winningEntryCriteria: [],
  losingEntryCriteria: [],
  winningStrategies: [],
  losingStrategies: [],
  losingMistakes: [],
};
