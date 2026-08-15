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

export function DashboardSummaryCards({
  summary,
}: {
  summary: AnalyticsSummary;
}) {
  const currency = summary.currency;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        label="Net PnL"
        value={formatMoney(summary.netPnl, currency)}
        hint={`${summary.closedTradeCount} closed trades`}
        valueClassName={pnlTextClass(summary.netPnl)}
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
        label="Expectancy"
        value={
          summary.moneyExpectancy
            ? formatMoney(summary.moneyExpectancy, currency)
            : "—"
        }
      />
      <SummaryCard
        label="Average R"
        value={summary.averageR ? `${summary.averageR}R` : "—"}
      />
      <SummaryCard
        label="Max drawdown"
        value={formatPercent(summary.maxDrawdownPercentage)}
        hint={formatMoney(summary.maxDrawdownAmount, currency)}
      />
      <SummaryCard
        label="Open risk"
        value={formatMoney(summary.currentOpenRisk, currency)}
        hint={`${summary.openTradeCount} open trades`}
      />
    </div>
  );
}
