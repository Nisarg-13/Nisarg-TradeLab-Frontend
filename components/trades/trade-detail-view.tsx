"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { AddExecutionDialog } from "@/components/trades/add-execution-dialog";
import { CloseTradeDialog } from "@/components/trades/close-trade-dialog";
import { TradeExecutionsTable } from "@/components/trades/trade-executions-table";
import { TradeJournalCard } from "@/components/trades/trade-journal-card";
import { TradeSummaryCard } from "@/components/trades/trade-summary-card";
import { TradeTimeline } from "@/components/trades/trade-timeline";
import { buttonVariants } from "@/components/ui/button";
import type { Trade } from "@/types/trade";
import { cn } from "@/lib/utils";

export function TradeDetailView({ initialTrade }: { initialTrade: Trade }) {
  const router = useRouter();
  const [trade, setTrade] = useState(initialTrade);

  function handleUpdated(nextTrade: Trade) {
    setTrade(nextTrade);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Journal"
        title="Trade detail"
        description="Review executions, timeline, and psychology for this trade."
      >
        <div className="flex flex-wrap gap-2">
          <Link
            href="/trades"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Back to trades
          </Link>
          {trade.status === "OPEN" ? (
            <>
              <AddExecutionDialog trade={trade} onUpdated={handleUpdated} />
              <CloseTradeDialog trade={trade} onClosed={handleUpdated} />
            </>
          ) : null}
          <Link
            href={`/trades/${trade.id}/edit`}
            className={cn(buttonVariants())}
          >
            Edit
          </Link>
        </div>
      </PageHeader>

      <TradeSummaryCard trade={trade} />

      <TradeJournalCard trade={trade} onUpdated={handleUpdated} />

      <div className="grid gap-6 xl:grid-cols-2">
        <TradeExecutionsTable
          executions={trade.executions}
          currency={trade.tradingAccount.currency}
        />
        <TradeTimeline events={trade.events} />
      </div>
    </div>
  );
}
