import type { AnalyticsQuery } from "@/types/analytics";

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

export function analyticsTabFromParams(params: URLSearchParams) {
  const tab = params.get("tab");
  return tab ?? "overview";
}

export function serializeAnalyticsTab(tab: string, query: AnalyticsQuery) {
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
