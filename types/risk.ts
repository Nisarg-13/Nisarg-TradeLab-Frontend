export type TradeDirection = "LONG" | "SHORT";
export type RiskMode = "PERCENTAGE" | "FIXED";

export type RiskViolationSeverity = "warning" | "critical";

export type RiskViolation = {
  severity: RiskViolationSeverity;
  code: string;
  message: string;
};

export type RiskInstrument = {
  symbol: string;
  description: string;
  assetClass: string;
  digits: number;
  point: string;
  tickSize: string;
  tickValueProfit: string;
  tickValueLoss: string;
  contractSize: string;
  volumeMin: string;
  volumeMax: string;
  volumeStep: string;
  baseCurrency: string | null;
  profitCurrency: string | null;
};

export type CalculateRiskInput = {
  accountBalance: number;
  symbol: string;
  direction: TradeDirection;
  entryPrice: number;
  stopLoss: number;
  takeProfit?: number;
  riskMode: RiskMode;
  riskPercentage?: number;
  fixedRiskAmount?: number;
};

export type RiskCalculationResult = {
  symbol: string;
  direction: TradeDirection;
  entryPrice: string;
  stopLoss: string;
  takeProfit: string | null;
  riskMode: RiskMode;
  accountBalance: string;
  riskPercentage: string;
  riskAmount: string;
  priceDistance: string;
  stopDistance: string;
  recommendedPositionSize: string;
  potentialLoss: string;
  potentialProfit: string | null;
  riskReward: string | null;
  currentDailyRisk: string;
  dailyRiskAfterTrade: string;
  currentOpenRisk: string;
  openRiskAfterTrade: string;
  violations: RiskViolation[];
  blocked: boolean;
};

export type ApiDataResponse<T> = {
  data: T;
};
