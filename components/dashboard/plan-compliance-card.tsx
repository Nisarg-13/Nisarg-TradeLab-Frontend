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
import type { PlanComplianceGroup } from "@/types/analytics";

export function PlanComplianceCard({
  groups,
  currency,
}: {
  groups: PlanComplianceGroup[];
  currency: string;
}) {
  const reviewed = groups.filter((group) => group.followedPlan !== null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan compliance</CardTitle>
        <CardDescription>
          Compare performance when you followed your plan vs when you did not.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {reviewed.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Mark trades with &quot;Followed plan&quot; in the journal to unlock
            plan compliance analytics.
          </p>
        ) : (
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-muted-foreground border-b text-left">
                <th className="pb-2 font-medium">Group</th>
                <th className="pb-2 font-medium">Trades</th>
                <th className="pb-2 font-medium">Net PnL</th>
                <th className="pb-2 font-medium">Win rate</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
