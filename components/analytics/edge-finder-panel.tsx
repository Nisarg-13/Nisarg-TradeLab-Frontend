"use client";

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
import type {
  EdgeFinderAnalytics,
  EdgeFinderCombination,
} from "@/types/analytics";

function CombinationTable({
  title,
  description,
  rows,
  currency,
  tone,
}: {
  title: string;
  description: string;
  rows: EdgeFinderCombination[];
  currency: string;
  tone: "positive" | "negative";
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {rows.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Not enough closed trades yet to evaluate multi-dimensional patterns
            at the minimum sample threshold.
          </p>
        ) : (
          <table className="w-full min-w-[920px] text-sm">
            <thead>
              <tr className="text-muted-foreground border-b text-left">
                <th className="pb-2 font-medium">Combination</th>
                <th className="pb-2 font-medium">Trades</th>
                <th className="pb-2 font-medium">Net PnL</th>
                <th className="pb-2 font-medium">Avg R</th>
                <th className="pb-2 font-medium">R expectancy</th>
                <th className="pb-2 font-medium">Win rate</th>
                <th className="pb-2 font-medium">PF</th>
                <th className="pb-2 font-medium">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const label = row.dimensions
                  .map((dimension) => `${dimension.value}`)
                  .join(" · ");

                return (
                  <tr key={label} className="border-b last:border-0">
                    <td className="py-3 pr-4">
                      <p className="font-medium">{label}</p>
                      <p className="text-muted-foreground text-xs">
                        {row.dimensions
                          .map((dimension) => dimension.label)
                          .join(" · ")}
                      </p>
                    </td>
                    <td className="tabular-data py-3">{row.tradeCount}</td>
                    <td
                      className={cn(
                        "tabular-data py-3",
                        pnlTextClass(Number(row.netPnl)),
                      )}
                    >
                      {formatMoney(row.netPnl, currency)}
                    </td>
                    <td className="tabular-data py-3">
                      {row.averageR ? `${row.averageR}R` : "—"}
                    </td>
                    <td
                      className={cn(
                        "tabular-data py-3",
                        row.rExpectancy
                          ? tone === "positive"
                            ? "text-primary"
                            : "text-destructive"
                          : "text-muted-foreground",
                      )}
                    >
                      {row.rExpectancy ? `${row.rExpectancy}R` : "—"}
                    </td>
                    <td className="tabular-data py-3">
                      {row.winRate ? `${row.winRate}%` : "—"}
                    </td>
                    <td className="tabular-data py-3">
                      {row.profitFactor ?? "—"}
                    </td>
                    <td className="py-3">{row.sampleConfidence}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}

export function EdgeFinderPanel({
  data,
  currency,
}: {
  data: EdgeFinderAnalytics;
  currency: string;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edge Finder</CardTitle>
          <CardDescription>
            Historical combinations ranked by R expectancy (minimum{" "}
            {data.minimumSampleSize} trades). Past performance does not
            guarantee future results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Evaluated {data.evaluatedCombinationCount} qualifying combinations
            across instruments, direction, strategy, session, entry criteria,
            risk, and plan compliance.
          </p>
        </CardContent>
      </Card>

      <CombinationTable
        title="Strongest combinations"
        description="Highest historical R expectancy with supporting sample size."
        rows={data.strongest}
        currency={currency}
        tone="positive"
      />

      <CombinationTable
        title="Weakest combinations"
        description="Lowest historical R expectancy — review for behavioral or setup risk."
        rows={data.weakest}
        currency={currency}
        tone="negative"
      />
    </div>
  );
}
