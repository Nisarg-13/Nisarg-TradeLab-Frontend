import type { TradeSort } from "@/types/trade";

export type TradeSortColumn = "direction" | "netPnl" | "duration";

const COLUMN_SORTS: Record<
  TradeSortColumn,
  { desc: TradeSort; asc: TradeSort }
> = {
  direction: { desc: "direction_desc", asc: "direction_asc" },
  netPnl: { desc: "netPnl_desc", asc: "netPnl_asc" },
  duration: { desc: "duration_desc", asc: "duration_asc" },
};

export function toggleTradeSort(
  current: TradeSort,
  column: TradeSortColumn,
): TradeSort {
  const { desc, asc } = COLUMN_SORTS[column];

  if (current === desc) {
    return asc;
  }

  return desc;
}

export function getTradeSortDirection(
  current: TradeSort,
  column: TradeSortColumn,
): "asc" | "desc" | null {
  const { desc, asc } = COLUMN_SORTS[column];

  if (current === desc) {
    return "desc";
  }

  if (current === asc) {
    return "asc";
  }

  return null;
}

export function isTradeSortColumn(
  current: TradeSort,
  column: TradeSortColumn,
): boolean {
  return getTradeSortDirection(current, column) !== null;
}
