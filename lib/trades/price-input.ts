export function formatPriceInput(value: string | null | undefined): string {
  if (!value) {
    return "";
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return "";
  }

  return value;
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
