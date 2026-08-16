import { apiRequest } from "./client";
import type {
  ApiDataResponse,
  CreateMistakeInput,
  CreateTagInput,
  CreateStrategyInput,
  Mistake,
  Strategy,
  Tag,
  UpdateMistakeInput,
  UpdateStrategyInput,
  UpdateTagInput,
} from "@/types/strategy";

export async function listStrategies(
  getAuthToken: () => Promise<string | null>,
) {
  return apiRequest<ApiDataResponse<Strategy[]>>("/api/v1/strategies", {
    getAuthToken,
  });
}

export async function createStrategy(
  getAuthToken: () => Promise<string | null>,
  input: CreateStrategyInput,
) {
  return apiRequest<ApiDataResponse<Strategy>>("/api/v1/strategies", {
    method: "POST",
    body: JSON.stringify(input),
    getAuthToken,
  });
}

export async function updateStrategy(
  getAuthToken: () => Promise<string | null>,
  strategyId: string,
  input: UpdateStrategyInput,
) {
  return apiRequest<ApiDataResponse<Strategy>>(
    `/api/v1/strategies/${strategyId}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
      getAuthToken,
    },
  );
}

export async function deleteStrategy(
  getAuthToken: () => Promise<string | null>,
  strategyId: string,
) {
  return apiRequest<ApiDataResponse<{ success: boolean }>>(
    `/api/v1/strategies/${strategyId}`,
    {
      method: "DELETE",
      getAuthToken,
    },
  );
}

export async function listTags(getAuthToken: () => Promise<string | null>) {
  return apiRequest<ApiDataResponse<Tag[]>>("/api/v1/tags", { getAuthToken });
}

export async function createTag(
  getAuthToken: () => Promise<string | null>,
  input: CreateTagInput,
) {
  return apiRequest<ApiDataResponse<Tag>>("/api/v1/tags", {
    method: "POST",
    body: JSON.stringify(input),
    getAuthToken,
  });
}

export async function updateTag(
  getAuthToken: () => Promise<string | null>,
  tagId: string,
  input: UpdateTagInput,
) {
  return apiRequest<ApiDataResponse<Tag>>(`/api/v1/tags/${tagId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
    getAuthToken,
  });
}

export async function deleteTag(
  getAuthToken: () => Promise<string | null>,
  tagId: string,
) {
  return apiRequest<ApiDataResponse<{ success: boolean }>>(
    `/api/v1/tags/${tagId}`,
    {
      method: "DELETE",
      getAuthToken,
    },
  );
}

export async function listMistakes(getAuthToken: () => Promise<string | null>) {
  return apiRequest<ApiDataResponse<Mistake[]>>("/api/v1/mistakes", {
    getAuthToken,
  });
}

export async function createMistake(
  getAuthToken: () => Promise<string | null>,
  input: CreateMistakeInput,
) {
  return apiRequest<ApiDataResponse<Mistake>>("/api/v1/mistakes", {
    method: "POST",
    body: JSON.stringify(input),
    getAuthToken,
  });
}

export async function updateMistake(
  getAuthToken: () => Promise<string | null>,
  mistakeId: string,
  input: UpdateMistakeInput,
) {
  return apiRequest<ApiDataResponse<Mistake>>(`/api/v1/mistakes/${mistakeId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
    getAuthToken,
  });
}

export async function deleteMistake(
  getAuthToken: () => Promise<string | null>,
  mistakeId: string,
) {
  return apiRequest<ApiDataResponse<{ success: boolean }>>(
    `/api/v1/mistakes/${mistakeId}`,
    {
      method: "DELETE",
      getAuthToken,
    },
  );
}
