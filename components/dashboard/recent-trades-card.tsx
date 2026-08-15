import Link from "next/link";

import { TradesTable } from "@/components/trades/trades-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Trade } from "@/types/trade";

export function RecentTradesCard({ trades }: { trades: Trade[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-4">
        <CardTitle>Recent trades</CardTitle>
        <Link
          href="/trades"
          className="text-primary text-sm font-medium hover:underline"
        >
          View all →
        </Link>
      </CardHeader>

      <CardContent className="pt-0">
        <TradesTable
          trades={trades}
          emptyMessage="No trades yet. Create one from the journal or risk calculator."
        />
      </CardContent>
    </Card>
  );
}
