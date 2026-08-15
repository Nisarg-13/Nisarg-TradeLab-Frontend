"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatMoney } from "@/lib/formatting/currency";
import { pnlSurfaceClass, pnlTextClass } from "@/lib/formatting/pnl-tone";
import { cn } from "@/lib/utils";
import type { CalendarDay } from "@/types/analytics";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function parseMonthKey(date: Date) {
  return { year: date.getFullYear(), month: date.getMonth() };
}

function monthKey(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function dateKeyFor(year: number, month: number, day: number) {
  return `${monthKey(year, month)}-${String(day).padStart(2, "0")}`;
}

function formatDayPnl(value: string, currency: string) {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount === 0) {
    return formatMoney("0", currency);
  }

  const formatted = formatMoney(String(Math.abs(amount)), currency);
  return amount > 0 ? `+${formatted}` : `-${formatted}`;
}

function cellTone(pnl: number | null) {
  if (pnl === null) {
    return "border-transparent bg-transparent text-muted-foreground";
  }

  if (pnl === 0) {
    return "border-border/50 bg-muted/20 text-muted-foreground";
  }

  return cn("border", pnlSurfaceClass(pnl));
}

export function DailyPerformanceCalendar({
  days,
  currency,
}: {
  days: CalendarDay[];
  currency: string;
}) {
  const dayMap = useMemo(
    () => new Map(days.map((day) => [day.date, day])),
    [days],
  );

  const initialMonth = useMemo(() => {
    const latest = days.at(-1)?.date;

    if (latest) {
      const [year, month] = latest.split("-").map(Number);
      return { year, month: month - 1 };
    }

    return parseMonthKey(new Date());
  }, [days]);

  const [{ year, month }, setMonth] = useState(initialMonth);

  const monthDays = useMemo(() => {
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<{ day: number | null; date: string | null }> = [];

    for (let index = 0; index < firstWeekday; index += 1) {
      cells.push({ day: null, date: null });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({
        day,
        date: dateKeyFor(year, month, day),
      });
    }

    return cells;
  }, [month, year]);

  function shiftMonth(delta: number) {
    const next = new Date(year, month + delta, 1);
    setMonth(parseMonthKey(next));
  }

  return (
    <Card className="h-full">
      <CardHeader className="space-y-3 pb-2">
        <div>
          <CardTitle className="text-base">Daily PnL</CardTitle>
          <CardDescription className="text-xs">
            Closed-trade net PnL by day.
          </CardDescription>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => shiftMonth(-1)}
            aria-label="Previous month"
          >
            ‹
          </Button>
          <span className="min-w-[5.5rem] text-center text-sm font-medium">
            {monthKey(year, month)}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => shiftMonth(1)}
            aria-label="Next month"
          >
            ›
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {days.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Close a few trades to unlock the daily PnL calendar.
          </p>
        ) : (
          <div className="grid grid-cols-7 gap-1.5">
            {WEEKDAY_LABELS.map((label, index) => (
              <div
                key={`${label}-${index}`}
                className="text-muted-foreground pb-0.5 text-center text-[11px] font-medium"
              >
                {label}
              </div>
            ))}

            {monthDays.map((cell, index) => {
              if (!cell.day || !cell.date) {
                return <div key={`empty-${index}`} className="min-h-14" />;
              }

              const entry = dayMap.get(cell.date);
              const pnl = entry ? Number(entry.pnl) : null;
              const hasTrades = entry !== undefined;

              return (
                <div
                  key={cell.date}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center rounded-lg px-0.5 py-1.5 text-center",
                    cellTone(pnl),
                  )}
                >
                  <span className="text-sm leading-none font-medium">
                    {cell.day}
                  </span>
                  {hasTrades ? (
                    <span
                      className={cn(
                        "tabular-data mt-1 text-[10px] leading-tight font-semibold",
                        pnlTextClass(entry.pnl),
                      )}
                    >
                      {formatDayPnl(entry.pnl, currency)}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
