"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/page-header";
import { BulkJournalPanel } from "@/components/trades/bulk-journal-panel";
import { TradesTable } from "@/components/trades/trades-table";
import { Button } from "@/components/ui/button";
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
  getCached,
  setCached,
  stableCacheKey,
} from "@/lib/cache/account-data-cache";
import { usePersistedAccountId } from "@/lib/hooks/use-persisted-account-id";
import { useAutoReloadOnAccountChange } from "@/lib/hooks/use-auto-reload-on-account-change";
import { useTradeDataRefresh } from "@/lib/hooks/use-trade-data-refresh";
import { shouldSkipServerMatchedAccountLoad } from "@/lib/preferences/server-account-load";
import {
  canSortTradesClientSide,
  sortTradesClientSide,
} from "@/lib/trades/sort";
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

const PAGE_SIZE = 50;

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

type TradeListFilters = {
  accountId: string;
  symbol: string;
  status: TradeStatus | "";
  direction: TradeDirection | "";
  sort: TradeSort;
};

const EMPTY_FILTERS: TradeListFilters = {
  accountId: "",
  symbol: "",
  status: "",
  direction: "",
  sort: "openedAt_desc",
};

function countActiveFilters(filters: TradeListFilters) {
  let count = 0;

  if (filters.symbol.trim()) {
    count += 1;
  }

  if (filters.status) {
    count += 1;
  }

  if (filters.direction) {
    count += 1;
  }

  return count;
}

function tradesCacheKey(
  filters: TradeListFilters,
  page: number,
  limit: number,
) {
  return stableCacheKey({
    scope: "trades",
    page,
    limit,
    accountId: filters.accountId,
    symbol: filters.symbol.trim().toUpperCase(),
    status: filters.status,
    direction: filters.direction,
    sort: filters.sort,
  });
}

