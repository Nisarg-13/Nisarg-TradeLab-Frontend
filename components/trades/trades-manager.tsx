"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { TradeStatusBadge } from "@/components/trades/trade-status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { listTrades } from "@/lib/api/trades";
import { useClientAuthToken } from "@/lib/auth/client";
import { formatMoney } from "@/lib/formatting/currency";
import { cn } from "@/lib/utils";
import type { TradingAccount } from "@/types/account";
import type { Trade, TradeStatus } from "@/types/trade";
import type { TradeDirection } from "@/types/risk";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "OPEN", label: "Open" },
  { value: "CLOSED", label: "Closed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const DIRECTION_OPTIONS = [
  { value: "", label: "All directions" },
  { value: "LONG", label: "Long" },
  { value: "SHORT", label: "Short" },
];

const SORT_OPTIONS = [
  { value: "openedAt_desc", label: "Newest first" },
  { value: "openedAt_asc", label: "Oldest first" },
  { value: "netPnl_desc", label: "Highest PnL" },
  { value: "netPnl_asc", label: "Lowest PnL" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function TradesManager({
  initialTrades,
  initialMeta,
  accounts,
}: {
  initialTrades: Trade[];
  initialMeta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  accounts: TradingAccount[];
}) {
  const getAuthToken = useClientAuthToken();
  const [trades, setTrades] = useState(initialTrades);
  const [meta, setMeta] = useState(initialMeta);
  const [isLoading, setIsLoading] = useState(false);

  const [accountId, setAccountId] = useState("");
  const [symbol, setSymbol] = useState("");
  const [status, setStatus] = useState<TradeStatus | "">("");
  const [direction, setDirection] = useState<TradeDirection | "">("");
  const [sort, setSort] = useState<
    "openedAt_desc" | "openedAt_asc" | "netPnl_desc" | "netPnl_asc"
  >("openedAt_desc");
  const [page, setPage] = useState(initialMeta.page);

  const accountOptions = [
    { value: "", label: "All accounts" },
    ...accounts.map((account) => ({
      value: account.id,
      label: account.name,
    })),
  ];

  const loadTrades = useCallback(
    async (nextPage = page) => {
      setIsLoading(true);

      try {
        const response = await listTrades(getAuthToken, {
          page: nextPage,
          limit: meta.limit,
          sort,
          ...(accountId ? { tradingAccountId: accountId } : {}),
          ...(symbol ? { symbol: symbol.toUpperCase() } : {}),
          ...(status ? { status } : {}),
          ...(direction ? { direction } : {}),
        });

        setTrades(response.data);
        setMeta(response.meta);
        setPage(response.meta.page);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to load trades.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      accountId,
      direction,
      getAuthToken,
      meta.limit,
      page,
      sort,
      status,
      symbol,
    ],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Trades</h1>
          <p className="text-muted-foreground text-sm">
            Browse, filter, and review your open and closed trades.
          </p>
        </div>
        <Link href="/trades/new" className={cn(buttonVariants())}>
          New trade
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Refine the trade list.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="filter-account">Account</Label>
            <DropdownSelect
              id="filter-account"
              name="filter-account"
              options={accountOptions}
              value={accountId}
              onValueChange={setAccountId}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-symbol">Symbol</Label>
            <Input
              id="filter-symbol"
              placeholder="EUR/USD"
              value={symbol}
              onChange={(event) => setSymbol(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-status">Status</Label>
            <DropdownSelect
              id="filter-status"
              name="filter-status"
              options={STATUS_OPTIONS}
              value={status}
              onValueChange={(value) => setStatus(value as TradeStatus | "")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-direction">Direction</Label>
            <DropdownSelect
              id="filter-direction"
              name="filter-direction"
              options={DIRECTION_OPTIONS}
              value={direction}
              onValueChange={(value) =>
                setDirection(value as TradeDirection | "")
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-sort">Sort</Label>
            <DropdownSelect
              id="filter-sort"
              name="filter-sort"
              options={SORT_OPTIONS}
              value={sort}
              onValueChange={(value) =>
                setSort(
                  value as
                    | "openedAt_desc"
                    | "openedAt_asc"
                    | "netPnl_desc"
                    | "netPnl_asc",
                )
              }
            />
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              disabled={isLoading}
              onClick={() => void loadTrades(1)}
            >
              {isLoading ? "Loading..." : "Apply filters"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trade journal</CardTitle>
          <CardDescription>
            {meta.total} trade{meta.total === 1 ? "" : "s"} total
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {trades.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No trades yet. Create your first trade to start journaling.
            </p>
          ) : (
            trades.map((trade) => (
              <Link
                key={trade.id}
                href={`/trades/${trade.id}`}
                className="hover:bg-muted/50 block rounded-lg border p-4 transition-colors"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">
                        {trade.symbol} · {trade.direction}
                      </p>
                      <TradeStatusBadge status={trade.status} />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {trade.tradingAccount.name} · Opened{" "}
                      {formatDate(trade.openedAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium tabular-nums ${
                        Number(trade.netPnl) >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-destructive"
                      }`}
                    >
                      {formatMoney(trade.netPnl, trade.tradingAccount.currency)}
                    </p>
                    {trade.realizedR ? (
                      <p className="text-muted-foreground text-sm tabular-nums">
                        {Number(trade.realizedR).toFixed(2)}R
                      </p>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))
          )}

          {meta.totalPages > 1 ? (
            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={page <= 1 || isLoading}
                onClick={() => void loadTrades(page - 1)}
              >
                Previous
              </Button>
              <p className="text-muted-foreground text-sm">
                Page {meta.page} of {meta.totalPages}
              </p>
              <Button
                type="button"
                variant="outline"
                disabled={page >= meta.totalPages || isLoading}
                onClick={() => void loadTrades(page + 1)}
              >
                Next
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
