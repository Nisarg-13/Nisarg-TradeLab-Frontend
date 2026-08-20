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
import { usePersistedAccountId } from "@/lib/hooks/use-persisted-account-id";
import { shouldSkipServerMatchedAccountLoad } from "@/lib/preferences/server-account-load";
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

  if (filters.accountId) {
    count += 1;
  }

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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<TradeListFilters>(EMPTY_FILTERS);
  const [draftFilters, setDraftFilters] =
    useState<TradeListFilters>(EMPTY_FILTERS);
  const didInitializeRef = useRef(false);

  const [page, setPage] = useState(initialMeta.page);
  const [pageSize] = useState(PAGE_SIZE);
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
      nextFilters: TradeListFilters = appliedFilters,
    ) => {
      setIsLoading(true);

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

        setTrades(response.data);
        setMeta(response.meta);
        setPage(response.meta.page);
        setAppliedFilters(nextFilters);
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
    [appliedFilters, getAuthToken, page, pageSize],
  );

  useEffect(() => {
    if (!isReady || didInitializeRef.current) {
      return;
    }

    didInitializeRef.current = true;
    const initialFilters = { ...EMPTY_FILTERS, accountId };
    setAppliedFilters(initialFilters);
    setDraftFilters(initialFilters);

    if (
      shouldSkipServerMatchedAccountLoad(accountId, serverSelectedAccountId)
    ) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadTrades(1, PAGE_SIZE, initialFilters);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [accountId, isReady, loadTrades, serverSelectedAccountId]);

  function openFilters() {
    setDraftFilters(appliedFilters);
    setFiltersOpen(true);
  }

  function applyFilters() {
    if (draftFilters.accountId !== accountId) {
      setAccountId(draftFilters.accountId);
    }

    setFiltersOpen(false);
    void loadTrades(1, pageSize, draftFilters);
  }

  function clearFilters() {
    const cleared = { ...EMPTY_FILTERS, accountId };
    setDraftFilters(cleared);
    setAppliedFilters(cleared);
    setFiltersOpen(false);
    void loadTrades(1, pageSize, cleared);
  }

  function handleSortChange(nextSort: TradeSort) {
    const nextFilters = { ...appliedFilters, sort: nextSort };
    void loadTrades(1, pageSize, nextFilters);
  }

  const activeFilterCount = countActiveFilters(appliedFilters);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Journal"
        title="Trades"
        description="Browse, filter, and review your open and closed trades."
      />

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
                <Label htmlFor="filter-account">Account</Label>
                <DropdownSelect
                  id="filter-account"
                  name="filter-account"
                  options={accountOptions}
                  value={draftFilters.accountId}
                  onValueChange={(value) =>
                    setDraftFilters((current) => ({
                      ...current,
                      accountId: value,
                    }))
                  }
                />
              </div>
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

          {isLoading ? (
            <p className="text-muted-foreground text-sm">Loading trades...</p>
          ) : (
            <TradesTable
              trades={trades}
              showAccount={!appliedFilters.accountId}
              emptyMessage="No trades match these filters."
              selectable
              selectedTradeIds={selectedTradeIds}
              onSelectedTradeIdsChange={setSelectedTradeIds}
              sortable
              sort={appliedFilters.sort}
              onSortChange={handleSortChange}
            />
          )}

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
