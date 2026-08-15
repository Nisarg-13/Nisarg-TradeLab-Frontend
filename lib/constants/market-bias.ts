import type { MarketBias } from "@/types/journal";

export const MARKET_BIAS_OPTIONS: { value: MarketBias; label: string }[] = [
  { value: "BULLISH", label: "Bullish" },
  { value: "BEARISH", label: "Bearish" },
  { value: "NEUTRAL", label: "Neutral" },
];

export const MARKET_BIAS_SELECT_OPTIONS = [
  { value: "", label: "Not set" },
  ...MARKET_BIAS_OPTIONS,
];
