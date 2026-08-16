"use client";

import { MetricsGroupsTable } from "@/components/analytics/metrics-groups-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { BehaviorAnalytics } from "@/types/analytics";

export function BehaviorAnalyticsPanel({
  data,
  currency,
}: {
  data: BehaviorAnalytics;
  currency: string;
}) {
  const { afterLossesComparison, earlyWinnerExit } = data;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>After consecutive losses</CardTitle>
            <CardDescription>
              Trades taken immediately after{" "}
              {afterLossesComparison.lossStreakThreshold}+ losses vs your full
              baseline.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-xs uppercase">
                After loss streak
              </p>
              <p className="tabular-data text-2xl font-semibold">
                {afterLossesComparison.netPnl}
              </p>
              <p className="text-muted-foreground text-sm">
                {afterLossesComparison.tradeCount} trades · win rate{" "}
                {afterLossesComparison.winRate ?? "—"}%
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase">
                Baseline
              </p>
              <p className="tabular-data text-2xl font-semibold">
                {afterLossesComparison.baselineNetPnl}
              </p>
              <p className="text-muted-foreground text-sm">
                {afterLossesComparison.baselineTradeCount} trades · win rate{" "}
                {afterLossesComparison.baselineWinRate ?? "—"}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Planned vs realized R</CardTitle>
            <CardDescription>
              Winners with a planned R:R — are you closing before target?
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-xs uppercase">
                Early exit rate
              </p>
              <p className="tabular-data text-2xl font-semibold">
                {earlyWinnerExit.earlyExitRate ?? "—"}%
              </p>
              <p className="text-muted-foreground text-sm">
                {earlyWinnerExit.earlyExitCount} of{" "}
                {earlyWinnerExit.winnerCount} winners
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase">
                Avg planned / realized
              </p>
              <p className="tabular-data text-2xl font-semibold">
                {earlyWinnerExit.averagePlannedR ?? "—"}R /{" "}
                {earlyWinnerExit.averageRealizedR ?? "—"}R
              </p>
              <p className="text-muted-foreground text-sm">
                Capture {earlyWinnerExit.averageCaptureRatio ?? "—"}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <MetricsGroupsTable
        title="Performance after losses"
        description="How the next trade performs based on the loss streak immediately before it."
        rows={data.afterLossBuckets}
        currency={currency}
        nameHeader="Context"
      />

      <MetricsGroupsTable
        title="Performance after wins"
        description="How the next trade performs based on the win streak immediately before it."
        rows={data.afterWinBuckets}
        currency={currency}
        nameHeader="Context"
      />
    </div>
  );
}
