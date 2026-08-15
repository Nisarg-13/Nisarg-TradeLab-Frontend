import { apiRequest } from "./client";
import type {
  AnalyticsQuery,
  AnalyticsSummary,
  ApiDataResponse,
  HeatmapData,
  HeatmapMetric,
  InstrumentPerformance,
  MistakeAnalyticsGroup,
  PeriodComparison,
  PeriodComparisonMode,
  PlanComplianceGroup,
  PsychologyAnalytics,
  RiskStatGroup,
  RollingPerformance,
  StrategyPerformance,
  TimeAnalytics,
  TradeMetricsGroup,
} from "@/types/analytics";

function buildQuery(
  params: Record<string, string | undefined>,
  extra?: Record<string, string | undefined>,
) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries({ ...params, ...extra })) {
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

export async function getTimeAnalytics(
  getAuthToken: () => Promise<string | null>,
  query: AnalyticsQuery = {},
) {
  return apiRequest<ApiDataResponse<TimeAnalytics>>(
    `/api/v1/analytics/time${buildQuery(query)}`,
    { getAuthToken },
  );
}

export async function getHeatmapAnalytics(
  getAuthToken: () => Promise<string | null>,
  query: AnalyticsQuery = {},
  metric: HeatmapMetric = "pnl",
) {
  return apiRequest<ApiDataResponse<HeatmapData>>(
    `/api/v1/analytics/heatmap${buildQuery(query, { metric })}`,
    { getAuthToken },
  );
}

export async function getPsychologyAnalytics(
  getAuthToken: () => Promise<string | null>,
  query: AnalyticsQuery = {},
) {
  return apiRequest<ApiDataResponse<PsychologyAnalytics>>(
    `/api/v1/analytics/psychology${buildQuery(query)}`,
    { getAuthToken },
  );
}

export async function getMistakeAnalytics(
  getAuthToken: () => Promise<string | null>,
  query: AnalyticsQuery = {},
) {
  return apiRequest<ApiDataResponse<MistakeAnalyticsGroup[]>>(
    `/api/v1/analytics/mistakes${buildQuery(query)}`,
    { getAuthToken },
  );
}

export async function getDurationAnalytics(
  getAuthToken: () => Promise<string | null>,
  query: AnalyticsQuery = {},
) {
  return apiRequest<ApiDataResponse<TradeMetricsGroup[]>>(
    `/api/v1/analytics/duration${buildQuery(query)}`,
    { getAuthToken },
  );
}

export async function getRollingPerformance(
  getAuthToken: () => Promise<string | null>,
  query: AnalyticsQuery = {},
) {
  return apiRequest<ApiDataResponse<RollingPerformance>>(
    `/api/v1/analytics/rolling${buildQuery(query)}`,
    { getAuthToken },
  );
}

export async function getPeriodComparison(
  getAuthToken: () => Promise<string | null>,
  query: AnalyticsQuery = {},
  mode: PeriodComparisonMode = "LATEST_20_VS_PREVIOUS_20",
  custom?: {
    periodAFrom?: string;
    periodATo?: string;
    periodBFrom?: string;
    periodBTo?: string;
  },
) {
  return apiRequest<ApiDataResponse<PeriodComparison>>(
    `/api/v1/analytics/period-comparison${buildQuery(query, {
      mode,
      periodAFrom: custom?.periodAFrom,
      periodATo: custom?.periodATo,
      periodBFrom: custom?.periodBFrom,
      periodBTo: custom?.periodBTo,
    })}`,
    { getAuthToken },
  );
}
