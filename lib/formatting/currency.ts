export function formatMoney(
  value: string | null | undefined,
  currency: string,
) {
  const amount = Number(value);
  const safeAmount = Number.isFinite(amount) ? amount : 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(safeAmount);
}
