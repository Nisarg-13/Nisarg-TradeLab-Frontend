import type { Trade, TradeSort } from "@/types/trade";

export type TradeSortColumn = "direction" | "netPnl" | "duration";

const COLUMN_SORTS: Record<
  TradeSortColumn,
  { desc: TradeSort; asc: TradeSort }
> = {
  direction: { desc: "direction_desc", asc: "direction_asc" },
  netPnl: { desc: "netPnl_desc", asc: "netPnl_asc" },
  duration: { desc: "duration_desc", asc: "duration_asc" },
};

function tradeDurationMs(trade: Trade): number {
  const openedAt = Date.parse(trade.openedAt);
  const closedAt = trade.closedAt ? Date.parse(trade.closedAt) : Date.now();

  return closedAt - openedAt;
}

function compareTrades(a: Trade, b: Trade, sort: TradeSort): number {
  switch (sort) {
    case "openedAt_desc":
      return Date.parse(b.openedAt) - Date.parse(a.openedAt);
    case "openedAt_asc":
      return Date.parse(a.openedAt) - Date.parse(b.openedAt);
    case "netPnl_desc":
      return Number(b.netPnl) - Number(a.netPnl);
    case "netPnl_asc":
      return Number(a.netPnl) - Number(b.netPnl);
    case "duration_desc":
      return tradeDurationMs(b) - tradeDurationMs(a);
    case "duration_asc":
      return tradeDurationMs(a) - tradeDurationMs(b);
    case "direction_desc":
      return b.direction.localeCompare(a.direction);
    case "direction_asc":
      return a.direction.localeCompare(b.direction);
    default:
      return 0;
  }
}

export function sortTradesClientSide(
  trades: Trade[],
  sort: TradeSort,
): Trade[] {
  return [...trades].sort((left, right) => compareTrades(left, right, sort));
}

export function canSortTradesClientSide(meta: { totalPages: number }): boolean {
  return meta.totalPages <= 1;
}

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
