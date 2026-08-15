import { apiRequest } from "./client";
import type { ApiDataResponse, InstrumentSpec } from "@/types/instrument";

export async function listInstruments(
  getAuthToken: () => Promise<string | null>,
  accountId: string,
) {
  return apiRequest<ApiDataResponse<InstrumentSpec[]>>(
    `/api/v1/accounts/${accountId}/instruments`,
    { getAuthToken },
  );
}
