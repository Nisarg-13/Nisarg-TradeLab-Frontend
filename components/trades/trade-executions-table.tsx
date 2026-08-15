import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormattedDateTime } from "@/components/formatting/formatted-datetime";
import { formatMoney } from "@/lib/formatting/currency";
import { formatTradePrice } from "@/lib/formatting/trade-price";
import type { TradeExecution } from "@/types/trade";

function formatCharge(value: string, currency: string) {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount === 0) {
    return "—";
  }

  return formatMoney(value, currency);
}

export function TradeExecutionsTable({
  executions,
  currency,
}: {
  executions: TradeExecution[];
  currency: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Executions</CardTitle>
        <CardDescription>
          Entry and exit fills with profit, commission, swap, and fees.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {executions.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No executions recorded.
          </p>
        ) : (
          <table className="w-full min-w-[880px] text-sm">
            <thead>
              <tr className="text-muted-foreground border-b text-left">
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">Price</th>
                <th className="pb-2 font-medium">Volume</th>
                <th className="pb-2 font-medium">Profit</th>
                <th className="pb-2 font-medium">Commission</th>
                <th className="pb-2 font-medium">Swap</th>
                <th className="pb-2 font-medium">Fees</th>
                <th className="pb-2 font-medium">Executed</th>
              </tr>
            </thead>
            <tbody>
              {executions.map((execution) => (
                <tr key={execution.id} className="border-b last:border-0">
                  <td className="py-3">{execution.type}</td>
                  <td className="py-3 tabular-nums">
                    {formatTradePrice(execution.price)}
                  </td>
                  <td className="py-3 tabular-nums">{execution.volume}</td>
                  <td className="py-3 tabular-nums">{execution.profit}</td>
                  <td className="py-3 tabular-nums">
                    {formatCharge(execution.commission, currency)}
                  </td>
                  <td className="py-3 tabular-nums">
                    {formatCharge(execution.swap, currency)}
                  </td>
                  <td className="py-3 tabular-nums">
                    {formatCharge(execution.fee, currency)}
                  </td>
                  <td className="py-3">
                    <FormattedDateTime value={execution.executedAt} />
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
