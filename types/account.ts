export type AccountType =
  "PERSONAL" | "DEMO" | "PROP_CHALLENGE" | "FUNDED" | "OTHER";

export type AccountSource = "MANUAL" | "MT5";

export type RiskSettings = {
  id: string;
  tradingAccountId: string;
  defaultRiskPercentage: string;
  maxRiskPerTradePercentage: string;
  maxDailyRiskPercentage: string;
  maxDailyLossPercentage: string;
  maxOpenRiskPercentage: string;
  maxTradesPerDay: number;
  maxConsecutiveLosses: number;
  strictMode: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TradingAccount = {
  id: string;
  name: string;
  type: AccountType;
  source: AccountSource;
  brokerName: string | null;
  currency: string;
  startingBalance: string;
  currentBalance: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  riskSettings: RiskSettings | null;
};

export type ApiDataResponse<T> = {
  data: T;
};
