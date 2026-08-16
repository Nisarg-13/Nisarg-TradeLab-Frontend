export function formatTradePrice(value: string | null | undefined): string {
  if (value == null) {
    return "—";
  }

  const normalized = value.trim();

  if (!normalized) {
    return "—";
  }

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
