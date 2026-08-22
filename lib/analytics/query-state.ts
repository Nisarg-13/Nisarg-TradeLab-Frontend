import type { AnalyticsQuery } from "@/types/analytics";

export const ANALYTICS_TABS = [
  { id: "overview", label: "Overview" },
  { id: "sessions", label: "Sessions" },
  { id: "instruments", label: "Instruments" },
  { id: "strategies", label: "Strategies" },
  { id: "direction", label: "Long / Short" },
  { id: "time", label: "Time" },
  { id: "psychology", label: "Psychology" },
  { id: "risk", label: "Risk" },
  { id: "mistakes", label: "Mistakes" },
  { id: "setups", label: "Entry criteria" },
  { id: "compare", label: "Compare" },
] as const;

export type AnalyticsTabId = (typeof ANALYTICS_TABS)[number]["id"];

const ANALYTICS_TAB_IDS = new Set<string>(ANALYTICS_TABS.map((tab) => tab.id));

const ANALYTICS_QUERY_KEYS = [
  "tradingAccountId",
  "closedFrom",
  "closedTo",
  "symbol",
  "strategyId",
  "tagId",
  "direction",
  "mistakeId",
  "preTradeEmotion",
  "postTradeEmotion",
  "planCompliance",
  "marketBias",
  "confidenceMin",
  "confidenceMax",
  "riskMin",
  "riskMax",
  "session",
  "result",
] as const satisfies ReadonlyArray<keyof AnalyticsQuery>;

export function parseAnalyticsQuery(params: URLSearchParams): AnalyticsQuery {
  const query: AnalyticsQuery = {};

  for (const key of ANALYTICS_QUERY_KEYS) {
    const value = params.get(key);

    if (value) {
      (query as Record<string, string>)[key] = value;
    }
  }

  return query;
}

export function countActiveAnalyticsFilters(
  filters: AnalyticsQuery,
  accountId = "",
): number {
  let count = 0;

  if (filters.tradingAccountId ?? accountId) {
    count += 1;
  }

  if (filters.closedFrom) {
    count += 1;
  }

  if (filters.closedTo) {
    count += 1;
  }

  if (filters.symbol?.trim()) {
    count += 1;
  }

  if (filters.strategyId) {
    count += 1;
  }

  if (filters.tagId) {
    count += 1;
  }

  if (filters.direction) {
    count += 1;
  }

  if (filters.result) {
    count += 1;
  }

  if (filters.session) {
    count += 1;
  }

  if (filters.riskMin) {
    count += 1;
  }

  if (filters.riskMax) {
    count += 1;
  }

  if (filters.confidenceMin) {
    count += 1;
  }

  if (filters.confidenceMax) {
    count += 1;
  }

  if (filters.marketBias) {
    count += 1;
  }

  if (filters.mistakeId) {
    count += 1;
  }

  if (filters.preTradeEmotion) {
    count += 1;
  }

  if (filters.postTradeEmotion) {
    count += 1;
  }

  if (filters.planCompliance) {
    count += 1;
  }

  return count;
}

export function serializeAnalyticsQuery(query: AnalyticsQuery): string {
  const params = new URLSearchParams();

  for (const key of ANALYTICS_QUERY_KEYS) {
    const value = query[key];

    if (value) {
      params.set(key, value);
    }
  }

  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}

export function analyticsTabFromParams(
  params: URLSearchParams,
): AnalyticsTabId {
  const tab = params.get("tab") ?? "overview";
  return ANALYTICS_TAB_IDS.has(tab) ? (tab as AnalyticsTabId) : "overview";
}

export function serializeAnalyticsTab(
  tab: AnalyticsTabId | string,
  query: AnalyticsQuery,
) {
  const params = new URLSearchParams();

  for (const key of ANALYTICS_QUERY_KEYS) {
    const value = query[key];

    if (value) {
      params.set(key, value);
    }
  }

  if (tab !== "overview") {
    params.set("tab", tab);
  }

  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}
