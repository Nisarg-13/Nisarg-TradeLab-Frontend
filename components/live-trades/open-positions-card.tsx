"use client";

import Link from "next/link";

import { TradeStatusBadge } from "@/components/trades/trade-status-badge";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/layout/empty-state";
import { FormattedDateTime } from "@/components/formatting/formatted-datetime";
import { formatMoney } from "@/lib/formatting/currency";
import { formatTradePrice } from "@/lib/formatting/trade-price";
import { cn } from "@/lib/utils";
import type { LiveDataStatus, LiveTradePosition } from "@/types/live-trades";

function liveStatusTone(status: LiveDataStatus) {
  switch (status) {
    case "LIVE":
      return "border-profit/30 bg-profit/10 text-profit";
    case "STALE":
      return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    default:
      return "border-loss/30 bg-loss/10 text-loss";
  }
}

function formatSignedMoney(value: string | null, currency: string) {
  if (value === null) return "—";

  const amount = Number(value);
  const formatted = formatMoney(String(Math.abs(amount)), currency);

  if (amount > 0) return `+${formatted}`;
  if (amount < 0) return `-${formatted}`;
  return formatted;
}

export function OpenPositionsCard({
  positions,
  title = "Open positions",
  description = "Currently open trades from your journal and MT5 sync.",
  showViewAll = false,
}: {
  positions: LiveTradePosition[];
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
        {positions.length === 0 ? (
          <EmptyState
            title="No open positions"
            description="Open a manual trade or connect MT5 to see live broker positions here."
          />
        ) : (
          <table className="w-full min-w-[920px] text-sm">
            <thead>
              <tr className="text-muted-foreground border-b text-left">
                <th className="pb-2 font-medium">Instrument</th>
                <th className="pb-2 font-medium">Entry</th>
                <th className="pb-2 font-medium">Current</th>
                <th className="pb-2 font-medium">SL</th>
                <th className="pb-2 font-medium">TP</th>
                <th className="pb-2 font-medium">Volume</th>
                <th className="pb-2 font-medium">Floating PnL</th>
                <th className="pb-2 font-medium">Current R</th>
                <th className="pb-2 font-medium">Opened</th>
                <th className="pb-2 font-medium">Sync</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position) => (
                <tr key={position.id} className="border-b last:border-0">
                  <td className="py-3">
                    <Link
                      href={`/trades/${position.id}`}
                      className="font-medium hover:underline"
                    >
                      {position.symbol} · {position.direction}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <TradeStatusBadge status={position.status} />
                      <Badge variant="outline">{position.source}</Badge>
                    </div>
                  </td>
                  <td className="tabular-data py-3">
                    {formatTradePrice(position.averageEntryPrice)}
                  </td>
                  <td className="tabular-data py-3">
                    {position.currentPrice
                      ? formatTradePrice(position.currentPrice)
                      : "—"}
                  </td>
                  <td className="tabular-data py-3">
                    {formatTradePrice(position.currentStopLoss)}
                  </td>
                  <td className="tabular-data py-3">
                    {formatTradePrice(position.currentTakeProfit)}
                  </td>
                  <td className="tabular-data py-3">
                    {position.currentVolume}
                  </td>
                  <td
                    className={cn(
                      "tabular-data py-3 font-medium",
                      position.floatingPnl && Number(position.floatingPnl) >= 0
                        ? "text-profit"
                        : "text-loss",
                    )}
                  >
                    {formatSignedMoney(
                      position.floatingPnl,
                      position.tradingAccount.currency,
                    )}
                  </td>
                  <td className="tabular-data py-3">
                    {position.currentR ?? "—"}
                  </td>
                  <td className="py-3">
                    <FormattedDateTime
                      value={position.openedAt}
                      withSeconds={false}
                    />
                  </td>
                  <td className="py-3">
                    <Badge className={liveStatusTone(position.liveStatus)}>
                      {position.liveStatus}
                    </Badge>
                    {position.lastSyncedAt ? (
                      <p className="text-muted-foreground mt-1 text-xs">
                        <FormattedDateTime
                          value={position.lastSyncedAt}
                          withSeconds={false}
                        />
                      </p>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
