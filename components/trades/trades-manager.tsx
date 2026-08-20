"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/page-header";
import { BulkJournalPanel } from "@/components/trades/bulk-journal-panel";
import { TradesTable } from "@/components/trades/trades-table";
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
import {
  useInitialPersistedAccountLoad,
  usePersistedAccountId,
} from "@/lib/hooks/use-persisted-account-id";
import { cn } from "@/lib/utils";
import type { TradingAccount } from "@/types/account";
import type { Mistake, Strategy, Tag } from "@/types/strategy";
import type { Trade, TradeSort, TradeStatus } from "@/types/trade";
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

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

const SORT_OPTIONS: Array<{ value: TradeSort; label: string }> = [
  { value: "openedAt_desc", label: "Newest first" },
  { value: "openedAt_asc", label: "Oldest first" },
  { value: "netPnl_desc", label: "Highest PnL" },
  { value: "netPnl_asc", label: "Lowest PnL" },
  { value: "duration_desc", label: "Longest duration" },
  { value: "duration_asc", label: "Shortest duration" },
  { value: "direction_asc", label: "Long first" },
  { value: "direction_desc", label: "Short first" },
];

export function TradesManager({
  initialTrades,
  initialMeta,
  accounts,
  strategies,
  tags,
  mistakes,
}: {
  initialTrades: Trade[];
  initialMeta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  accounts: TradingAccount[];
  strategies: Strategy[];
  tags: Tag[];
  mistakes: Mistake[];
}) {
  const getAuthToken = useClientAuthToken();
  const { accountId, setAccountId, isReady } = usePersistedAccountId(accounts);
  const [trades, setTrades] = useState(initialTrades);
  const [meta, setMeta] = useState(initialMeta);
  const [isLoading, setIsLoading] = useState(false);

  const [symbol, setSymbol] = useState("");
  const [status, setStatus] = useState<TradeStatus | "">("");
  const [direction, setDirection] = useState<TradeDirection | "">("");
  const [sort, setSort] = useState<TradeSort>("openedAt_desc");
  const [page, setPage] = useState(initialMeta.page);
  const [pageSize, setPageSize] = useState(initialMeta.limit || 10);
  const [selectedTradeIds, setSelectedTradeIds] = useState<string[]>([]);
  const [showBulkJournal, setShowBulkJournal] = useState(false);

  const selectedTrades = trades.filter((trade) =>
    selectedTradeIds.includes(trade.id),
  );

  const accountOptions = [
    { value: "", label: "All accounts" },
    ...accounts.map((account) => ({
      value: account.id,
      label: account.name,
    })),
  ];

  const loadTrades = useCallback(
    async (
      nextPage = page,
      nextLimit = pageSize,
      nextSort: TradeSort = sort,
    ) => {
      setIsLoading(true);

      try {
        const response = await listTrades(getAuthToken, {
          page: nextPage,
          limit: nextLimit,
          sort: nextSort,
          ...(accountId ? { tradingAccountId: accountId } : {}),
          ...(symbol ? { symbol: symbol.toUpperCase() } : {}),
          ...(status ? { status } : {}),
          ...(direction ? { direction } : {}),
        });

        setTrades(response.data);
        setMeta(response.meta);
        setPage(response.meta.page);
        setPageSize(response.meta.limit);
        setSort(nextSort);
        setSelectedTradeIds((current) =>
          current.filter((id) =>
            response.data.some((trade) => trade.id === id),
          ),
        );
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to load trades.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [accountId, direction, getAuthToken, page, pageSize, sort, status, symbol],
  );

  useInitialPersistedAccountLoad(
    isReady,
    () => loadTrades(1),
    Boolean(accountId),
  );

  function handleSortChange(nextSort: TradeSort) {
    void loadTrades(1, pageSize, nextSort);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Journal"
        title="Trades"
        description="Browse, filter, and review your open and closed trades."
      >
        <Link href="/trades/new" className={cn(buttonVariants())}>
          New trade
        </Link>
      </PageHeader>

      <Card>
        <CardHeader className="pb-4">
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
              onValueChange={(value) => setSort(value as TradeSort)}
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
        <CardHeader className="flex flex-row items-center justify-between gap-3 pb-4">
          <div>
            <CardTitle>All trades</CardTitle>
            <CardDescription className="mt-1">
              {meta.total} trade{meta.total === 1 ? "" : "s"} total
              {selectedTradeIds.length > 0
                ? ` · ${selectedTradeIds.length} selected`
                : ""}
            </CardDescription>
          </div>
          {selectedTradeIds.length > 0 ? (
            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSelectedTradeIds([]);
                  setShowBulkJournal(false);
                }}
              >
                Clear selection
              </Button>
              <Button type="button" onClick={() => setShowBulkJournal(true)}>
                Edit journal
              </Button>
            </div>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          {showBulkJournal && selectedTradeIds.length > 0 ? (
            <BulkJournalPanel
              selectedTradeIds={selectedTradeIds}
              selectedSymbols={selectedTrades.map((trade) => trade.symbol)}
              strategies={strategies}
              tags={tags}
              mistakes={mistakes}
              onSaved={() => {
                setSelectedTradeIds([]);
                setShowBulkJournal(false);
              }}
              onCancel={() => setShowBulkJournal(false)}
            />
          ) : null}

          {isLoading ? (
            <p className="text-muted-foreground text-sm">Loading trades...</p>
          ) : (
            <TradesTable
              trades={trades}
              showAccount={!accountId}
              emptyMessage="No trades match these filters."
              selectable
              selectedTradeIds={selectedTradeIds}
              onSelectedTradeIdsChange={setSelectedTradeIds}
              sortable
              sort={sort}
              onSortChange={handleSortChange}
            />
          )}

          <div className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground shrink-0 text-sm">
                Rows per page
              </span>
              <div
                className="bg-muted/40 flex rounded-lg border p-0.5"
                role="group"
                aria-label="Rows per page"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <Button
                    key={size}
                    type="button"
                    variant={pageSize === size ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8 min-w-10 px-3"
                    disabled={isLoading}
                    aria-pressed={pageSize === size}
                    onClick={() => {
                      if (pageSize !== size) {
                        void loadTrades(1, size);
                      }
                    }}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {meta.totalPages > 1 ? (
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
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
                  size="sm"
                  disabled={page >= meta.totalPages || isLoading}
                  onClick={() => void loadTrades(page + 1)}
                >
                  Next
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Page {meta.page} of {meta.totalPages}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
