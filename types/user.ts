export type UserProfile = {
  id: string;
  email: string;
  timezone: string;
  preferredCurrency: string;
  selectedTradingAccountId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiDataResponse<T> = {
  data: T;
};
