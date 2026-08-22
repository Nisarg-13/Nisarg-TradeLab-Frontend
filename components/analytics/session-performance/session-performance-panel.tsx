"use client";

import { MetricsGroupsTable } from "@/components/analytics/metrics-groups-table";
import { TradeCountPhrase } from "@/components/analytics/trade-count-display";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  buildSessionContribution,
  buildSessionInstrumentMatrix,
  orderSessionPerformance,
} from "@/lib/analytics/session-dashboard";
import { formatMoney } from "@/lib/formatting/currency";
import { pnlTextClass } from "@/lib/formatting/pnl-tone";
import { cn } from "@/lib/utils";
import type {
  InsightsHighlights,
  SessionDashboard,
  SessionSymbolRow,
  TradeMetricsGroup,
} from "@/types/analytics";

import {
  SessionBarChart,
  SessionContributionChart,
  SessionKpiCards,
} from "./session-charts";
import {
  SessionInstrumentHeatmap,
  SessionTimeline,
  SessionWeekdayHeatmap,
} from "./session-heatmaps";

function SessionInsightCard({
  title,
  group,
  currency,
}: {
  title: string;
  group: TradeMetricsGroup | null;
  currency: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {group ? (
          <div className="space-y-1">
            <p className="text-lg font-semibold">{group.label}</p>
            <p
              className={cn(
                "tabular-data text-2xl font-semibold",
                pnlTextClass(group.netPnl),
              )}
            >
              {formatMoney(group.netPnl, currency)}
            </p>
            <p className="text-muted-foreground text-sm">
              <TradeCountPhrase
                tradeCount={group.tradeCount}
                winCount={group.winCount}
                lossCount={group.lossCount}
              />
              {group.winRate
                ? ` · ${Number(group.winRate).toFixed(1)}% win rate`
                : ""}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Not enough data yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

export function SessionPerformancePanel({
  dashboard,
  highlights,
  sessionSymbols,
  currency,
}: {
  dashboard: SessionDashboard;
  highlights: InsightsHighlights;
  sessionSymbols: SessionSymbolRow[];
  currency: string;
}) {
  const sessions = orderSessionPerformance(dashboard.sessions);
  const contribution = buildSessionContribution(sessions);
  const instrumentMatrix = buildSessionInstrumentMatrix(sessionSymbols);
  const comparisonRows = sessions.map((session) => ({
    key: session.session,
    label: session.sessionLabel,
    tradeCount: session.tradeCount,
    winCount: session.winCount,
    lossCount: session.lossCount,
    netPnl: session.netPnl,
    totalR: session.totalR,
    winRate: session.winRate,
    averageR: session.averageR,
    moneyExpectancy: session.moneyExpectancy,
    rExpectancy: session.rExpectancy,
    profitFactor: session.profitFactor,
    sampleConfidence: session.sampleConfidence,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Session performance</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Compare trading sessions in your profile timezone using closed-trade
          analytics.
        </p>
      </div>

      <SessionKpiCards sessions={sessions} currency={currency} />

      <div className="grid gap-6 xl:grid-cols-2">
        <SessionBarChart sessions={sessions} currency={currency} />
        <SessionContributionChart rows={contribution} />
      </div>

      <SessionWeekdayHeatmap
        cells={dashboard.weekdayCells}
        currency={currency}
      />

      <SessionInstrumentHeatmap
        symbols={instrumentMatrix.symbols}
        cells={instrumentMatrix.cells}
        currency={currency}
      />

      <SessionTimeline />

      <div className="grid gap-4 md:grid-cols-2">
        <SessionInsightCard
          title="Best session"
          group={highlights.bestSession}
          currency={currency}
        />
        <SessionInsightCard
          title="Weakest session"
          group={highlights.worstSession}
          currency={currency}
        />
      </div>

      <MetricsGroupsTable
        title="Detailed comparison table"
        description="Full closed-trade stats for each trading session."
        rows={comparisonRows}
        currency={currency}
        nameHeader="Session"
        compact
      />
    </div>
  );
}
