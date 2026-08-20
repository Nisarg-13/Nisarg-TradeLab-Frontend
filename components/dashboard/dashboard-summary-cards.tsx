import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatWinRateSampleHint } from "@/lib/analytics/sample-confidence";
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
  const realizedNetPnl = Number(summary.netPnl);
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
    Number.isFinite(realizedNetPnl)
  ) {
    startingBalance = (Number(currentBalance) - realizedNetPnl).toFixed(2);
  }

  if (
    !currentBalance &&
    isFiniteMoney(startingBalance) &&
    Number.isFinite(realizedNetPnl)
  ) {
    currentBalance = (Number(startingBalance) + realizedNetPnl).toFixed(2);
  }

  if (!startingBalance && isFiniteMoney(summary.equityCurve[0]?.balance)) {
    startingBalance = summary.equityCurve[0]!.balance;
  }

  const starting = startingBalance ?? "0.00";
  const current = currentBalance ?? "0.00";
  const hasSyncedBalance = Number(starting) > 0 && Number(current) > 0;
  const hasOpenTrades = summary.openTradeCount > 0;
  const accountPnl = hasSyncedBalance
    ? Number(current) - Number(starting)
    : realizedNetPnl;
  const unrealizedPnl =
    hasSyncedBalance && hasOpenTrades
      ? accountPnl - realizedNetPnl
      : Number(summary.unrealizedPnl ?? 0);

  return {
    startingBalance: starting,
    currentBalance: current,
    hasSyncedBalance,
    hasOpenTrades,
    accountPnl: hasSyncedBalance
      ? accountPnl.toFixed(2)
      : (summary.accountPnl ?? summary.netPnl),
    unrealizedPnl: hasSyncedBalance
      ? unrealizedPnl.toFixed(2)
      : (summary.unrealizedPnl ?? "0.00"),
  };
}

function buildNetPnlHint(
  summary: AnalyticsSummary,
  currency: string,
  hasSyncedBalance: boolean,
  hasOpenTrades: boolean,
  unrealizedPnl: string,
) {
  const parts = [
    `${summary.closedTradeCount} closed trades`,
    `${summary.winCount}W / ${summary.lossCount}L`,
    summary.breakevenCount > 0 ? `${summary.breakevenCount}BE` : null,
  ];

  if (
    hasSyncedBalance &&
    hasOpenTrades &&
    Math.abs(Number(unrealizedPnl)) >= 0.01
  ) {
    parts.push(
      `${formatMoney(summary.netPnl, currency)} realized`,
      `${formatMoney(unrealizedPnl, currency)} open`,
    );
  }

  return parts.filter(Boolean).join(" · ");
}

function resolveCurrentStreak(summary: AnalyticsSummary) {
  if (summary.currentWinningStreak > 0) {
    const count = summary.currentWinningStreak;
    const atPersonalBest = count >= summary.longestWinningStreak;
    return {
      label: "Current streak",
      value: `${count} ${count === 1 ? "win" : "wins"}`,
      hint: atPersonalBest
        ? "Personal best streak"
        : `Best streak ${summary.longestWinningStreak} wins`,
      valueClassName: "text-profit",
    };
  }

  if (summary.currentLosingStreak > 0) {
    const count = summary.currentLosingStreak;
    return {
      label: "Current streak",
      value: `${count} ${count === 1 ? "loss" : "losses"}`,
      hint: `Best streak ${summary.longestWinningStreak} wins`,
      valueClassName: "text-loss",
    };
  }

  return {
    label: "Current streak",
    value: "—",
    hint:
      summary.closedTradeCount > 0
        ? "No active streak"
        : "Closes a trade to start tracking",
    valueClassName: "text-muted-foreground",
  };
}

export function DashboardSummaryCards({
  summary,
}: {
  summary: AnalyticsSummary;
}) {
  const currency = summary.currency;
  const {
    startingBalance,
    currentBalance,
    hasSyncedBalance,
    hasOpenTrades,
    accountPnl,
    unrealizedPnl,
  } = resolveAccountBalances(summary);
  const streak = resolveCurrentStreak(summary);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <SummaryCard
        label="Net PnL"
        value={formatMoney(accountPnl, currency)}
        hint={buildNetPnlHint(
          summary,
          currency,
          hasSyncedBalance,
          hasOpenTrades,
          unrealizedPnl,
        )}
        valueClassName={pnlTextClass(accountPnl)}
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
        hint={formatWinRateSampleHint(
          summary.closedTradeCount,
          summary.sampleConfidence,
        )}
      />
      <SummaryCard label="Profit factor" value={summary.profitFactor ?? "—"} />
      <SummaryCard
        label={streak.label}
        value={streak.value}
        hint={streak.hint}
        valueClassName={streak.valueClassName}
      />
    </div>
  );
}
