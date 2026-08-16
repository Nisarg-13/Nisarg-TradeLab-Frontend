"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MetricsGroupsTable } from "@/components/analytics/metrics-groups-table";
import type { PlannedRrAnalytics } from "@/types/analytics";

export function PlannedRrPanel({
  data,
  currency,
}: {
  data: PlannedRrAnalytics;
  currency: string;
}) {
  const { summary } = data;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Planned vs realized R</CardTitle>
          <CardDescription>
            Compare your planned risk/reward targets with realized outcomes.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="text-muted-foreground text-xs uppercase">
              Trades with planned R:R
            </p>
            <p className="tabular-data text-2xl font-semibold">
              {summary.tradeCount}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs uppercase">
              Avg planned R
            </p>
            <p className="tabular-data text-2xl font-semibold">
              {summary.averagePlannedR ? `${summary.averagePlannedR}R` : "—"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs uppercase">
              Avg realized R
            </p>
            <p className="tabular-data text-2xl font-semibold">
              {summary.averageRealizedR ? `${summary.averageRealizedR}R` : "—"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs uppercase">
              Target achievement
            </p>
            <p className="tabular-data text-2xl font-semibold">
              {summary.targetAchievementRate
                ? `${summary.targetAchievementRate}%`
                : "—"}
            </p>
          </div>
        </CardContent>
      </Card>

      <MetricsGroupsTable
        title="Planned R:R buckets"
        description="Performance grouped by the planned reward target at entry."
        rows={data.buckets}
        currency={currency}
        nameHeader="Bucket"
      />
    </div>
  );
}
