export type MarketBias = "BULLISH" | "BEARISH" | "NEUTRAL";

export type DailyJournal = {
  id: string;
  tradingAccountId: string;
  date: string;
  confidenceScore: number | null;
  marketBias: MarketBias | null;
  preTradePlan: string | null;
  postTradePlan: string | null;
  whatWentWell: string | null;
  whatWentWrong: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DailyJournalInput = {
  tradingAccountId: string;
  date: string;
  confidenceScore?: number;
  marketBias?: MarketBias;
  preTradePlan?: string;
  postTradePlan?: string;
  whatWentWell?: string;
  whatWentWrong?: string;
};

export type UpdateDailyJournalInput = Partial<
  Omit<DailyJournalInput, "tradingAccountId" | "date">
>;

export type ListDailyJournalQuery = {
  tradingAccountId?: string;
  from?: string;
  to?: string;
};

export type ApiDataResponse<T> = {
  data: T;
};

export type JournalFieldValues = {
  marketBias: string;
  confidenceScore: number;
  preTradePlan: string;
  postTradePlan: string;
  whatWentWell: string;
  whatWentWrong: string;
};
