export type SampleConfidence =
  "INSUFFICIENT" | "VERY_LOW" | "LOW" | "MODERATE" | "HIGHER";

export type AnalyticsQuery = {
  tradingAccountId?: string;
  closedFrom?: string;
  closedTo?: string;
  symbol?: string;
  strategyId?: string;
  direction?: "LONG" | "SHORT";
  mistakeId?: string;
  preTradeEmotion?: string;
  postTradeEmotion?: string;
  followedPlan?: "true" | "false";
  result?: "WIN" | "LOSS" | "BREAKEVEN";
};

export type HeatmapMetric = "pnl" | "averageR" | "winRate" | "tradeCount";

export type PeriodComparisonMode =
  "LATEST_20_VS_PREVIOUS_20" | "THIS_MONTH_VS_LAST_MONTH" | "CUSTOM";

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
  returnPercentage: string | null;
  winRate: string | null;
  profitFactor: string | null;
  moneyExpectancy: string | null;
  rExpectancy: string | null;
  averageR: string | null;
  averageWinner: string | null;
  averageLoser: string | null;
  largestWinner: string | null;
  largestLoser: string | null;
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

export type InstrumentPerformance = {
  symbol: string;
  tradeCount: number;
  netPnl: string;
  winRate: string | null;
  averageR: string | null;
  profitFactor: string | null;
  sampleConfidence: SampleConfidence;
};

export type StrategyPerformance = {
  strategyId: string | null;
  strategyName: string;
  tradeCount: number;
  netPnl: string;
  winRate: string | null;
  averageR: string | null;
  profitFactor: string | null;
  sampleConfidence: SampleConfidence;
};

export type PlanComplianceGroup = {
  label: string;
  followedPlan: boolean | null;
  tradeCount: number;
  netPnl: string;
  winRate: string | null;
  averageR: string | null;
  moneyExpectancy: string | null;
  rExpectancy: string | null;
  profitFactor: string | null;
  sampleConfidence: SampleConfidence;
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
  totalR: string;
  winRate: string | null;
  averageR: string | null;
  moneyExpectancy: string | null;
  rExpectancy: string | null;
  profitFactor: string | null;
  sampleConfidence: SampleConfidence;
};

export type TimeAnalytics = {
  hours: TradeMetricsGroup[];
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
};

export type MistakeAnalyticsGroup = {
  mistakeId: string;
  mistakeName: string;
  tradeCount: number;
  netPnl: string;
  totalR: string;
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
  winRate: string | null;
  averageR: string | null;
  moneyExpectancy: string | null;
  profitFactor: string | null;
  maxDrawdownAmount: string;
  maxDrawdownPercentage: string;
  mistakeRate: string | null;
  planComplianceRate: string | null;
  sampleConfidence: SampleConfidence;
};

export type PeriodComparison = {
  mode: PeriodComparisonMode;
  periodA: PeriodMetrics;
  periodB: PeriodMetrics;
  deltas: {
    netPnl: string | null;
    winRate: string | null;
    averageR: string | null;
    moneyExpectancy: string | null;
    profitFactor: string | null;
    mistakeRate: string | null;
    planComplianceRate: string | null;
    maxDrawdownAmount: string | null;
    maxDrawdownPercentage: string | null;
  };
};

export type ApiDataResponse<T> = {
  data: T;
};
