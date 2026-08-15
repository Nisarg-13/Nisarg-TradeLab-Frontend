"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AddExecutionDialog } from "@/components/trades/add-execution-dialog";
import { CloseTradeDialog } from "@/components/trades/close-trade-dialog";
import { TradeExecutionsTable } from "@/components/trades/trade-executions-table";
import { TradeSummaryCard } from "@/components/trades/trade-summary-card";
import { TradeTimeline } from "@/components/trades/trade-timeline";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Trade detail
          </h1>
          <p className="text-muted-foreground text-sm">
            Review executions, timeline, and psychology for this trade.
          </p>
        </div>
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
      </div>

      <TradeSummaryCard trade={trade} />

      <div className="grid gap-6 xl:grid-cols-2">
        <TradeExecutionsTable executions={trade.executions} />
        <TradeTimeline events={trade.events} />
      </div>

      {trade.review ? (
        <Card>
          <CardHeader>
            <CardTitle>Review</CardTitle>
            <CardDescription>
              Psychology and notes for this trade.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {trade.review.preTradeEmotion ? (
              <div>
                <p className="text-muted-foreground text-sm">
                  Pre-trade emotion
                </p>
                <p>{trade.review.preTradeEmotion}</p>
              </div>
            ) : null}
            {trade.review.postTradeEmotion ? (
              <div>
                <p className="text-muted-foreground text-sm">
                  Post-trade emotion
                </p>
                <p>{trade.review.postTradeEmotion}</p>
              </div>
            ) : null}
            {trade.review.entryReason ? (
              <div className="sm:col-span-2">
                <p className="text-muted-foreground text-sm">Entry reason</p>
                <p>{trade.review.entryReason}</p>
              </div>
            ) : null}
            {trade.review.notes ? (
              <div className="sm:col-span-2">
                <p className="text-muted-foreground text-sm">Notes</p>
                <p>{trade.review.notes}</p>
              </div>
            ) : null}
            {trade.review.lesson ? (
              <div className="sm:col-span-2">
                <p className="text-muted-foreground text-sm">Lesson</p>
                <p>{trade.review.lesson}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
