import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TradeExecution } from "@/types/trade";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function TradeExecutionsTable({
  executions,
}: {
  executions: TradeExecution[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Executions</CardTitle>
        <CardDescription>Entry and exit fills for this trade.</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {executions.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No executions recorded.
          </p>
        ) : (
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-muted-foreground border-b text-left">
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">Price</th>
                <th className="pb-2 font-medium">Volume</th>
                <th className="pb-2 font-medium">Profit</th>
                <th className="pb-2 font-medium">Fees</th>
                <th className="pb-2 font-medium">Executed</th>
              </tr>
            </thead>
            <tbody>
              {executions.map((execution) => (
                <tr key={execution.id} className="border-b last:border-0">
                  <td className="py-3">{execution.type}</td>
                  <td className="py-3 tabular-nums">{execution.price}</td>
                  <td className="py-3 tabular-nums">{execution.volume}</td>
                  <td className="py-3 tabular-nums">{execution.profit}</td>
                  <td className="py-3 tabular-nums">
                    {(
                      Number(execution.commission) +
                      Number(execution.swap) +
                      Number(execution.fee)
                    ).toFixed(2)}
                  </td>
                  <td className="py-3">{formatDate(execution.executedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
