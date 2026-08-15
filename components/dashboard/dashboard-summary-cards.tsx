import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatMoney } from "@/lib/formatting/currency";
import { pnlTextClass } from "@/lib/formatting/pnl-tone";
import { cn } from "@/lib/utils";
import type { AnalyticsSummary } from "@/types/analytics";

function SummaryCard({
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

function isFiniteMoney(value: string | null | undefined) {
  return (
    value !== null && value !== undefined && Number.isFinite(Number(value))
  );
}

function resolveAccountBalances(summary: AnalyticsSummary) {
  const netPnl = Number(summary.netPnl);
  const lastCurveBalance = summary.equityCurve.at(-1)?.balance;

  let startingBalance = isFiniteMoney(summary.startingBalance)
    ? summary.startingBalance
    : null;
  let currentBalance = isFiniteMoney(summary.currentBalance)
    ? summary.currentBalance
    : null;

  if (!currentBalance && isFiniteMoney(lastCurveBalance)) {
    currentBalance = lastCurveBalance!;
  }

  if (
    !startingBalance &&
    isFiniteMoney(currentBalance) &&
    Number.isFinite(netPnl)
  ) {
    startingBalance = (Number(currentBalance) - netPnl).toFixed(2);
  }

  if (
    !currentBalance &&
    isFiniteMoney(startingBalance) &&
    Number.isFinite(netPnl)
  ) {
    currentBalance = (Number(startingBalance) + netPnl).toFixed(2);
  }

  if (!startingBalance && isFiniteMoney(summary.equityCurve[0]?.balance)) {
    startingBalance = summary.equityCurve[0]!.balance;
  }

  return {
    startingBalance: startingBalance ?? "0.00",
    currentBalance: currentBalance ?? "0.00",
  };
}

export function DashboardSummaryCards({
  summary,
}: {
  summary: AnalyticsSummary;
}) {
  const currency = summary.currency;
  const { startingBalance, currentBalance } = resolveAccountBalances(summary);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <SummaryCard
        label="Net PnL"
        value={formatMoney(summary.netPnl, currency)}
        hint={`${summary.closedTradeCount} closed trades`}
        valueClassName={pnlTextClass(summary.netPnl)}
      />
      <SummaryCard
        label="Current balance"
        value={formatMoney(currentBalance, currency)}
        hint={`Started at ${formatMoney(startingBalance, currency)}`}
      />
      <SummaryCard
        label="Return %"
        value={formatPercent(summary.returnPercentage)}
      />
      <SummaryCard
        label="Win rate"
        value={formatPercent(summary.winRate)}
        hint={`Sample: ${summary.sampleConfidence.replaceAll("_", " ")}`}
      />
      <SummaryCard label="Profit factor" value={summary.profitFactor ?? "—"} />
      <SummaryCard
        label="Max drawdown"
        value={formatPercent(summary.maxDrawdownPercentage)}
        hint={formatMoney(summary.maxDrawdownAmount, currency)}
      />
    </div>
  );
}
