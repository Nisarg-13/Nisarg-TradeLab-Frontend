import { apiRequest } from "./client";
import type {
  AiAnalysis,
  AiAnalysisQuery,
  AiChatInput,
  AiChatMessage,
  ApiDataResponse,
} from "@/types/ai";

function buildQuery(params: AiAnalysisQuery) {
  const search = new URLSearchParams();

  if (params.tradingAccountId) {
    search.set("tradingAccountId", params.tradingAccountId);
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}

export async function generateAiAnalysis(
  getAuthToken: () => Promise<string | null>,
  query: AiAnalysisQuery = {},
) {
  return apiRequest<ApiDataResponse<AiAnalysis>>(
    `/api/v1/ai/analysis${buildQuery(query)}`,
    { method: "POST", getAuthToken },
  );
}

export async function listAiAnalyses(
  getAuthToken: () => Promise<string | null>,
) {
  return apiRequest<ApiDataResponse<AiAnalysis[]>>("/api/v1/ai/analysis", {
    getAuthToken,
  });
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
) {
  return apiRequest<ApiDataResponse<AiChatMessage[]>>(
    "/api/v1/ai/chat/history",
    { getAuthToken },
  );
}
