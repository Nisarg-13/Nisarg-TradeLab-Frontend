import { apiRequest } from "./client";
import type {
  AiAnalysis,
  AiAnalysisQuery,
  AiChatInput,
  AiChatMessage,
  AiScopeQuery,
  ApiDataResponse,
} from "@/types/ai";

function buildScopeQuery(params: AiScopeQuery = {}) {
  const search = new URLSearchParams();

  if (params.tradingAccountId) {
    search.set("tradingAccountId", params.tradingAccountId);
  }

  if (params.periodPreset && params.periodPreset !== "all_time") {
    search.set("periodPreset", params.periodPreset);
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}

export async function generateAiAnalysis(
  getAuthToken: () => Promise<string | null>,
  query: AiAnalysisQuery = {},
) {
  return apiRequest<ApiDataResponse<AiAnalysis>>(
    `/api/v1/ai/analysis${buildScopeQuery(query)}`,
    { method: "POST", getAuthToken },
  );
}

export async function listAiAnalyses(
  getAuthToken: () => Promise<string | null>,
  query: Pick<AiScopeQuery, "tradingAccountId"> = {},
) {
  const search = new URLSearchParams();

  if (query.tradingAccountId) {
    search.set("tradingAccountId", query.tradingAccountId);
  }

  const suffix = search.toString() ? `?${search.toString()}` : "";

  return apiRequest<ApiDataResponse<AiAnalysis[]>>(
    `/api/v1/ai/analysis${suffix}`,
    {
      getAuthToken,
    },
  );
}

export async function getAiAnalysis(
  getAuthToken: () => Promise<string | null>,
  analysisId: string,
) {
  return apiRequest<ApiDataResponse<AiAnalysis>>(
    `/api/v1/ai/analysis/${analysisId}`,
    { getAuthToken },
  );
}

export async function askAiJournal(
  getAuthToken: () => Promise<string | null>,
  input: AiChatInput,
) {
  return apiRequest<ApiDataResponse<AiChatMessage>>("/api/v1/ai/chat", {
    method: "POST",
    body: JSON.stringify(input),
    getAuthToken,
  });
}

export async function listAiChatHistory(
  getAuthToken: () => Promise<string | null>,
  query: Pick<AiScopeQuery, "tradingAccountId"> = {},
) {
  const search = new URLSearchParams();

  if (query.tradingAccountId) {
    search.set("tradingAccountId", query.tradingAccountId);
  }

  const suffix = search.toString() ? `?${search.toString()}` : "";

  return apiRequest<ApiDataResponse<AiChatMessage[]>>(
    `/api/v1/ai/chat/history${suffix}`,
    { getAuthToken },
  );
}
