import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardSummaryCards } from "@/components/dashboard/dashboard-summary-cards";
import { formatMoney } from "@/lib/formatting/currency";
import { formatHoldingTime } from "@/lib/formatting/holding-time";
import { pnlTextClass } from "@/lib/formatting/pnl-tone";
import { cn } from "@/lib/utils";
import type { AnalyticsSummary } from "@/types/analytics";

function MetricCard({
  label,
  value,
  hint,
  valueClassName,
}: {
  label: string;
  value: string;
  hint?: string;
  valueClassName?: string;
}) {
  return (
    <Card className="hover:bg-card-hover transition-colors">
      <CardHeader className="pb-2">
        <CardDescription className="text-xs tracking-wide uppercase">
          {label}
        </CardDescription>
        <CardTitle
          className={cn("tabular-data text-2xl font-semibold", valueClassName)}
        >
          {value}
        </CardTitle>
      </CardHeader>
      {hint ? (
        <CardContent>
          <p className="text-muted-foreground text-xs">{hint}</p>
        </CardContent>
      ) : null}
    </Card>
  );
}

function formatPercent(value: string | null) {
  return value ? `${Number(value).toFixed(2)}%` : "—";
}

function formatRatio(value: string | null) {
  return value ? Number(value).toFixed(2) : "—";
}

export function AnalyticsOverviewCards({
  summary,
}: {
  summary: AnalyticsSummary;
}) {
  const currency = summary.currency;

  return (
    <div className="space-y-4">
      <DashboardSummaryCards summary={summary} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Loss rate"
          value={formatPercent(summary.lossRate)}
          hint={`Breakeven ${formatPercent(summary.breakevenRate)}`}
        />
        <MetricCard
          label="Avg win / avg loss"
          value={formatRatio(summary.averageWinLossRatio)}
          hint={`Win ${formatMoney(summary.averageWinner ?? "—", currency)} · Loss ${formatMoney(summary.averageLoser ?? "—", currency)}`}
        />
        <MetricCard
          label="Avg hold time"
          value={formatHoldingTime(summary.averageHoldingTimeMinutes)}
          hint={`Median ${formatHoldingTime(summary.medianHoldingTimeMinutes)}`}
        />
        <MetricCard
          label="Trading costs"
          value={formatMoney(summary.totalTradingCosts, currency)}
          hint={`Comm ${formatMoney(summary.totalCommission, currency)} · Swap ${formatMoney(summary.totalSwap, currency)} · Fees ${formatMoney(summary.totalFees, currency)}`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Largest winner"
          value={formatMoney(summary.largestWinner ?? "—", currency)}
          valueClassName={pnlTextClass(summary.largestWinner)}
        />
        <MetricCard
          label="Largest loser"
          value={formatMoney(summary.largestLoser ?? "—", currency)}
          valueClassName={pnlTextClass(summary.largestLoser)}
        />
        <MetricCard
          label="Best win streak"
          value={String(summary.longestWinningStreak)}
          hint={
            summary.currentWinningStreak > 0
              ? `Current ${summary.currentWinningStreak} wins`
              : undefined
          }
        />
        <MetricCard
          label="Worst loss streak"
          value={String(summary.longestLosingStreak)}
          hint={
            summary.currentLosingStreak > 0
              ? `Current ${summary.currentLosingStreak} losses`
              : undefined
          }
        />
      </div>
    </div>
  );
}
