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

export function RecentTradesCard({ trades }: { trades: Trade[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent trades</CardTitle>
          <CardDescription>Latest journal entries.</CardDescription>
        </div>
        <Link
          href="/trades"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {trades.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No trades yet. Create one from the journal or risk calculator.
          </p>
        ) : (
          trades.map((trade) => (
            <Link
              key={trade.id}
              href={`/trades/${trade.id}`}
              className="hover:bg-muted/50 block rounded-lg border p-4 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">
                      {trade.symbol} · {trade.direction}
                    </p>
                    <TradeStatusBadge status={trade.status} />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {formatDate(trade.openedAt)}
                  </p>
                </div>
                <p
                  className={`font-medium tabular-nums ${
                    Number(trade.netPnl) >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-destructive"
                  }`}
                >
                  {formatMoney(trade.netPnl, trade.tradingAccount.currency)}
                </p>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
