import { normalizeTradePriceString } from "@/lib/formatting/trade-price";

export function formatPriceInput(value: string | null | undefined): string {
  if (!value) {
    return "";
  }

  const normalized = normalizeTradePriceString(value);
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return "";
  }

  return normalized;
}

export function parseOptionalPrice(value: string): number | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error("Stop loss and take profit must be greater than zero.");
  }

  return parsed;
}
