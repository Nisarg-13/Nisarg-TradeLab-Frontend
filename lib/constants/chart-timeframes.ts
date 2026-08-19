export const CHART_TIMEFRAME_OPTIONS = [
  { value: "M1", label: "1 minute (M1)" },
  { value: "M5", label: "5 minutes (M5)" },
  { value: "M15", label: "15 minutes (M15)" },
  { value: "M30", label: "30 minutes (M30)" },
  { value: "H1", label: "1 hour (H1)" },
  { value: "H4", label: "4 hours (H4)" },
  { value: "D1", label: "Daily (D1)" },
  { value: "W1", label: "Weekly (W1)" },
] as const;

export type ChartTimeframe = (typeof CHART_TIMEFRAME_OPTIONS)[number]["value"];

export const CHART_TIMEFRAME_LABELS: Record<ChartTimeframe, string> = {
  M1: "1 minute",
  M5: "5 minutes",
  M15: "15 minutes",
  M30: "30 minutes",
  H1: "1 hour",
  H4: "4 hours",
  D1: "Daily",
  W1: "Weekly",
};
