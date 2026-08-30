import type { AiPeriodPreset } from "@/types/ai";

export const AI_PERIOD_OPTIONS: Array<{
  value: AiPeriodPreset;
  label: string;
}> = [
  { value: "all_time", label: "All time" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last_week", label: "Last 7 days" },
  { value: "last_month", label: "Last 30 days" },
];

export const DEFAULT_AI_PERIOD: AiPeriodPreset = "all_time";
