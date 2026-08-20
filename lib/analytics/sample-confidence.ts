import type { SampleConfidence } from "@/types/analytics";

const SAMPLE_RANGES: Record<
  SampleConfidence,
  { label: string; description: string }
> = {
  INSUFFICIENT: {
    label: "Insufficient",
    description: "Fewer than 5 closed trades — win rate is not meaningful yet.",
  },
  VERY_LOW: {
    label: "Very low",
    description: "5–9 closed trades — too early to trust this win rate.",
  },
  LOW: {
    label: "Low",
    description: "10–19 closed trades — directionally useful, still noisy.",
  },
  MODERATE: {
    label: "Moderate",
    description: "20–49 closed trades — reasonably useful sample size.",
  },
  HIGHER: {
    label: "Higher",
    description: "50+ closed trades — more statistically meaningful.",
  },
};

export function formatSampleConfidenceLabel(confidence: SampleConfidence) {
  return SAMPLE_RANGES[confidence].label;
}

/** Short hint for dashboard cards: trade count + plain-English reliability. */
export function formatWinRateSampleHint(
  closedTradeCount: number,
  confidence: SampleConfidence,
) {
  const { label, description } = SAMPLE_RANGES[confidence];

  if (closedTradeCount === 0) {
    return "No closed trades yet — win rate appears after your first close.";
  }

  return `${closedTradeCount} closed trades · ${label} sample — ${description}`;
}
