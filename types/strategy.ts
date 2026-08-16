export type Strategy = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Tag = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type Mistake = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateStrategyInput = {
  name: string;
  description?: string;
};

export type UpdateStrategyInput = {
  name?: string;
  description?: string | null;
  isActive?: boolean;
};

export type CreateTagInput = {
  name: string;
};

export type UpdateTagInput = {
  name: string;
};

export type CreateMistakeInput = {
  name: string;
};

export type UpdateMistakeInput = {
  name: string;
};

export type ApiDataResponse<T> = {
  data: T;
};
