import Link from "next/link";

import { TradeStatusBadge } from "@/components/trades/trade-status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { formatMoney } from "@/lib/formatting/currency";
import { cn } from "@/lib/utils";
import type { Trade } from "@/types/trade";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getSyncStatus(trade: Trade) {
  if (trade.source === "MT5") {
    return { label: "MT5", tone: "text-success" };
  }

  return { label: "MANUAL", tone: "text-muted-foreground" };
}

export function OpenPositionsCard({
  trades,
  title = "Open positions",
  description = "Currently open trades from your journal.",
  showViewAll = false,
}: {
  trades: Trade[];
  title?: string;
  description?: string;
  showViewAll?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {showViewAll ? (
          <Link
            href="/live-trades"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            View all
          </Link>
        ) : null}
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {trades.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No open positions. Create a trade or wait for MT5 sync in a later
            phase.
          </p>
        ) : (
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="text-muted-foreground border-b text-left">
                <th className="pb-2 font-medium">Instrument</th>
                <th className="pb-2 font-medium">Entry</th>
                <th className="pb-2 font-medium">SL</th>
                <th className="pb-2 font-medium">TP</th>
                <th className="pb-2 font-medium">Volume</th>
                <th className="pb-2 font-medium">Risk</th>
                <th className="pb-2 font-medium">Opened</th>
                <th className="pb-2 font-medium">Sync</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => {
                const sync = getSyncStatus(trade);

                return (
                  <tr key={trade.id} className="border-b last:border-0">
                    <td className="py-3">
                      <Link
                        href={`/trades/${trade.id}`}
                        className="font-medium hover:underline"
                      >
                        {trade.symbol} · {trade.direction}
                      </Link>
                      <div className="mt-1">
                        <TradeStatusBadge status={trade.status} />
                      </div>
                    </td>
                    <td className="tabular-data py-3">
                      {trade.averageEntryPrice}
                    </td>
                    <td className="tabular-data py-3">
                      {trade.currentStopLoss ?? "—"}
                    </td>
                    <td className="tabular-data py-3">
                      {trade.currentTakeProfit ?? "—"}
                    </td>
                    <td className="tabular-data py-3">{trade.currentVolume}</td>
                    <td className="tabular-data py-3">
                      {trade.initialRiskAmount
                        ? formatMoney(
                            trade.initialRiskAmount,
                            trade.tradingAccount.currency,
                          )
                        : "—"}
                    </td>
                    <td className="py-3">{formatDate(trade.openedAt)}</td>
                    <td className={`py-3 font-medium ${sync.tone}`}>
                      {sync.label}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
