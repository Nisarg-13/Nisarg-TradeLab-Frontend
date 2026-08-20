"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  getTradeSortDirection,
  toggleTradeSort,
  type TradeSortColumn,
} from "@/lib/trades/sort";
import type { TradeSort } from "@/types/trade";

export function SortableTableHeader({
  label,
  column,
  sort,
  onSortChange,
  className,
}: {
  label: string;
  column: TradeSortColumn;
  sort: TradeSort;
  onSortChange: (sort: TradeSort) => void;
  className?: string;
}) {
  const direction = getTradeSortDirection(sort, column);
  const isActive = direction !== null;

  return (
    <th className={cn("pr-4 pb-3 font-medium", className)}>
      <button
        type="button"
        onClick={() => onSortChange(toggleTradeSort(sort, column))}
        className={cn(
          "hover:text-foreground inline-flex items-center gap-1 transition-colors",
          isActive ? "text-foreground" : "text-muted-foreground",
        )}
        aria-label={`Sort by ${label}`}
      >
        <span>{label}</span>
        {direction === "asc" ? (
          <ArrowUp className="size-3.5 shrink-0" aria-hidden="true" />
        ) : direction === "desc" ? (
          <ArrowDown className="size-3.5 shrink-0" aria-hidden="true" />
        ) : (
          <ArrowUpDown
            className="size-3.5 shrink-0 opacity-50"
            aria-hidden="true"
          />
        )}
      </button>
    </th>
  );
}
