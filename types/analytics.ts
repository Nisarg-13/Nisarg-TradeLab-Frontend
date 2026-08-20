export type SampleConfidence =
  "INSUFFICIENT" | "VERY_LOW" | "LOW" | "MODERATE" | "HIGHER";

export type AnalyticsQuery = {
  tradingAccountId?: string;
  closedFrom?: string;
  closedTo?: string;
  symbol?: string;
  strategyId?: string;
  tagId?: string;
  direction?: "LONG" | "SHORT";
  mistakeId?: string;
  preTradeEmotion?: string;
  postTradeEmotion?: string;
  followedPlan?: "true" | "false";
  planCompliance?:
    "FOLLOWED" | "PARTIALLY_FOLLOWED" | "DID_NOT_FOLLOW" | "NOT_REVIEWED";
  marketBias?: "BULLISH" | "BEARISH" | "NEUTRAL";
  confidenceMin?: string;
  confidenceMax?: string;
  riskMin?: string;
  riskMax?: string;
  session?: "ASIA" | "LONDON" | "OVERLAP" | "NEW_YORK" | "OFF_HOURS";
  result?: "WIN" | "LOSS" | "BREAKEVEN";
};

export type HeatmapMetric =
  "pnl" | "averageR" | "expectancy" | "winRate" | "tradeCount";

export type PerformanceSortKey =
  | "netPnl"
  | "totalR"
  | "averageR"
  | "rExpectancy"
  | "profitFactor"
  | "winRate"
  | "tradeCount";

export type PeriodComparisonMode =
  | "LATEST_20_VS_PREVIOUS_20"
  | "FIRST_50_VS_LATEST_50"
  | "THIS_MONTH_VS_LAST_MONTH"
  | "CUSTOM";

export type EquityCurvePoint = {
  date: string;
  balance: string;
  cumulativePnl: string;
  cumulativeR: string;
};

export type CalendarDay = {
  date: string;
  pnl: string;
  r: string;
  tradeCount: number;
};

export type AnalyticsSummary = {
  currency: string;
  tradeCount: number;
  closedTradeCount: number;
  openTradeCount: number;
  netPnl: string;
  grossProfit: string;
  grossLoss: string;
  returnPercentage: string | null;
  winCount: number;
  lossCount: number;
  breakevenCount: number;
  winRate: string | null;
  lossRate: string | null;
  breakevenRate: string | null;
  profitFactor: string | null;
  moneyExpectancy: string | null;
  rExpectancy: string | null;
  totalR: string | null;
  averageR: string | null;
  averageWinner: string | null;
  averageLoser: string | null;
  averageWinLossRatio: string | null;
  largestWinner: string | null;
  largestLoser: string | null;
  averageHoldingTimeMinutes: string | null;
  medianHoldingTimeMinutes: string | null;
  totalCommission: string;
  totalSwap: string;
  totalFees: string;
  totalTradingCosts: string;
  maxDrawdownAmount: string;
  maxDrawdownPercentage: string;
  currentDrawdownAmount: string;
  currentDrawdownPercentage: string;
  longestWinningStreak: number;
  longestLosingStreak: number;
  currentWinningStreak: number;
  currentLosingStreak: number;
  startingBalance: string;
  currentBalance: string;
  currentOpenRisk: string;
  sampleConfidence: SampleConfidence;
  equityCurve: EquityCurvePoint[];
  calendar: CalendarDay[];
};

export type GroupedPerformanceMetrics = {
  tradeCount: number;
  netPnl: string;
  grossProfit: string;
  grossLoss: string;
  totalR: string | null;
  winRate: string | null;
  averageR: string | null;
  rExpectancy: string | null;
  moneyExpectancy: string | null;
  profitFactor: string | null;
  longTradeCount: number;
  shortTradeCount: number;
  longNetPnl: string;
  shortNetPnl: string;
  sampleConfidence: SampleConfidence;
};

export type InstrumentPerformance = GroupedPerformanceMetrics & {
  symbol: string;
};

export type StrategyPerformance = GroupedPerformanceMetrics & {
  strategyId: string | null;
  strategyName: string;
};

export type SessionPerformance = {
  session: string;
  sessionLabel: string;
  tradeCount: number;
  netPnl: string;
  totalR: string | null;
  winRate: string | null;
  averageR: string | null;
  moneyExpectancy: string | null;
  rExpectancy: string | null;
  profitFactor: string | null;
  sampleConfidence: SampleConfidence;
};

export type DirectionSideMetrics = {
  direction: "LONG" | "SHORT";
  label: string;
  tradeCount: number;
  netPnl: string;
  totalR: string | null;
  winRate: string | null;
  averageR: string | null;
  rExpectancy: string | null;
  profitFactor: string | null;
  sampleConfidence: SampleConfidence;
};

export type DirectionAnalytics = {
  overall: DirectionSideMetrics[];
  byInstrument: Array<{
    symbol: string;
    long: DirectionSideMetrics | null;
    short: DirectionSideMetrics | null;
  }>;
};

