export function normalizeTradePriceString(value: string): string {
  const trimmed = value.trim();

  if (!trimmed.includes(".")) {
    return trimmed;
  }

  const [integerPart, fractionalPart] = trimmed.split(".");
  const normalizedFraction = fractionalPart.replace(/0+$/, "");

  return normalizedFraction
    ? `${integerPart}.${normalizedFraction}`
    : integerPart;
}

export function formatTradePrice(value: string | null | undefined): string {
  if (value == null) {
    return "—";
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return "—";
  }

  const normalized = normalizeTradePriceString(trimmed);
  const numeric = Number(normalized);

  if (!Number.isFinite(numeric) || numeric <= 0) {
    return "—";
  }

  const [, decimalPart = ""] = normalized.split(".");
  const fractionDigits = decimalPart.length;

  return new Intl.NumberFormat("en-US", {
    useGrouping: true,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(numeric);
}
