import { apiRequest } from "./client";
import type {
  ApiDataResponse,
  LiveTradesQuery,
  LiveTradesResponse,
} from "@/types/live-trades";

function buildQuery(params: LiveTradesQuery) {
  const search = new URLSearchParams();

  if (params.tradingAccountId) {
    search.set("tradingAccountId", params.tradingAccountId);
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}

export async function getLiveTrades(
  getAuthToken: () => Promise<string | null>,
  query: LiveTradesQuery = {},
) {
  return apiRequest<ApiDataResponse<LiveTradesResponse>>(
    `/api/v1/live-trades${buildQuery(query)}`,
    { getAuthToken },
  );
}