export type AfterLossesComparison = {
  lossStreakThreshold: number;
  tradeCount: number;
  netPnl: string;
  winRate: string | null;
  averageR: string | null;
  rExpectancy: string | null;
  sampleConfidence: SampleConfidence;
  baselineTradeCount: number;
  baselineWinRate: string | null;
  baselineNetPnl: string;
};

export type EarlyWinnerExitAnalytics = {
  winnerCount: number;
  earlyExitCount: number;
  earlyExitRate: string | null;
  averagePlannedR: string | null;
  averageRealizedR: string | null;
  averageCaptureRatio: string | null;
  sampleConfidence: SampleConfidence;
};

export type BehaviorAnalytics = {
  afterLossBuckets: TradeMetricsGroup[];
  afterWinBuckets: TradeMetricsGroup[];
  afterLossesComparison: AfterLossesComparison;
  earlyWinnerExit: EarlyWinnerExitAnalytics;
};

export type PlanComplianceStatus =
  "FOLLOWED" | "PARTIALLY_FOLLOWED" | "DID_NOT_FOLLOW" | "NOT_REVIEWED";

export type PlanComplianceGroup = {
  label: string;
  planCompliance: PlanComplianceStatus;
  tradeCount: number;
  netPnl: string;
  winRate: string | null;
  averageR: string | null;
  moneyExpectancy: string | null;
  rExpectancy: string | null;
  profitFactor: string | null;
  sampleConfidence: SampleConfidence;
};

export type TagAnalyticsGroup = {
  tagId: string;
  tagName: string;
  tradeCount: number;
  netPnl: string;
  totalR: string | null;
  averageR: string | null;
  winRate: string | null;
  moneyExpectancy: string | null;
  rExpectancy: string | null;
  profitFactor: string | null;
  sampleConfidence: SampleConfidence;
};

export type PlannedRrSummary = {
  tradeCount: number;
  averagePlannedR: string | null;
  averageRealizedR: string | null;
  averageRealizedWinnerR: string | null;
  targetAchievementRate: string | null;
};

export type PlannedRrAnalytics = {
  buckets: TradeMetricsGroup[];
  summary: PlannedRrSummary;
};

export type RiskStatGroup = {
  label: string;
  riskPercentageMin: string | null;
  riskPercentageMax: string | null;
  tradeCount: number;
  netPnl: string;
  winRate: string | null;
  averageR: string | null;
  moneyExpectancy: string | null;
  rExpectancy: string | null;
  profitFactor: string | null;
  sampleConfidence: SampleConfidence;
};

export type TradeMetricsGroup = {
  key: string;
  label: string;
  tradeCount: number;
  netPnl: string;
  totalR: string | null;
  winRate: string | null;
  averageR: string | null;
  moneyExpectancy: string | null;
  rExpectancy: string | null;
  profitFactor: string | null;
  sampleConfidence: SampleConfidence;
};

export type TimeAnalytics = {
  hours: TradeMetricsGroup[];
  twoHourWindows: TradeMetricsGroup[];
  daysOfWeek: TradeMetricsGroup[];
  months: TradeMetricsGroup[];
  sessions: TradeMetricsGroup[];
};

export type HeatmapCell = {
  dayOfWeek: number;
  hour: number;
  tradeCount: number;
  netPnl: string;
  averageR: string | null;
  winRate: string | null;
  value: string;
};

export type HeatmapData = {
  metric: HeatmapMetric;
  cells: HeatmapCell[];
};

export type PsychologyAnalytics = {
  preTradeEmotions: TradeMetricsGroup[];
  postTradeEmotions: TradeMetricsGroup[];
  confidence: TradeMetricsGroup[];
  marketBias: TradeMetricsGroup[];
  biasAlignment: TradeMetricsGroup[];
};

export type MistakeAnalyticsGroup = {
  mistakeId: string;
  mistakeName: string;
  tradeCount: number;
  netPnl: string;
  totalR: string | null;
  averageR: string | null;
  winRate: string | null;
  moneyExpectancy: string | null;
  rExpectancy: string | null;
  profitFactor: string | null;
  sampleConfidence: SampleConfidence;
};

export type RollingPerformance = {
  windowSize: number;
  currentWindow: TradeMetricsGroup;
  previousWindow: TradeMetricsGroup;
  points: Array<{
    index: number;
    closedAt: string;
    netPnl: string;
    windowTradeCount: number;
    windowWinRate: string | null;
    windowAverageR: string | null;
    windowNetPnl: string;
  }>;
};

export type PeriodMetrics = {
  label: string;
  tradeCount: number;
  netPnl: string;
  totalR: string | null;
  winRate: string | null;
  averageR: string | null;
  moneyExpectancy: string | null;
  profitFactor: string | null;
  maxDrawdownAmount: string;
  maxDrawdownPercentage: string;
  mistakeRate: string | null;
  planComplianceRate: string | null;
  averageRiskPercentage: string | null;
  averageHoldingTimeMinutes: string | null;
  totalTradingCosts: string;
  sampleConfidence: SampleConfidence;
};

