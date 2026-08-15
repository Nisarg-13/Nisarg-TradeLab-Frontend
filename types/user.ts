export type UserProfile = {
  id: string;
  email: string;
  timezone: string;
  preferredCurrency: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiDataResponse<T> = {
  data: T;
};
