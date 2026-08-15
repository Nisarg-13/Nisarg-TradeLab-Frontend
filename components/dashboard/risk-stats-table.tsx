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
import type { RiskStatGroup } from "@/types/analytics";

export function RiskStatsTable({
  groups,
  currency,
}: {
  groups: RiskStatGroup[];
  currency: string;
}) {
  const populated = groups.filter((group) => group.tradeCount > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk stats</CardTitle>
        <CardDescription>
          Closed-trade performance grouped by initial risk percentage.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {populated.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Record initial risk on trades to analyze performance by risk level.
          </p>
        ) : (
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-muted-foreground border-b text-left">
                <th className="pb-2 font-medium">Risk bucket</th>
                <th className="pb-2 font-medium">Trades</th>
                <th className="pb-2 font-medium">Net PnL</th>
                <th className="pb-2 font-medium">Win rate</th>
                <th className="pb-2 font-medium">Avg R</th>
                <th className="pb-2 font-medium">Expectancy</th>
              </tr>
            </thead>
            <tbody>
              {populated.map((group) => (
                <tr key={group.label} className="border-b last:border-0">
                  <td className="py-3 font-medium">{group.label}</td>
                  <td className="tabular-data py-3">{group.tradeCount}</td>
                  <td
                    className={cn(
                      "tabular-data py-3",
                      pnlTextClass(group.netPnl),
                    )}
                  >
                    {formatMoney(group.netPnl, currency)}
                  </td>
                  <td className="tabular-data py-3">
                    {group.winRate
                      ? `${Number(group.winRate).toFixed(1)}%`
                      : "—"}
                  </td>
                  <td className="py-3 tabular-nums">
                    {group.averageR ? `${group.averageR}R` : "—"}
                  </td>
                  <td className="py-3 tabular-nums">
                    {group.moneyExpectancy
                      ? formatMoney(group.moneyExpectancy, currency)
                      : "—"}
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
