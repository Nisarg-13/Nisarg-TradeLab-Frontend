import Link from "next/link";

import { TradeStatusBadge } from "@/components/trades/trade-status-badge";
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
}: {
  trades: Trade[];
  showAccount?: boolean;
  emptyMessage?: string;
}) {
  if (trades.length === 0) {
    return <p className="text-muted-foreground text-sm">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="text-muted-foreground border-b text-left text-[11px] tracking-wide uppercase">
            <th className="pr-4 pb-3 font-medium">Symbol</th>
            {showAccount ? (
              <th className="pr-4 pb-3 font-medium">Account</th>
            ) : null}
            <th className="pr-4 pb-3 font-medium">Side</th>
            <th className="pr-4 pb-3 font-medium">Entry</th>
            <th className="pr-4 pb-3 font-medium">Exit</th>
            <th className="pr-4 pb-3 font-medium">PnL</th>
            <th className="pb-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => {
            const currency = trade.tradingAccount.currency;
            const isOpen = trade.status === "OPEN";

            return (
              <tr
                key={trade.id}
                className="border-border/60 hover:bg-card-hover border-b transition-colors last:border-0"
              >
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
