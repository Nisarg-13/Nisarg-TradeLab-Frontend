"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TRADING_SESSION_BANDS,
  TRADING_SESSION_ORDER,
  WEEKDAY_LABELS,
} from "@/lib/constants/trading-sessions";
import { getSessionWeekdayCell } from "@/lib/analytics/session-dashboard";
import { formatMoney } from "@/lib/formatting/currency";
import { formatTradesPhrase } from "@/lib/formatting/trade-count";
import { pnlSurfaceClass } from "@/lib/formatting/pnl-tone";
import { cn } from "@/lib/utils";
import type { SessionWeekdayCell } from "@/types/analytics";

function matrixCellTone(netPnl: number, tradeCount: number) {
  if (tradeCount === 0) {
    return "bg-card border-border text-muted-foreground";
  }

  return pnlSurfaceClass(netPnl);
}

export function SessionWeekdayHeatmap({
  cells,
  currency,
}: {
  cells: SessionWeekdayCell[];
  currency: string;
}) {
  const maxTradeCount = Math.max(...cells.map((cell) => cell.tradeCount), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session × weekday heatmap</CardTitle>
        <CardDescription>
          Net PnL by trading session and weekday of entry in your profile
          timezone.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="mb-2 grid grid-cols-[8rem_repeat(7,minmax(0,1fr))] gap-1 text-center text-xs">
            <div />
            {WEEKDAY_LABELS.map((label) => (
              <div key={label} className="text-muted-foreground font-medium">
                {label}
              </div>
            ))}
          </div>
          {TRADING_SESSION_ORDER.map((sessionId) => {
            const sessionLabel =
              cells.find((cell) => cell.session === sessionId)?.sessionLabel ??
              sessionId;

            return (
              <div
                key={sessionId}
                className="mb-1 grid grid-cols-[8rem_repeat(7,minmax(0,1fr))] gap-1"
              >
                <div className="text-muted-foreground flex items-center text-xs font-medium">
                  {sessionLabel}
                </div>
                {WEEKDAY_LABELS.map((_, dayIndex) => {
                  const cell = getSessionWeekdayCell(
                    cells,
                    sessionId,
                    dayIndex,
                  );
                  const tradeCount = cell?.tradeCount ?? 0;
                  const netPnl = cell ? Number(cell.netPnl) : 0;
                  const opacity =
                    tradeCount === 0
                      ? 1
                      : 0.35 + (tradeCount / maxTradeCount) * 0.65;

                  return (
                    <div
                      key={`${sessionId}-${dayIndex}`}
                      title={
                        cell
                          ? `${sessionLabel} · ${cell.dayLabel} · ${formatTradesPhrase({ tradeCount: cell.tradeCount, winCount: cell.winCount, lossCount: cell.lossCount })} · ${formatMoney(cell.netPnl, currency)}`
                          : `${sessionLabel} · ${WEEKDAY_LABELS[dayIndex]}`
                      }
                      className={cn(
                        "flex h-10 items-center justify-center rounded border text-[10px]",
                        matrixCellTone(netPnl, tradeCount),
                      )}
                      style={{ opacity }}
                    >
                      {tradeCount > 0 ? cell?.tradeCount : ""}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function SessionInstrumentHeatmap({
  symbols,
  cells,
  currency,
}: {
  symbols: string[];
  cells: Array<{
    session: string;
    sessionLabel: string;
    symbol: string;
    tradeCount: number;
    winCount: number;
    lossCount: number;
    netPnl: number;
  }>;
  currency: string;
}) {
  const maxTradeCount = Math.max(...cells.map((cell) => cell.tradeCount), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session × instrument heatmap</CardTitle>
        <CardDescription>
          Net PnL by session and your most traded instruments.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {symbols.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No instrument data yet.
          </p>
        ) : (
          <div className="min-w-[720px]">
            <div
              className="mb-2 grid gap-1 text-center text-xs"
              style={{
                gridTemplateColumns: `8rem repeat(${symbols.length}, minmax(0, 1fr))`,
              }}
            >
              <div />
              {symbols.map((symbol) => (
                <div key={symbol} className="text-muted-foreground font-medium">
                  {symbol}
                </div>
              ))}
            </div>
            {TRADING_SESSION_ORDER.map((sessionId) => {
              const sessionLabel =
                cells.find((cell) => cell.session === sessionId)
                  ?.sessionLabel ?? sessionId;

              return (
                <div
                  key={sessionId}
                  className="mb-1 grid gap-1"
                  style={{
                    gridTemplateColumns: `8rem repeat(${symbols.length}, minmax(0, 1fr))`,
                  }}
                >
                  <div className="text-muted-foreground flex items-center text-xs font-medium">
                    {sessionLabel}
                  </div>
                  {symbols.map((symbol) => {
                    const cell = cells.find(
                      (entry) =>
                        entry.session === sessionId && entry.symbol === symbol,
                    );
                    const tradeCount = cell?.tradeCount ?? 0;
                    const netPnl = cell?.netPnl ?? 0;
                    const opacity =
                      tradeCount === 0
                        ? 1
                        : 0.35 + (tradeCount / maxTradeCount) * 0.65;

                    return (
                      <div
                        key={`${sessionId}-${symbol}`}
                        title={
                          cell
                            ? `${sessionLabel} · ${symbol} · ${formatTradesPhrase({ tradeCount: cell.tradeCount, winCount: cell.winCount, lossCount: cell.lossCount })} · ${formatMoney(String(cell.netPnl), currency)}`
                            : `${sessionLabel} · ${symbol}`
                        }
                        className={cn(
                          "flex h-10 items-center justify-center rounded border text-[10px]",
                          matrixCellTone(netPnl, tradeCount),
                        )}
                        style={{ opacity }}
                      >
                        {tradeCount > 0 ? tradeCount : ""}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SessionTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Session timing / overlap timeline</CardTitle>
        <CardDescription>
          Trading session bands in your profile timezone, including the London /
          New York overlap window.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-1">
          {Array.from({ length: 24 }, (_, hour) => (
            <div
              key={hour}
              className="text-muted-foreground text-center text-[10px] tabular-nums"
            >
              {hour % 6 === 0 ? hour : ""}
            </div>
          ))}
        </div>
        <div className="relative h-14 overflow-hidden rounded-xl border">
          <div className="absolute inset-0 grid grid-cols-[repeat(24,minmax(0,1fr))]">
            {Array.from({ length: 24 }, (_, hour) => (
              <div
                key={hour}
                className="border-border/40 border-r last:border-r-0"
              />
            ))}
          </div>
          {TRADING_SESSION_BANDS.map((band) => {
            const span = band.endHour - band.startHour + 1;
            const start = band.startHour + 1;

            return (
              <div
                key={band.id}
                className={cn(
                  "absolute top-2 bottom-2 flex items-center justify-center rounded-md border px-2 text-center text-[11px] font-medium",
                  band.tone,
                )}
                style={{
                  gridColumn: `${start} / span ${span}`,
                  left: `${(band.startHour / 24) * 100}%`,
                  width: `${(span / 24) * 100}%`,
                }}
              >
                <span className="truncate">{band.shortLabel}</span>
              </div>
            );
          })}
        </div>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {TRADING_SESSION_BANDS.map((band) => (
            <div
              key={band.id}
              className="bg-muted/20 flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
            >
              <span>{band.label}</span>
              <span className="text-muted-foreground tabular-data text-xs">
                {band.startHour}:00–{band.endHour}:59
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
