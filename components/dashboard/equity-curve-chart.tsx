"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import type { EquityCurvePoint } from "@/types/analytics";

const METRIC_OPTIONS = [
  { value: "balance", label: "Balance" },
  { value: "cumulativePnl", label: "Cumulative PnL" },
  { value: "cumulativeR", label: "Cumulative R" },
];

function formatAxisDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function EquityCurveChart({ data }: { data: EquityCurvePoint[] }) {
  const [metric, setMetric] = useState<
    "balance" | "cumulativePnl" | "cumulativeR"
  >("balance");

  const chartData = useMemo(
    () =>
      data.map((point) => ({
        date: point.date,
        value: Number(point[metric]),
      })),
    [data, metric],
  );

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Equity curve</CardTitle>
          <CardDescription>
            Backend-calculated performance over closed trades.
          </CardDescription>
        </div>
        <DropdownSelect
          id="equity-metric"
          name="equity-metric"
          options={METRIC_OPTIONS}
          value={metric}
          onValueChange={(value) =>
            setMetric(value as "balance" | "cumulativePnl" | "cumulativeR")
          }
        />
      </CardHeader>
      <CardContent className="h-80">
        {chartData.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Close a few trades to see your equity curve.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                tickFormatter={formatAxisDate}
                minTickGap={24}
              />
              <YAxis tickFormatter={(value: number) => value.toFixed(0)} />
              <Tooltip
                labelFormatter={(value) => formatAxisDate(String(value))}
                formatter={(value) => [
                  typeof value === "number"
                    ? value.toFixed(2)
                    : String(value ?? "0"),
                  "Value",
                ]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
