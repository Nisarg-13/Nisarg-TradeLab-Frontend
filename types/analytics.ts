export type SampleConfidence =
  "INSUFFICIENT" | "VERY_LOW" | "LOW" | "MODERATE" | "HIGHER";

export type AnalyticsQuery = {
  tradingAccountId?: string;
  closedFrom?: string;
  closedTo?: string;
};

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

export type ApiDataResponse<T> = {
  data: T;
};