export function TradesManager({
  initialTrades,
  initialMeta,
  accounts,
  serverSelectedAccountId = "",
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
  serverSelectedAccountId?: string;
  strategies: Strategy[];
  tags: Tag[];
  mistakes: Mistake[];
}) {
  const getAuthToken = useClientAuthToken();
  const { accountId, setAccountId, isReady } = usePersistedAccountId(accounts);
  const [trades, setTrades] = useState(initialTrades);
  const [meta, setMeta] = useState(initialMeta);
  const [isLoading, setIsLoading] = useState(false);
  const requestIdRef = useRef(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<TradeListFilters>(
    () => ({
      ...EMPTY_FILTERS,
      accountId: serverSelectedAccountId,
    }),
  );
  const [draftFilters, setDraftFilters] = useState<TradeListFilters>(() => ({
    ...EMPTY_FILTERS,
    accountId: serverSelectedAccountId,
  }));

  const [page, setPage] = useState(initialMeta.page);
  const [pageSize] = useState(PAGE_SIZE);
  const [selectedTradeIds, setSelectedTradeIds] = useState<string[]>([]);
  const [showBulkJournal, setShowBulkJournal] = useState(false);

  useEffect(() => {
    const initialFilters: TradeListFilters = {
      ...EMPTY_FILTERS,
      accountId: serverSelectedAccountId,
    };

    setCached(
      tradesCacheKey(initialFilters, initialMeta.page, initialMeta.limit),
      {
        trades: initialTrades,
        meta: initialMeta,
      },
    );
  }, [initialMeta, initialTrades, serverSelectedAccountId]);

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
      nextFilters: TradeListFilters = appliedFilters,
      options?: { silent?: boolean },
    ) => {
      const cacheKey = tradesCacheKey(nextFilters, nextPage, nextLimit);
      const cached = getCached<{
        trades: Trade[];
        meta: typeof initialMeta;
      }>(cacheKey);
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;

      if (cached) {
        setTrades(cached.trades);
        setMeta(cached.meta);
        setPage(cached.meta.page);
        setAppliedFilters(nextFilters);
        setDraftFilters(nextFilters);
        setSelectedTradeIds((current) =>
          current.filter((id) =>
            cached.trades.some((trade) => trade.id === id),
          ),
        );
      }

      if (!cached && !options?.silent) {
        setIsLoading(true);
      }

      try {
        const response = await listTrades(getAuthToken, {
          page: nextPage,
          limit: nextLimit,
          sort: nextFilters.sort,
          ...(nextFilters.accountId
            ? { tradingAccountId: nextFilters.accountId }
            : {}),
          ...(nextFilters.symbol
            ? { symbol: nextFilters.symbol.toUpperCase() }
            : {}),
          ...(nextFilters.status ? { status: nextFilters.status } : {}),
          ...(nextFilters.direction
            ? { direction: nextFilters.direction }
            : {}),
        });

        if (requestIdRef.current !== requestId) {
          return;
        }

        setCached(cacheKey, {
          trades: response.data,
          meta: response.meta,
        });
        setTrades(response.data);
        setMeta(response.meta);
        setPage(response.meta.page);
        setAppliedFilters(nextFilters);
        setDraftFilters(nextFilters);
        setSelectedTradeIds((current) =>
          current.filter((id) =>
            response.data.some((trade) => trade.id === id),
          ),
        );
      } catch (err) {
        if (requestIdRef.current !== requestId) {
          return;
        }

        if (!cached) {
          toast.error(
            err instanceof Error ? err.message : "Failed to load trades.",
          );
        }
      } finally {
        if (requestIdRef.current === requestId) {
          setIsLoading(false);
        }
      }
    },
    [appliedFilters, getAuthToken, page, pageSize],
  );

  const filtersWithAccount = useCallback(
    (filters: TradeListFilters = appliedFilters) => ({
      ...filters,
      accountId,
    }),
    [accountId, appliedFilters],
  );

  const reloadTradesForAccount = useCallback(async () => {
    await loadTrades(1, pageSize, filtersWithAccount());
  }, [filtersWithAccount, loadTrades, pageSize]);

  useAutoReloadOnAccountChange(isReady, accountId, reloadTradesForAccount, {
    skipInitial: shouldSkipServerMatchedAccountLoad(
      accountId,
      serverSelectedAccountId,
    ),
  });

  const refreshTrades = useCallback(() => {
    return loadTrades(page, pageSize, filtersWithAccount());
  }, [filtersWithAccount, loadTrades, page, pageSize]);

  useTradeDataRefresh(isReady, refreshTrades);

  function openFilters() {
    setDraftFilters(appliedFilters);
    setFiltersOpen(true);
  }

  function applyFilters() {
    const nextFilters = filtersWithAccount(draftFilters);
    setFiltersOpen(false);
    void loadTrades(1, pageSize, nextFilters);
  }

  function clearFilters() {
    const cleared = filtersWithAccount(EMPTY_FILTERS);
    setDraftFilters(cleared);
    setAppliedFilters(cleared);
    setFiltersOpen(false);
    void loadTrades(1, pageSize, cleared);
  }

  function handleSortChange(nextSort: TradeSort) {
    const nextFilters = filtersWithAccount({
      ...appliedFilters,
      sort: nextSort,
    });

    if (canSortTradesClientSide(meta)) {
      setAppliedFilters(nextFilters);
      setDraftFilters(nextFilters);
      setTrades(sortTradesClientSide(trades, nextSort));
      return;
    }

    void loadTrades(1, pageSize, nextFilters);
  }

  const activeFilterCount = countActiveFilters(appliedFilters);
  const selectedAccountName = accounts.find(
    (account) => account.id === (appliedFilters.accountId || accountId),
  )?.name;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <PageHeader
          eyebrow="Journal"
          title="Trades"
          description="Browse, filter, and review your open and closed trades."
        />
        <div className="w-full max-w-md space-y-2">
          <Label htmlFor="trades-account">Account</Label>
          <DropdownSelect
            id="trades-account"
            name="trades-account"
            options={accountOptions}
            value={accountId}
            onValueChange={setAccountId}
          />
        </div>
      </div>

      <Card>
        <CardHeader
          className={cn(
            "gap-4 sm:flex-row sm:items-start sm:justify-between",
            filtersOpen && "border-b pb-5",
          )}
        >
          <div className="min-w-0 flex-1 space-y-1">
            <CardTitle className="leading-snug">All trades</CardTitle>
            <CardDescription>
              {meta.total} trade{meta.total === 1 ? "" : "s"} total
              {selectedAccountName ? ` · ${selectedAccountName}` : ""}
              {selectedTradeIds.length > 0
                ? ` · ${selectedTradeIds.length} selected`
                : ""}
              {activeFilterCount > 0
                ? ` · ${activeFilterCount} filter${activeFilterCount === 1 ? "" : "s"} active`
                : ""}
            </CardDescription>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            <Button
              type="button"
              variant={filtersOpen ? "secondary" : "outline"}
              onClick={() =>
                filtersOpen ? setFiltersOpen(false) : openFilters()
              }
            >
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              Filters
              {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </Button>
            {selectedTradeIds.length > 0 ? (
              <>
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
              </>
            ) : null}
          </div>
        </CardHeader>
        {filtersOpen ? (
          <div className="bg-muted/20 border-b px-6 py-5">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="filter-symbol">Symbol</Label>
                <Input
                  id="filter-symbol"
                  placeholder="EUR/USD"
                  value={draftFilters.symbol}
                  onChange={(event) =>
                    setDraftFilters((current) => ({
                      ...current,
                      symbol: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="filter-status">Status</Label>
                <DropdownSelect
                  id="filter-status"
                  name="filter-status"
                  options={STATUS_OPTIONS}
                  value={draftFilters.status}
                  onValueChange={(value) =>
                    setDraftFilters((current) => ({
                      ...current,
                      status: value as TradeStatus | "",
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="filter-direction">Direction</Label>
                <DropdownSelect
                  id="filter-direction"
                  name="filter-direction"
                  options={DIRECTION_OPTIONS}
                  value={draftFilters.direction}
                  onValueChange={(value) =>
                    setDraftFilters((current) => ({
                      ...current,
                      direction: value as TradeDirection | "",
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="filter-sort">Sort</Label>
                <DropdownSelect
                  id="filter-sort"
                  name="filter-sort"
                  options={SORT_OPTIONS}
                  value={draftFilters.sort}
                  onValueChange={(value) =>
                    setDraftFilters((current) => ({
                      ...current,
                      sort: value as TradeSort,
                    }))
                  }
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
              <Button
                type="button"
                disabled={isLoading}
                onClick={() => void applyFilters()}
              >
                {isLoading ? "Applying..." : "Apply filters"}
              </Button>
              {activeFilterCount > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={() => void clearFilters()}
                >
                  Clear
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
        <CardContent className={cn("space-y-4", filtersOpen ? "pt-5" : "pt-0")}>
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

          <div
            className={cn(
              "relative",
              isLoading && trades.length > 0 && "opacity-70",
            )}
          >
            {isLoading && trades.length === 0 ? (
              <p className="text-muted-foreground text-sm">Loading trades...</p>
            ) : (
              <TradesTable
                trades={trades}
                showAccount={!(appliedFilters.accountId || accountId)}
                emptyMessage="No trades match these filters."
                selectable
                selectedTradeIds={selectedTradeIds}
                onSelectedTradeIdsChange={setSelectedTradeIds}
                sortable
                sort={appliedFilters.sort}
                onSortChange={handleSortChange}
              />
            )}
          </div>

          <div className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground text-sm">
              Showing up to {PAGE_SIZE} trades per page
            </p>

            {meta.totalPages > 1 ? (
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || isLoading}
                  onClick={() =>
                    void loadTrades(page - 1, pageSize, filtersWithAccount())
                  }
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
                  onClick={() =>
                    void loadTrades(page + 1, pageSize, filtersWithAccount())
                  }
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
