"use client";

import Link from "next/link";

import { TradeStatusBadge } from "@/components/trades/trade-status-badge";
import { formatTradeHoldingDuration } from "@/lib/formatting/datetime";
import { formatTradePrice } from "@/lib/formatting/trade-price";
import { pnlTextClass } from "@/lib/formatting/pnl-tone";
import { cn } from "@/lib/utils";
import type { Trade } from "@/types/trade";
import type { TradeDirection } from "@/types/risk";

function formatSignedPnl(value: string, currency: string) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
    signDisplay: amount === 0 ? "auto" : "always",
  }).format(amount);
}

function directionClass(direction: TradeDirection) {
  return direction === "LONG" ? "text-profit" : "text-loss";
}

export function TradesTable({
  trades,
  showAccount = false,
  emptyMessage = "No trades yet. Create your first trade to start journaling.",
  selectable = false,
  selectedTradeIds = [],
  onSelectedTradeIdsChange,
}: {
  trades: Trade[];
  showAccount?: boolean;
  emptyMessage?: string;
  selectable?: boolean;
  selectedTradeIds?: string[];
  onSelectedTradeIdsChange?: (tradeIds: string[]) => void;
}) {
  if (trades.length === 0) {
    return <p className="text-muted-foreground text-sm">{emptyMessage}</p>;
  }

  const allSelected =
    selectable &&
    trades.length > 0 &&
    trades.every((trade) => selectedTradeIds.includes(trade.id));
  const someSelected =
    selectable && trades.some((trade) => selectedTradeIds.includes(trade.id));

  function toggleTrade(tradeId: string) {
    if (!onSelectedTradeIdsChange) {
      return;
    }

    onSelectedTradeIdsChange(
      selectedTradeIds.includes(tradeId)
        ? selectedTradeIds.filter((id) => id !== tradeId)
        : [...selectedTradeIds, tradeId],
    );
  }

  function toggleAll() {
    if (!onSelectedTradeIdsChange) {
      return;
    }

    if (allSelected) {
      const visibleIds = new Set(trades.map((trade) => trade.id));
      onSelectedTradeIdsChange(
        selectedTradeIds.filter((id) => !visibleIds.has(id)),
      );
      return;
    }

    const merged = new Set([...selectedTradeIds, ...trades.map((t) => t.id)]);
    onSelectedTradeIdsChange([...merged]);
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-sm">
        <thead>
          <tr className="text-muted-foreground border-b text-left text-[11px] tracking-wide uppercase">
            {selectable ? (
              <th className="w-10 pr-3 pb-3 font-medium">
                <input
                  type="checkbox"
                  aria-label="Select all trades on this page"
                  checked={allSelected}
                  ref={(element) => {
                    if (element) {
                      element.indeterminate = someSelected && !allSelected;
                    }
                  }}
                  onChange={toggleAll}
                  className="border-input bg-background accent-primary size-4 rounded border"
                />
              </th>
            ) : null}
            <th className="pr-4 pb-3 font-medium">Symbol</th>
            {showAccount ? (
              <th className="pr-4 pb-3 font-medium">Account</th>
            ) : null}
            <th className="pr-4 pb-3 font-medium">Side</th>
            <th className="pr-4 pb-3 font-medium">Entry</th>
            <th className="pr-4 pb-3 font-medium">Exit</th>
            <th className="pr-4 pb-3 font-medium">Duration</th>
            <th className="pr-4 pb-3 font-medium">PnL</th>
            <th className="pb-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => {
            const currency = trade.tradingAccount.currency;
            const isOpen = trade.status === "OPEN";
            const isSelected = selectedTradeIds.includes(trade.id);

            return (
              <tr
                key={trade.id}
                className={cn(
                  "border-border/60 hover:bg-card-hover border-b transition-colors last:border-0",
                  isSelected && "bg-primary/5",
                )}
              >
                {selectable ? (
                  <td className="py-3.5 pr-3">
                    <input
                      type="checkbox"
                      aria-label={`Select ${trade.symbol} trade`}
                      checked={isSelected}
                      onChange={() => toggleTrade(trade.id)}
                      className="border-input bg-background accent-primary size-4 rounded border"
                    />
                  </td>
                ) : null}
                <td className="py-3.5 pr-4">
                  <Link
                    href={`/trades/${trade.id}`}
                    className="font-medium hover:underline"
                  >
                    {trade.symbol}
                  </Link>
                </td>
                {showAccount ? (
                  <td className="text-muted-foreground py-3.5 pr-4">
                    {trade.tradingAccount.name}
                  </td>
                ) : null}
                <td
                  className={cn(
                    "py-3.5 pr-4 font-medium",
                    directionClass(trade.direction),
                  )}
                >
                  {trade.direction}
                </td>
                <td className="tabular-data text-muted-foreground py-3.5 pr-4">
                  {formatTradePrice(trade.averageEntryPrice)}
                </td>
                <td className="tabular-data text-muted-foreground py-3.5 pr-4">
                  {isOpen ? "—" : formatTradePrice(trade.averageExitPrice)}
                </td>
                <td className="text-muted-foreground py-3.5 pr-4 whitespace-nowrap">
                  {formatTradeHoldingDuration(
                    trade.openedAt,
                    trade.closedAt,
                    trade.status,
                  )}
                </td>
                <td
                  className={cn(
                    "tabular-data py-3.5 pr-4 font-medium",
                    isOpen
                      ? "text-muted-foreground"
                      : pnlTextClass(trade.netPnl),
                  )}
                >
                  {isOpen ? "—" : formatSignedPnl(trade.netPnl, currency)}
                </td>
                <td className="py-3.5">
                  <TradeStatusBadge status={trade.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
