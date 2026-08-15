import { apiRequest } from "./client";
import type {
  ApiDataResponse,
  CreateMt5ConnectionResponse,
  Mt5Connection,
} from "@/types/mt5";

export async function listMt5Connections(
  getAuthToken: () => Promise<string | null>,
) {
  return apiRequest<ApiDataResponse<Mt5Connection[]>>(
    "/api/v1/mt5/connections",
    { getAuthToken },
  );
}

export async function createMt5Connection(
  getAuthToken: () => Promise<string | null>,
  tradingAccountId: string,
) {
  return apiRequest<ApiDataResponse<CreateMt5ConnectionResponse>>(
    "/api/v1/mt5/connections",
    {
      method: "POST",
      body: JSON.stringify({ tradingAccountId }),
      getAuthToken,
    },
  );
}

export async function revokeMt5Connection(
  getAuthToken: () => Promise<string | null>,
  connectionId: string,
) {
  return apiRequest<ApiDataResponse<{ revoked: boolean }>>(
    `/api/v1/mt5/connections/${connectionId}`,
    {
      method: "DELETE",
      getAuthToken,
    },
  );
}

export async function recalculateMt5Trades(
  getAuthToken: () => Promise<string | null>,
  tradingAccountId: string,
) {
  return apiRequest<
    ApiDataResponse<{ updated: number; total: number }>
  >("/api/v1/mt5/recalculate-trades", {
    method: "POST",
    body: JSON.stringify({ tradingAccountId }),
    getAuthToken,
  });
}
