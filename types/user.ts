export type UserProfile = {
  id: string;
  email: string;
  timezone: string;
  preferredCurrency: string;
  selectedTradingAccountId: string | null;
  createdAt: string;
  updatedAt: string;
  features: {
    aiCoach: boolean;
  };
};

export type ApiDataResponse<T> = {
  data: T;
};
