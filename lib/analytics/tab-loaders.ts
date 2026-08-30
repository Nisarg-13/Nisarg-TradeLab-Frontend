import {
  getAnalyticsSummary,
  getConcentrationAnalytics,
  getDirectionAnalytics,
  getDurationAnalytics,
  getHeatmapAnalytics,
  getInsightsAnalytics,
  getInstrumentPerformance,
  getMistakeAnalytics,
  getPeriodComparison,
  getPlanCompliance,
  getPsychologyAnalytics,
  getRiskStats,
  getRollingPerformance,
  getSessionDashboard,
  getStrategyPerformance,
  getTagAnalytics,
  getTimeAnalytics,
} from "@/lib/api/analytics";
import type { AnalyticsTabId } from "@/lib/analytics/query-state";
import type {
  AnalyticsQuery,
  HeatmapMetric,
  PeriodComparisonMode,
} from "@/types/analytics";

type AuthTokenGetter = () => Promise<string | null>;

type ComparisonExtras = {
  comparisonMode: PeriodComparisonMode;
  customDates: {
    periodAFrom: string;
    periodATo: string;
    periodBFrom: string;
    periodBTo: string;
  };
  heatmapMetric: HeatmapMetric;
};

export type AnalyticsTabLoadKey =
  | "summary"
  | "planCompliance"
  | "instruments"
  | "sessionDashboard"
  | "insights"
  | "strategies"
  | "riskStats"
  | "time"
  | "duration"
  | "heatmap"
  | "psychology"
  | "mistakes"
  | "rolling"
  | "comparison"
  | "direction"
  | "tags"
  | "concentration";

const TAB_LOAD_KEYS: Record<AnalyticsTabId, AnalyticsTabLoadKey[]> = {
  overview: ["summary", "planCompliance"],
  sessions: ["summary", "sessionDashboard", "insights"],
  instruments: ["summary", "instruments"],
  strategies: ["summary", "strategies"],
  direction: ["summary", "direction"],
  time: ["summary", "time", "duration", "heatmap"],
  risk: ["summary", "riskStats"],
  psychology: ["summary", "psychology", "planCompliance"],
  mistakes: ["summary", "mistakes"],
  setups: ["summary", "tags"],
  compare: ["summary", "comparison", "concentration", "rolling"],
};

export function getAnalyticsTabLoadKeys(
  tab: AnalyticsTabId,
): AnalyticsTabLoadKey[] {
  return TAB_LOAD_KEYS[tab];
}

export async function fetchAnalyticsSections(
  keys: AnalyticsTabLoadKey[],
  getAuthToken: AuthTokenGetter,
  query: AnalyticsQuery,
  extras: ComparisonExtras,
) {
  const uniqueKeys = [...new Set(keys)];
  const results = await Promise.allSettled(
    uniqueKeys.map(async (key) => {
      switch (key) {
        case "summary":
          return [key, await getAnalyticsSummary(getAuthToken, query)] as const;
        case "planCompliance":
          return [key, await getPlanCompliance(getAuthToken, query)] as const;
        case "instruments":
          return [
            key,
            await getInstrumentPerformance(getAuthToken, query),
          ] as const;
        case "sessionDashboard":
          return [key, await getSessionDashboard(getAuthToken, query)] as const;
        case "insights":
          return [
            key,
            await getInsightsAnalytics(getAuthToken, query),
          ] as const;
        case "strategies":
          return [
            key,
            await getStrategyPerformance(getAuthToken, query),
          ] as const;
        case "riskStats":
          return [key, await getRiskStats(getAuthToken, query)] as const;
        case "time":
          return [key, await getTimeAnalytics(getAuthToken, query)] as const;
        case "duration":
          return [
            key,
            await getDurationAnalytics(getAuthToken, query),
          ] as const;
        case "heatmap":
          return [
            key,
            await getHeatmapAnalytics(
              getAuthToken,
              query,
              extras.heatmapMetric,
            ),
          ] as const;
        case "psychology":
          return [
            key,
            await getPsychologyAnalytics(getAuthToken, query),
          ] as const;
        case "mistakes":
          return [key, await getMistakeAnalytics(getAuthToken, query)] as const;
        case "rolling":
          return [
            key,
            await getRollingPerformance(getAuthToken, query),
          ] as const;
        case "comparison":
          return [
            key,
            await getPeriodComparison(
              getAuthToken,
              query,
              extras.comparisonMode,
              extras.comparisonMode === "CUSTOM"
                ? extras.customDates
                : undefined,
            ),
          ] as const;
        case "direction":
          return [
            key,
            await getDirectionAnalytics(getAuthToken, query),
          ] as const;
        case "tags":
          return [key, await getTagAnalytics(getAuthToken, query)] as const;
        case "concentration":
          return [
            key,
            await getConcentrationAnalytics(getAuthToken, query),
          ] as const;
        default:
          return [key, null] as const;
      }
    }),
  );

  const entries: Array<[AnalyticsTabLoadKey, { data: unknown } | null]> = [];

  for (const [index, result] of results.entries()) {
    const key = uniqueKeys[index];

    if (result.status === "fulfilled") {
      entries.push([result.value[0], result.value[1]]);
      continue;
    }

    entries.push([key, null]);
  }

  return Object.fromEntries(entries) as Partial<
    Record<AnalyticsTabLoadKey, { data: unknown } | null>
  >;
}
