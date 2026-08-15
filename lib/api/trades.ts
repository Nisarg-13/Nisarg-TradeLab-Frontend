import { apiRequest } from "./client";
import type {
  AddExecutionInput,
  ApiDataResponse,
  CloseTradeInput,
  CreateTradeInput,
  ListTradesQuery,
  PaginatedTradesResponse,
  Trade,
  TradeReview,
  TradeReviewInput,
  UpdateTradeInput,
} from "@/types/trade";

function buildQuery(params: ListTradesQuery) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}

export async function listTrades(
  getAuthToken: () => Promise<string | null>,
  query: ListTradesQuery = {},
) {
  return apiRequest<PaginatedTradesResponse>(
    `/api/v1/trades${buildQuery(query)}`,
    { getAuthToken },
  );
}

export async function getTrade(
  getAuthToken: () => Promise<string | null>,
  tradeId: string,
) {
  return apiRequest<ApiDataResponse<Trade>>(`/api/v1/trades/${tradeId}`, {
    getAuthToken,
  });
}

export async function createTrade(
  getAuthToken: () => Promise<string | null>,
  input: CreateTradeInput,
) {
  return apiRequest<ApiDataResponse<Trade>>("/api/v1/trades", {
    method: "POST",
    body: JSON.stringify(input),
    getAuthToken,
  });
}

export async function updateTrade(
  getAuthToken: () => Promise<string | null>,
  tradeId: string,
  input: UpdateTradeInput,
) {
  return apiRequest<ApiDataResponse<Trade>>(`/api/v1/trades/${tradeId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
    getAuthToken,
  });
}

export async function addExecution(
  getAuthToken: () => Promise<string | null>,
  tradeId: string,
  input: AddExecutionInput,
) {
  return apiRequest<ApiDataResponse<Trade>>(
    `/api/v1/trades/${tradeId}/executions`,
    {
      method: "POST",
      body: JSON.stringify(input),
      getAuthToken,
    },
  );
}

export async function closeTrade(
  getAuthToken: () => Promise<string | null>,
  tradeId: string,
  input: CloseTradeInput,
) {
  return apiRequest<ApiDataResponse<Trade>>(`/api/v1/trades/${tradeId}/close`, {
    method: "POST",
    body: JSON.stringify(input),
    getAuthToken,
  });
}

export async function getTradeReview(
  getAuthToken: () => Promise<string | null>,
  tradeId: string,
) {
  return apiRequest<ApiDataResponse<TradeReview>>(
    `/api/v1/trades/${tradeId}/review`,
    { getAuthToken },
  );
}

export async function updateTradeReview(
  getAuthToken: () => Promise<string | null>,
  tradeId: string,
  input: TradeReviewInput,
) {
  return apiRequest<ApiDataResponse<TradeReview>>(
    `/api/v1/trades/${tradeId}/review`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
      getAuthToken,
    },
  );
}
