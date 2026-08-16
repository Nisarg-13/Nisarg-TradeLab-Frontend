"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatMoney } from "@/lib/formatting/currency";
import type { ConcentrationAnalytics } from "@/types/analytics";

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
        {value === null ? "—" : `${value}${suffix}`}
      </p>
    </div>
  );
}

export function ConcentrationPanel({
  data,
  currency,
}: {
  data: ConcentrationAnalytics;
  currency: string;
}) {
  const { profit, loss } = data;

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Profit concentration</CardTitle>
          <CardDescription>
            How much of your gross profit comes from your largest winners.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Metric label="Winning trades" value={profit.winnerCount} />
          <Metric
            label="Gross profit"
            value={formatMoney(profit.grossProfit, currency)}
          />
          <Metric label="Top 1 share" value={profit.top1Percent} suffix="%" />
          <Metric label="Top 3 share" value={profit.top3Percent} suffix="%" />
          <Metric label="Top 5 share" value={profit.top5Percent} suffix="%" />
          <Metric label="Top 10 share" value={profit.top10Percent} suffix="%" />
          <Metric
            label="Net PnL ex. top 1"
            value={formatMoney(profit.netPnlExcludingTop1, currency)}
          />
          <Metric
            label="Net PnL ex. top 3"
            value={formatMoney(profit.netPnlExcludingTop3, currency)}
          />
          <Metric
            label="Net PnL ex. top 5"
            value={formatMoney(profit.netPnlExcludingTop5, currency)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Loss concentration</CardTitle>
          <CardDescription>
            How much of your gross loss comes from your worst losers.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Metric label="Losing trades" value={loss.loserCount} />
          <Metric
            label="Gross loss"
            value={formatMoney(loss.grossLoss, currency)}
          />
          <Metric label="Worst 1 share" value={loss.worst1Percent} suffix="%" />
          <Metric label="Worst 3 share" value={loss.worst3Percent} suffix="%" />
          <Metric label="Worst 5 share" value={loss.worst5Percent} suffix="%" />
          <Metric
            label="Worst 10 share"
            value={loss.worst10Percent}
            suffix="%"
          />
        </CardContent>
      </Card>
    </div>
  );
}
