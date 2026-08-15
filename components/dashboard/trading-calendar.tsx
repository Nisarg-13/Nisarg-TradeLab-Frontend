import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatMoney } from "@/lib/formatting/currency";
import type { CalendarDay } from "@/types/analytics";

function dayTone(pnl: number) {
  if (pnl > 0) {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  }

  if (pnl < 0) {
    return "border-destructive/30 bg-destructive/10 text-destructive";
  }

  return "border-border bg-muted/40 text-muted-foreground";
}

export function TradingCalendar({
  days,
  currency,
}: {
  days: CalendarDay[];
  currency: string;
}) {
  const recentDays = days.slice(-28);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trading calendar</CardTitle>
        <CardDescription>
          Daily PnL, R, and trade count from closed trades.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recentDays.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No closed trades yet for the calendar view.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {recentDays.map((day) => (
              <Link
                key={day.date}
                href={`/trades?openedFrom=${day.date}&openedTo=${day.date}`}
                className={`rounded-lg border p-3 text-sm ${dayTone(Number(day.pnl))}`}
              >
                <p className="font-medium">{day.date}</p>
                <p className="tabular-nums">{formatMoney(day.pnl, currency)}</p>
                <p className="text-xs tabular-nums">
                  {Number(day.r).toFixed(2)}R
                </p>
                <p className="text-xs">
                  {day.tradeCount} trade{day.tradeCount === 1 ? "" : "s"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
