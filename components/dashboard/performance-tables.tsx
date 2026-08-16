"use client";

import { useMemo, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { formatMoney } from "@/lib/formatting/currency";
import { pnlTextClass } from "@/lib/formatting/pnl-tone";
import { cn } from "@/lib/utils";
import type {
  GroupedPerformanceMetrics,
  InstrumentPerformance,
  PerformanceSortKey,
  StrategyPerformance,
} from "@/types/analytics";

const SORT_OPTIONS: Array<{ value: PerformanceSortKey; label: string }> = [
  { value: "netPnl", label: "Net PnL" },
  { value: "totalR", label: "Total R" },
  { value: "averageR", label: "Average R" },
  { value: "rExpectancy", label: "R expectancy" },
  { value: "profitFactor", label: "Profit factor" },
  { value: "winRate", label: "Win rate" },
  { value: "tradeCount", label: "Trade count" },
];

function sortValue(row: GroupedPerformanceMetrics, key: PerformanceSortKey) {
  switch (key) {
    case "tradeCount":
      return row.tradeCount;
    case "totalR":
      return row.totalR ? Number(row.totalR) : Number.NEGATIVE_INFINITY;
    case "averageR":
      return row.averageR ? Number(row.averageR) : Number.NEGATIVE_INFINITY;
    case "rExpectancy":
      return row.rExpectancy
        ? Number(row.rExpectancy)
        : Number.NEGATIVE_INFINITY;
    case "profitFactor":
      return row.profitFactor
        ? Number(row.profitFactor)
        : Number.NEGATIVE_INFINITY;
    case "winRate":
      return row.winRate ? Number(row.winRate) : Number.NEGATIVE_INFINITY;
    case "netPnl":
    default:
      return Number(row.netPnl);
  }
}

function EnrichedPerformanceTable({
  title,
  description,
  nameHeader,
  rows,
  currency,
  getName,
}: {
  title: string;
  description: string;
  nameHeader: string;
  rows: GroupedPerformanceMetrics[];
  currency: string;
  getName: (row: GroupedPerformanceMetrics, index: number) => string;
}) {
  const [sortKey, setSortKey] = useState<PerformanceSortKey>("netPnl");

  const sortedRows = useMemo(
    () =>
      [...rows].sort(
        (left, right) => sortValue(right, sortKey) - sortValue(left, sortKey),
      ),
    [rows, sortKey],
  );

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <DropdownSelect
          id={`${title}-sort`}
          name={`${title}-sort`}
          options={SORT_OPTIONS.map((option) => ({
            value: option.value,
            label: `Sort: ${option.label}`,
          }))}
          value={sortKey}
          onValueChange={(value) => setSortKey(value as PerformanceSortKey)}
        />
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {sortedRows.length === 0 ? (
          <p className="text-muted-foreground text-sm">No data yet.</p>
        ) : (
          <table className="w-full min-w-[960px] text-sm">
            <thead>
              <tr className="text-muted-foreground border-b text-left">
                <th className="pb-2 font-medium">{nameHeader}</th>
                <th className="pb-2 font-medium">Trades</th>
                <th className="pb-2 font-medium">Net PnL</th>
                <th className="pb-2 font-medium">Total R</th>
                <th className="pb-2 font-medium">Avg R</th>
                <th className="pb-2 font-medium">Win rate</th>
                <th className="pb-2 font-medium">PF</th>
                <th className="pb-2 font-medium">Long / Short</th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row, index) => (
                <tr
                  key={`${getName(row, index)}-${index}`}
                  className="border-b last:border-0"
                >
                  <td className="py-3 font-medium">{getName(row, index)}</td>
                  <td className="tabular-data py-3">{row.tradeCount}</td>
                  <td
                    className={cn(
                      "tabular-data py-3",
                      pnlTextClass(row.netPnl),
                    )}
                  >
                    {formatMoney(row.netPnl, currency)}
                  </td>
                  <td className="tabular-data py-3">
                    {row.totalR ? `${row.totalR}R` : "—"}
                  </td>
                  <td className="tabular-data py-3">
                    {row.averageR ? `${row.averageR}R` : "—"}
                  </td>
                  <td className="tabular-data py-3">
                    {row.winRate ? `${Number(row.winRate).toFixed(1)}%` : "—"}
                  </td>
                  <td className="tabular-data py-3">
                    {row.profitFactor ?? "—"}
                  </td>
                  <td className="text-muted-foreground py-3 text-xs">
                    {row.longTradeCount}L / {row.shortTradeCount}S ·{" "}
                    <span className={pnlTextClass(row.longNetPnl)}>
                      {formatMoney(row.longNetPnl, currency)}
                    </span>
                    {" / "}
                    <span className={pnlTextClass(row.shortNetPnl)}>
                      {formatMoney(row.shortNetPnl, currency)}
                    </span>
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

export function InstrumentPerformanceTable({
  rows,
  currency,
}: {
  rows: InstrumentPerformance[];
  currency: string;
}) {
  return (
    <EnrichedPerformanceTable
      title="Instrument performance"
      description="Closed-trade stats grouped by symbol, with long/short split."
      nameHeader="Instrument"
      currency={currency}
      rows={rows}
      getName={(row) => (row as InstrumentPerformance).symbol}
    />
  );
}

export function StrategyPerformanceTable({
  rows,
  currency,
}: {
  rows: StrategyPerformance[];
  currency: string;
}) {
  return (
    <EnrichedPerformanceTable
      title="Strategy performance"
      description="Closed-trade stats grouped by strategy, with long/short split."
      nameHeader="Strategy"
      currency={currency}
      rows={rows}
      getName={(row) => (row as StrategyPerformance).strategyName}
    />
  );
}
