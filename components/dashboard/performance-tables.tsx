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
  InstrumentPerformance,
  StrategyPerformance,
} from "@/types/analytics";

function PerformanceTable({
  title,
  description,
  rows,
  currency,
  nameHeader,
}: {
  title: string;
  description: string;
  rows: Array<{
    name: string;
    tradeCount: number;
    netPnl: string;
    winRate: string | null;
  }>;
  currency: string;
  nameHeader: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {rows.length === 0 ? (
          <p className="text-muted-foreground text-sm">No data yet.</p>
        ) : (
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="text-muted-foreground border-b text-left">
                <th className="pb-2 font-medium">{nameHeader}</th>
                <th className="pb-2 font-medium">Trades</th>
                <th className="pb-2 font-medium">Net PnL</th>
                <th className="pb-2 font-medium">Win rate</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.name} className="border-b last:border-0">
                  <td className="py-3 font-medium">{row.name}</td>
                  <td className="tabular-data py-3">{row.tradeCount}</td>
                  <td
                    className={cn(
                      "tabular-data py-3",
                      pnlTextClass(row.netPnl),
                    )}
                  >
                    {formatMoney(row.netPnl, currency)}
                  </td>
                  <td className="tabular-data py-3">
                    {row.winRate ? `${Number(row.winRate).toFixed(1)}%` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}

export function InstrumentPerformanceTable({
  rows,
  currency,
}: {
  rows: InstrumentPerformance[];
  currency: string;
}) {
  return (
    <PerformanceTable
      title="Instrument performance"
      description="Closed-trade stats grouped by symbol."
      nameHeader="Instrument"
      currency={currency}
      rows={rows.map((row) => ({
        name: row.symbol,
        tradeCount: row.tradeCount,
        netPnl: row.netPnl,
        winRate: row.winRate,
      }))}
    />
  );
}

export function StrategyPerformanceTable({
  rows,
  currency,
}: {
  rows: StrategyPerformance[];
  currency: string;
}) {
  return (
    <PerformanceTable
      title="Strategy performance"
      description="Closed-trade stats grouped by strategy."
      nameHeader="Strategy"
      currency={currency}
      rows={rows.map((row) => ({
        name: row.strategyName,
        tradeCount: row.tradeCount,
        netPnl: row.netPnl,
        winRate: row.winRate,
      }))}
    />
  );
}
