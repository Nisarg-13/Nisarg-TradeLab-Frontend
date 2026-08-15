export type AssetClass =
  "FOREX" | "COMMODITY" | "INDEX" | "CRYPTO" | "STOCK" | "OTHER";

export type InstrumentSpec = {
  id: string;
  tradingAccountId: string;
  symbol: string;
  description: string | null;
  assetClass: AssetClass;
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
  createdAt: string;
  updatedAt: string;
};

export type ApiDataResponse<T> = {
  data: T;
};
