import { apiRequest } from "./client";
import type {
  AnalyticsQuery,
  AnalyticsSummary,
  ApiDataResponse,
  InstrumentPerformance,
  PlanComplianceGroup,
  RiskStatGroup,
  StrategyPerformance,
} from "@/types/analytics";

function buildQuery(params: AnalyticsQuery) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      search.set(key, value);
    }
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}

export async function getAnalyticsSummary(
  getAuthToken: () => Promise<string | null>,
  query: AnalyticsQuery = {},
) {
  return apiRequest<ApiDataResponse<AnalyticsSummary>>(
    `/api/v1/analytics/summary${buildQuery(query)}`,
    { getAuthToken },
  );
}

export async function getInstrumentPerformance(
  getAuthToken: () => Promise<string | null>,
  query: AnalyticsQuery = {},
) {
  return apiRequest<ApiDataResponse<InstrumentPerformance[]>>(
    `/api/v1/analytics/instruments${buildQuery(query)}`,
    { getAuthToken },
  );
}

export async function getStrategyPerformance(
  getAuthToken: () => Promise<string | null>,
  query: AnalyticsQuery = {},
) {
  return apiRequest<ApiDataResponse<StrategyPerformance[]>>(
    `/api/v1/analytics/strategies${buildQuery(query)}`,
    { getAuthToken },
  );
}

export async function getPlanCompliance(
  getAuthToken: () => Promise<string | null>,
  query: AnalyticsQuery = {},
) {
  return apiRequest<ApiDataResponse<PlanComplianceGroup[]>>(
    `/api/v1/analytics/plan-compliance${buildQuery(query)}`,
    { getAuthToken },
  );
}

export async function getRiskStats(
  getAuthToken: () => Promise<string | null>,
  query: AnalyticsQuery = {},
) {
  return apiRequest<ApiDataResponse<RiskStatGroup[]>>(
    `/api/v1/analytics/risk${buildQuery(query)}`,
    { getAuthToken },
  );
}
