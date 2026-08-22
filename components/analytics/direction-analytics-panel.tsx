"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TradeCountDisplay } from "@/components/analytics/trade-count-display";
import { formatMoney } from "@/lib/formatting/currency";
import { pnlTextClass } from "@/lib/formatting/pnl-tone";
import { cn } from "@/lib/utils";
import type { DirectionAnalytics } from "@/types/analytics";

export function DirectionAnalyticsPanel({
  data,
  currency,
}: {
  data: DirectionAnalytics;
  currency: string;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Long vs short</CardTitle>
          <CardDescription>
            Overall performance split by trade direction.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {data.overall.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No closed trades yet.
            </p>
          ) : (
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="text-muted-foreground border-b text-left">
                  <th className="pb-2 font-medium">Direction</th>
                  <th className="pb-2 font-medium">Trades</th>
                  <th className="pb-2 font-medium">Net PnL</th>
                  <th className="pb-2 font-medium">Total R</th>
                  <th className="pb-2 font-medium">Avg R</th>
                  <th className="pb-2 font-medium">Win rate</th>
                  <th className="pb-2 font-medium">PF</th>
                </tr>
              </thead>
              <tbody>
                {data.overall.map((side) => (
                  <tr key={side.direction} className="border-b last:border-0">
                    <td className="py-3 font-medium">{side.label}</td>
                    <td className="py-3">
                      <TradeCountDisplay
                        tradeCount={side.tradeCount}
                        winCount={side.winCount}
                        lossCount={side.lossCount}
                      />
                    </td>
                    <td
                      className={cn(
                        "tabular-data py-3",
                        pnlTextClass(side.netPnl),
                      )}
                    >
                      {formatMoney(side.netPnl, currency)}
                    </td>
                    <td className="tabular-data py-3">
                      {side.totalR ? `${side.totalR}R` : "—"}
                    </td>
                    <td className="tabular-data py-3">
                      {side.averageR ? `${side.averageR}R` : "—"}
                    </td>
                    <td className="tabular-data py-3">
                      {side.winRate
                        ? `${Number(side.winRate).toFixed(1)}%`
                        : "—"}
                    </td>
                    <td className="tabular-data py-3">
                      {side.profitFactor ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>By instrument</CardTitle>
          <CardDescription>
            Long and short breakdown for each symbol.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {data.byInstrument.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No closed trades yet.
            </p>
          ) : (
            <table className="w-full min-w-[920px] text-sm">
              <thead>
                <tr className="text-muted-foreground border-b text-left">
                  <th className="pb-2 font-medium">Instrument</th>
                  <th className="pb-2 font-medium">Long trades</th>
                  <th className="pb-2 font-medium">Long PnL</th>
                  <th className="pb-2 font-medium">Short trades</th>
                  <th className="pb-2 font-medium">Short PnL</th>
                </tr>
              </thead>
              <tbody>
                {data.byInstrument.map((entry) => (
                  <tr key={entry.symbol} className="border-b last:border-0">
                    <td className="py-3 font-medium">{entry.symbol}</td>
                    <td className="tabular-data py-3">
                      {entry.long ? (
                        <TradeCountDisplay
                          tradeCount={entry.long.tradeCount}
                          winCount={entry.long.winCount}
                          lossCount={entry.long.lossCount}
                          stacked={false}
                        />
                      ) : (
                        0
                      )}
                    </td>
                    <td
                      className={cn(
                        "tabular-data py-3",
                        entry.long
                          ? pnlTextClass(entry.long.netPnl)
                          : undefined,
                      )}
                    >
                      {entry.long
                        ? formatMoney(entry.long.netPnl, currency)
                        : "—"}
                    </td>
                    <td className="tabular-data py-3">
                      {entry.short ? (
                        <TradeCountDisplay
                          tradeCount={entry.short.tradeCount}
                          winCount={entry.short.winCount}
                          lossCount={entry.short.lossCount}
                          stacked={false}
                        />
                      ) : (
                        0
                      )}
                    </td>
                    <td
                      className={cn(
                        "tabular-data py-3",
                        entry.short
                          ? pnlTextClass(entry.short.netPnl)
                          : undefined,
                      )}
                    >
                      {entry.short
                        ? formatMoney(entry.short.netPnl, currency)
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
