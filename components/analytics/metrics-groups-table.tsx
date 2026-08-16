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
import type { TradeMetricsGroup } from "@/types/analytics";

export function MetricsGroupsTable({
  title,
  description,
  rows,
  currency = "USD",
  nameHeader = "Group",
}: {
  title: string;
  description: string;
  rows: TradeMetricsGroup[];
  currency?: string;
  nameHeader?: string;
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
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="text-muted-foreground border-b text-left">
                <th className="pb-2 font-medium">{nameHeader}</th>
                <th className="pb-2 font-medium">Trades</th>
                <th className="pb-2 font-medium">Net PnL</th>
                <th className="pb-2 font-medium">Total R</th>
                <th className="pb-2 font-medium">Win rate</th>
                <th className="pb-2 font-medium">Avg R</th>
                <th className="pb-2 font-medium">Expectancy</th>
                <th className="pb-2 font-medium">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key} className="border-b last:border-0">
                  <td className="py-3 font-medium">{row.label}</td>
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
                    {row.totalR ? `${row.totalR}R` : "—"}
                  </td>
                  <td className="tabular-data py-3">
                    {row.winRate ? `${row.winRate}%` : "—"}
                  </td>
                  <td className="tabular-data py-3">
                    {row.averageR ? `${row.averageR}R` : "—"}
                  </td>
                  <td className="tabular-data py-3">
                    {row.moneyExpectancy
                      ? formatMoney(row.moneyExpectancy, currency)
                      : "—"}
                  </td>
                  <td className="text-muted-foreground py-3 text-xs uppercase">
                    {row.sampleConfidence.replaceAll("_", " ")}
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
