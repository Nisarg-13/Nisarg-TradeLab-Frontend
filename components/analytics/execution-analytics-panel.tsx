"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ExecutionAnalytics } from "@/types/analytics";

function Metric({
  label,
  value,
  suffix = "",
}: {
  label: string;
  value: string | number | null;
  suffix?: string;
}) {
  return (
    <div>
      <p className="text-muted-foreground text-xs uppercase">{label}</p>
      <p className="tabular-data text-2xl font-semibold">
        {value === null || value === "" ? "—" : `${value}${suffix}`}
      </p>
    </div>
  );
}

export function ExecutionAnalyticsPanel({
  data,
}: {
  data: ExecutionAnalytics;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Execution summary</CardTitle>
          <CardDescription>
            Entry/exit counts, hold time, and planned vs realized R from closed
            trades.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Closed trades" value={data.tradeCount} />
          <Metric label="Entry fills" value={data.entryCount} />
          <Metric label="Exit fills" value={data.exitCount} />
          <Metric label="Partial exits" value={data.partialExitCount} />
          <Metric label="Avg entry price" value={data.averageEntryPrice} />
          <Metric label="Avg exit price" value={data.averageExitPrice} />
          <Metric
            label="Avg hold time"
            value={data.averageHoldTimeMinutes}
            suffix=" min"
          />
          <Metric
            label="Avg planned R"
            value={
              data.plannedVsRealized.averagePlannedR
                ? `${data.plannedVsRealized.averagePlannedR}R`
                : null
            }
          />
          <Metric
            label="Avg realized R"
            value={
              data.plannedVsRealized.averageRealizedR
                ? `${data.plannedVsRealized.averageRealizedR}R`
                : null
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trade management events</CardTitle>
          <CardDescription>
            Stop/target changes and risk adjustments from trade event history.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Metric label="SL modifications" value={data.slModificationCount} />
          <Metric label="TP modifications" value={data.tpModificationCount} />
          <Metric
            label="Moved SL to breakeven"
            value={data.movedToBreakevenCount}
          />
          <Metric label="Widened SL" value={data.widenedSlCount} />
          <Metric label="Reduced risk" value={data.reducedRiskCount} />
          <Metric label="Increased risk" value={data.increasedRiskCount} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exit efficiency (MFE)</CardTitle>
          <CardDescription>
            Requires MFE data from live price tracking. Historical trades
            without MFE show as unavailable.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Metric label="Trades with MFE" value={data.mfeAvailableCount} />
          <Metric
            label="Avg exit efficiency"
            value={data.averageExitEfficiency}
            suffix={data.averageExitEfficiency ? "%" : ""}
          />
        </CardContent>
      </Card>
    </div>
  );
}
