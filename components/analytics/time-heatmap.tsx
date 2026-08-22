"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { formatTradesPhrase } from "@/lib/formatting/trade-count";
import { formatHour24 } from "@/lib/formatting/time-windows";
import { pnlSurfaceClass } from "@/lib/formatting/pnl-tone";
import { cn } from "@/lib/utils";
import type { HeatmapCell, HeatmapMetric } from "@/types/analytics";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const METRIC_OPTIONS = [
  { value: "pnl", label: "PnL" },
  { value: "averageR", label: "Average R" },
  { value: "expectancy", label: "Expectancy" },
  { value: "winRate", label: "Win rate" },
  { value: "tradeCount", label: "Trade count" },
];

function cellTone(cell: HeatmapCell, metric: HeatmapMetric) {
  if (cell.tradeCount === 0) {
    return "bg-card border-border text-muted-foreground";
  }

  if (metric === "tradeCount") {
    return "border-profit/30 bg-profit-soft/50 text-profit";
  }

  const value = Number(cell.value);

  if (metric === "winRate") {
    if (value >= 50) {
      return pnlSurfaceClass(1);
    }

    if (value > 0) {
      return pnlSurfaceClass(-1);
    }

    return "border-border bg-muted/40 text-muted-foreground";
  }

  return pnlSurfaceClass(value);
}

export function TimeHeatmap({
  cells,
  metric,
  timezoneLabel,
  onMetricChange,
}: {
  cells: HeatmapCell[];
  metric: HeatmapMetric;
  timezoneLabel?: string;
  onMetricChange: (metric: HeatmapMetric) => void;
}) {
  const maxTradeCount = Math.max(...cells.map((cell) => cell.tradeCount), 1);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Time heatmap</CardTitle>
          <CardDescription>
            Day of week by hour
            {timezoneLabel ? ` in ${timezoneLabel}` : ""}. Tooltip sample size
            comes from trade count per cell.
          </CardDescription>
        </div>
        <DropdownSelect
          id="heatmap-metric"
          name="heatmap-metric"
          options={METRIC_OPTIONS}
          value={metric}
          onValueChange={(value) => onMetricChange(value as HeatmapMetric)}
        />
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="min-w-[920px]">
          <div className="mb-2 grid grid-cols-[3rem_repeat(24,minmax(0,1fr))] gap-1 text-center text-xs">
            <div />
            {Array.from({ length: 24 }, (_, hour) => (
              <div key={hour} className="text-muted-foreground tabular-data">
                {formatHour24(hour).slice(0, 2)}
              </div>
            ))}
          </div>
          {DAY_LABELS.map((dayLabel, dayIndex) => (
            <div
              key={dayLabel}
              className="mb-1 grid grid-cols-[3rem_repeat(24,minmax(0,1fr))] gap-1"
            >
              <div className="text-muted-foreground flex items-center text-xs font-medium">
                {dayLabel}
              </div>
              {Array.from({ length: 24 }, (_, hour) => {
                const cell =
                  cells.find(
                    (entry) =>
                      entry.dayOfWeek === dayIndex && entry.hour === hour,
                  ) ?? null;

                if (!cell) {
                  return (
                    <div
                      key={`${dayLabel}-${hour}`}
                      className="bg-card border-border h-8 rounded border"
                    />
                  );
                }

                const opacity =
                  cell.tradeCount === 0
                    ? 1
                    : 0.35 + (cell.tradeCount / maxTradeCount) * 0.65;

                return (
                  <div
                    key={`${dayLabel}-${hour}`}
                    title={`${dayLabel} ${formatHour24(hour)} · ${formatTradesPhrase({ tradeCount: cell.tradeCount, winCount: cell.winCount, lossCount: cell.lossCount })} · PnL ${cell.netPnl}`}
                    className={cn(
                      "flex h-8 items-center justify-center rounded border text-[10px]",
                      cellTone(cell, metric),
                    )}
                    style={{ opacity: cell.tradeCount === 0 ? 1 : opacity }}
                  >
                    {cell.tradeCount > 0 ? cell.tradeCount : ""}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