export type PeriodComparison = {
  mode: PeriodComparisonMode;
  periodA: PeriodMetrics;
  periodB: PeriodMetrics;
  deltas: {
    netPnl: string | null;
    totalR: string | null;
    winRate: string | null;
    averageR: string | null;
    moneyExpectancy: string | null;
    profitFactor: string | null;
    mistakeRate: string | null;
    planComplianceRate: string | null;
    maxDrawdownAmount: string | null;
    maxDrawdownPercentage: string | null;
    averageRiskPercentage: string | null;
    averageHoldingTimeMinutes: string | null;
    totalTradingCosts: string | null;
  };
};

export type ConcentrationAnalytics = {
  profit: {
    winnerCount: number;
    grossProfit: string;
    top1Percent: string | null;
    top3Percent: string | null;
    top5Percent: string | null;
    top10Percent: string | null;
    netPnlExcludingTop1: string;
    netPnlExcludingTop3: string;
    netPnlExcludingTop5: string;
  };
  loss: {
    loserCount: number;
    grossLoss: string;
    worst1Percent: string | null;
    worst3Percent: string | null;
    worst5Percent: string | null;
    worst10Percent: string | null;
  };
};

export type ExecutionAnalytics = {
  tradeCount: number;
  averageEntryPrice: string | null;
  averageExitPrice: string | null;
  entryCount: number;
  exitCount: number;
  partialExitCount: number;
  averageHoldTimeMinutes: string | null;
  plannedVsRealized: PlannedRrSummary;
  slModificationCount: number;
  tpModificationCount: number;
  movedToBreakevenCount: number;
  widenedSlCount: number;
  reducedRiskCount: number;
  increasedRiskCount: number;
  mfeAvailableCount: number;
  averageExitEfficiency: string | null;
};

export type EdgeFinderDimension = {
  key: string;
  label: string;
  value: string;
};

export type EdgeFinderCombination = {
  dimensions: EdgeFinderDimension[];
  tradeCount: number;
  netPnl: string;
  totalR: string | null;
  winRate: string | null;
  averageR: string | null;
  rExpectancy: string | null;
  profitFactor: string | null;
  sampleConfidence: SampleConfidence;
};

export type EdgeFinderAnalytics = {
  minimumSampleSize: number;
  evaluatedCombinationCount: number;
  strongest: EdgeFinderCombination[];
  weakest: EdgeFinderCombination[];
};

export type InsightsHighlights = {
  bestHour: TradeMetricsGroup | null;
  worstHour: TradeMetricsGroup | null;
  bestSession: TradeMetricsGroup | null;
  worstSession: TradeMetricsGroup | null;
  bestDayOfWeek: TradeMetricsGroup | null;
  worstDayOfWeek: TradeMetricsGroup | null;
  bestSymbol: TradeMetricsGroup | null;
  worstSymbol: TradeMetricsGroup | null;
  bestTimeframe: TradeMetricsGroup | null;
  worstTimeframe: TradeMetricsGroup | null;
};

export type SessionSymbolRow = {
  session: string;
  sessionLabel: string;
  symbol: string;
  tradeCount: number;
  netPnl: string;
  totalR: string | null;
  winRate: string | null;
  averageR: string | null;
  sampleConfidence: SampleConfidence;
};

export type TimeframeOutcome = {
  key: string;
  label: string;
  wins: number;
  losses: number;
  breakeven: number;
  winRate: string | null;
  netPnl: string;
  tradeCount: number;
};

export type PlanComplianceBreakdown = {
  key: string;
  label: string;
  followed: number;
  partiallyFollowed: number;
  didNotFollow: number;
  notReviewed: number;
  followedWinRate: string | null;
  notFollowedWinRate: string | null;
};

export type JournalCoverage = {
  closedTrades: number;
  withChartTimeframe: number;
  withPreTradePlan: number;
  withPostTradePlan: number;
  withWhatWentWell: number;
  withWhatWentWrong: number;
  withPlanCompliance: number;
  withEntryCriteria: number;
  withStrategies: number;
  withMistakesTagged: number;
};

export type InsightsAnalytics = {
  highlights: InsightsHighlights;
  sessionSymbols: SessionSymbolRow[];
  timeframes: TradeMetricsGroup[];
  timeframeOutcomes: TimeframeOutcome[];
  journalCoverage: JournalCoverage;
  planComplianceByTimeframe: PlanComplianceBreakdown[];
  winningEntryCriteria: TradeMetricsGroup[];
  losingEntryCriteria: TradeMetricsGroup[];
  winningStrategies: TradeMetricsGroup[];
  losingStrategies: TradeMetricsGroup[];
  losingMistakes: TradeMetricsGroup[];
};

export type ApiDataResponse<T> = {
  data: T;
};
