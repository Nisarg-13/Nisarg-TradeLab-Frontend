import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatMoney } from "@/lib/formatting/currency";
import { pnlSurfaceClass } from "@/lib/formatting/pnl-tone";
import type { CalendarDay } from "@/types/analytics";

function dayTone(pnl: number) {
  return pnlSurfaceClass(pnl);
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
                className={`hover:bg-card-hover rounded-lg border p-3 text-sm transition-colors ${dayTone(Number(day.pnl))}`}
              >
                <p className="font-medium">{day.date}</p>
                <p className="tabular-data font-medium">
                  {formatMoney(day.pnl, currency)}
                </p>
                <p className="tabular-data text-xs">
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
