"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { cn } from "@/lib/utils";
import type { EquityCurvePoint } from "@/types/analytics";

const METRIC_OPTIONS = [
  { value: "balance", label: "Balance" },
  { value: "cumulativePnl", label: "Cumulative PnL" },
  { value: "cumulativeR", label: "Cumulative R" },
];

const TIMEFRAME_OPTIONS = [
  { value: "1W", label: "1W" },
  { value: "1M", label: "1M" },
  { value: "3M", label: "3M" },
  { value: "YTD", label: "YTD" },
  { value: "ALL", label: "ALL" },
] as const;

type MetricKey = "balance" | "cumulativePnl" | "cumulativeR";
type TimeframeKey = (typeof TIMEFRAME_OPTIONS)[number]["value"];

function parseChartDate(value: string | number) {
  if (typeof value === "number") {
    return new Date(value);
  }

  if (value.includes("T")) {
    return new Date(value);
  }

  return new Date(`${value}T12:00:00`);
}

function formatAxisDate(value: string | number) {
  const date = parseChartDate(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatTooltipDate(value: string | number) {
  const date = parseChartDate(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function filterByTimeframe(data: EquityCurvePoint[], timeframe: TimeframeKey) {
  if (timeframe === "ALL" || data.length === 0) {
    return data;
  }

  const sorted = [...data].sort(
    (left, right) =>
      parseChartDate(left.date).getTime() -
      parseChartDate(right.date).getTime(),
  );
  const latest = parseChartDate(sorted[sorted.length - 1]?.date ?? "");

  if (Number.isNaN(latest.getTime())) {
    return data;
  }

  let cutoff = new Date(latest);

  switch (timeframe) {
    case "1W":
      cutoff.setDate(cutoff.getDate() - 7);
      break;
    case "1M":
      cutoff.setDate(cutoff.getDate() - 30);
      break;
    case "3M":
      cutoff.setDate(cutoff.getDate() - 90);
      break;
    case "YTD":
      cutoff = new Date(latest.getFullYear(), 0, 1);
      break;
  }

  const filtered = sorted.filter(
    (point) => parseChartDate(point.date) >= cutoff,
  );

  return filtered.length > 0 ? filtered : sorted.slice(-1);
}

export function EquityCurveChart({ data }: { data: EquityCurvePoint[] }) {
  const [metric, setMetric] = useState<MetricKey>("balance");
  const [timeframe, setTimeframe] = useState<TimeframeKey>("1M");

  const chartData = useMemo(() => {
    const filtered = filterByTimeframe(data, timeframe);
    const rebase = metric !== "balance" && filtered.length > 0;
    const baseline = rebase ? Number(filtered[0]?.[metric]) : 0;

    return filtered.map((point) => ({
      date: point.date,
      value: Number(point[metric]) - baseline,
    }));
  }, [data, metric, timeframe]);

  const metricLabel =
    METRIC_OPTIONS.find((option) => option.value === metric)?.label ?? "Value";

  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Equity curve</CardTitle>
            <CardDescription>
              Performance over closed trades for the selected period.
            </CardDescription>
          </div>
          <div className="bg-muted/40 flex items-center gap-0.5 rounded-lg p-0.5">
            {TIMEFRAME_OPTIONS.map((option) => (
              <Button
                key={option.value}
                type="button"
                size="sm"
                variant="ghost"
                className={cn(
                  "h-7 min-w-9 px-2 text-xs",
                  timeframe === option.value &&
                    "bg-background text-foreground shadow-sm",
                )}
                onClick={() => setTimeframe(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <DropdownSelect
          id="equity-metric"
          name="equity-metric"
          options={METRIC_OPTIONS}
          value={metric}
          onValueChange={(value) => setMetric(value as MetricKey)}
        />
      </CardHeader>

      <CardContent className="h-80">
        {chartData.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Close a few trades to see your equity curve.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--profit)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--profit)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => formatAxisDate(String(value))}
                minTickGap={24}
              />
              <YAxis tickFormatter={(value: number) => value.toFixed(0)} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  color: "var(--popover-foreground)",
                }}
                labelStyle={{
                  color: "var(--popover-foreground)",
                  fontWeight: 600,
                  marginBottom: 4,
                }}
                itemStyle={{
                  color: "var(--popover-foreground)",
                }}
                labelFormatter={(value) => formatTooltipDate(String(value))}
                formatter={(value) => [
                  typeof value === "number"
                    ? value.toFixed(2)
                    : String(value ?? "0"),
                  metricLabel,
                ]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--profit)"
                strokeWidth={2}
                fill="url(#equityFill)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
