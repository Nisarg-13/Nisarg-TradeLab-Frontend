"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatMoney } from "@/lib/formatting/currency";
import { pnlTextClass } from "@/lib/formatting/pnl-tone";
import { cn } from "@/lib/utils";
import type { PeriodComparison, PeriodComparisonMode } from "@/types/analytics";

const MODE_OPTIONS = [
  { value: "LATEST_20_VS_PREVIOUS_20", label: "Latest 20 vs previous 20" },
  { value: "FIRST_50_VS_LATEST_50", label: "First 50 vs latest 50" },
  { value: "THIS_MONTH_VS_LAST_MONTH", label: "This month vs last month" },
  { value: "CUSTOM", label: "Custom periods" },
];

function MetricRow({
  label,
  periodA,
  periodB,
  delta,
  suffix = "",
}: {
  label: string;
  periodA: string;
  periodB: string;
  delta: string | null;
  suffix?: string;
}) {
  const deltaNumber = delta ? Number(delta) : null;

  return (
    <tr className="border-b last:border-0">
      <td className="py-3 font-medium">{label}</td>
      <td className="tabular-data py-3">
        {periodA}
        {suffix}
      </td>
      <td className="tabular-data py-3">
        {periodB}
        {suffix}
      </td>
      <td
        className={cn(
          "tabular-data py-3",
          deltaNumber === null
            ? "text-muted-foreground"
            : pnlTextClass(deltaNumber),
        )}
      >
        {delta === null ? "—" : `${delta}${suffix}`}
      </td>
    </tr>
  );
}

export function PeriodComparisonPanel({
  comparison,
  mode,
  customDates,
  isLoading,
  onModeChange,
  onCustomDatesChange,
  onApply,
}: {
  comparison: PeriodComparison | null;
  mode: PeriodComparisonMode;
  customDates: {
    periodAFrom: string;
    periodATo: string;
    periodBFrom: string;
    periodBTo: string;
  };
  isLoading: boolean;
  onModeChange: (mode: PeriodComparisonMode) => void;
  onCustomDatesChange: (field: keyof typeof customDates, value: string) => void;
  onApply: () => void;
}) {
  const currency = "USD";

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div>
          <CardTitle>Period comparison</CardTitle>
          <CardDescription>
            Compare win rate, expectancy, drawdown, mistake rate, and plan
            compliance across two windows.
          </CardDescription>
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="space-y-2">
            <Label htmlFor="comparison-mode">Comparison mode</Label>
            <DropdownSelect
              id="comparison-mode"
              name="comparison-mode"
              options={MODE_OPTIONS}
              value={mode}
              onValueChange={(value) =>
                onModeChange(value as PeriodComparisonMode)
              }
            />
          </div>
          <Button type="button" disabled={isLoading} onClick={onApply}>
            {isLoading ? "Loading..." : "Compare"}
          </Button>
        </div>
        {mode === "CUSTOM" ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {(
              [
                ["periodAFrom", "Period A from"],
                ["periodATo", "Period A to"],
                ["periodBFrom", "Period B from"],
                ["periodBTo", "Period B to"],
              ] as const
            ).map(([field, label]) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field}>{label}</Label>
                <Input
                  id={field}
                  type="date"
                  value={customDates[field]}
                  onChange={(event) =>
                    onCustomDatesChange(field, event.target.value)
                  }
                />
              </div>
            ))}
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {!comparison ? (
          <p className="text-muted-foreground text-sm">
            Choose a comparison mode and apply filters to load period deltas.
          </p>
        ) : (
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="text-muted-foreground border-b text-left">
                <th className="pb-2 font-medium">Metric</th>
                <th className="pb-2 font-medium">{comparison.periodA.label}</th>
                <th className="pb-2 font-medium">{comparison.periodB.label}</th>
                <th className="pb-2 font-medium">Delta</th>
              </tr>
            </thead>
            <tbody>
              <MetricRow
                label="Net PnL"
                periodA={formatMoney(comparison.periodA.netPnl, currency)}
                periodB={formatMoney(comparison.periodB.netPnl, currency)}
                delta={comparison.deltas.netPnl}
              />
              <MetricRow
                label="Total R"
                periodA={comparison.periodA.totalR ?? "—"}
                periodB={comparison.periodB.totalR ?? "—"}
                delta={comparison.deltas.totalR}
                suffix="R"
              />
              <MetricRow
                label="Win rate"
                periodA={comparison.periodA.winRate ?? "—"}
                periodB={comparison.periodB.winRate ?? "—"}
                delta={comparison.deltas.winRate}
                suffix="%"
              />
              <MetricRow
                label="Average R"
                periodA={comparison.periodA.averageR ?? "—"}
                periodB={comparison.periodB.averageR ?? "—"}
                delta={comparison.deltas.averageR}
                suffix="R"
              />
              <MetricRow
                label="Expectancy"
                periodA={
                  comparison.periodA.moneyExpectancy
                    ? formatMoney(comparison.periodA.moneyExpectancy, currency)
                    : "—"
                }
                periodB={
                  comparison.periodB.moneyExpectancy
                    ? formatMoney(comparison.periodB.moneyExpectancy, currency)
                    : "—"
                }
                delta={comparison.deltas.moneyExpectancy}
              />
              <MetricRow
                label="Profit factor"
                periodA={comparison.periodA.profitFactor ?? "—"}
                periodB={comparison.periodB.profitFactor ?? "—"}
                delta={comparison.deltas.profitFactor}
              />
              <MetricRow
                label="Mistake rate"
                periodA={comparison.periodA.mistakeRate ?? "—"}
                periodB={comparison.periodB.mistakeRate ?? "—"}
                delta={comparison.deltas.mistakeRate}
                suffix="%"
              />
              <MetricRow
                label="Plan compliance"
                periodA={comparison.periodA.planComplianceRate ?? "—"}
                periodB={comparison.periodB.planComplianceRate ?? "—"}
                delta={comparison.deltas.planComplianceRate}
                suffix="%"
              />
              <MetricRow
                label="Avg risk %"
                periodA={comparison.periodA.averageRiskPercentage ?? "—"}
                periodB={comparison.periodB.averageRiskPercentage ?? "—"}
                delta={comparison.deltas.averageRiskPercentage}
                suffix="%"
              />
              <MetricRow
                label="Avg hold time"
                periodA={comparison.periodA.averageHoldingTimeMinutes ?? "—"}
                periodB={comparison.periodB.averageHoldingTimeMinutes ?? "—"}
                delta={comparison.deltas.averageHoldingTimeMinutes}
                suffix=" min"
              />
              <MetricRow
                label="Trading costs"
                periodA={formatMoney(
                  comparison.periodA.totalTradingCosts,
                  currency,
                )}
                periodB={formatMoney(
                  comparison.periodB.totalTradingCosts,
                  currency,
                )}
                delta={comparison.deltas.totalTradingCosts}
              />
              <MetricRow
                label="Max drawdown"
                periodA={`${comparison.periodA.maxDrawdownPercentage}%`}
                periodB={`${comparison.periodB.maxDrawdownPercentage}%`}
                delta={comparison.deltas.maxDrawdownPercentage}
                suffix="%"
              />
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
