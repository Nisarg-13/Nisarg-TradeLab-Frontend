export type MarketBias = "BULLISH" | "BEARISH" | "NEUTRAL";

export type DailyJournal = {
  id: string;
  tradingAccountId: string;
  date: string;
  sleepQuality: number | null;
  focus: number | null;
  mood: number | null;
  marketBias: MarketBias | null;
  plannedMaxTrades: number | null;
  plannedMaxRisk: string | null;
  preMarketNotes: string | null;
  postMarketReview: string | null;
  whatWentWell: string | null;
  whatWentWrong: string | null;
  tomorrowImprovement: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DailyJournalInput = {
  tradingAccountId: string;
  date: string;
  sleepQuality?: number;
  focus?: number;
  mood?: number;
  marketBias?: MarketBias;
  plannedMaxTrades?: number;
  plannedMaxRisk?: number;
  preMarketNotes?: string;
  postMarketReview?: string;
  whatWentWell?: string;
  whatWentWrong?: string;
  tomorrowImprovement?: string;
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
