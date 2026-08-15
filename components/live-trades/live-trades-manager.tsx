"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/page-header";
import { OpenPositionsCard } from "@/components/live-trades/open-positions-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Label } from "@/components/ui/label";
import { listTrades } from "@/lib/api/trades";
import { useClientAuthToken } from "@/lib/auth/client";
import type { TradingAccount } from "@/types/account";
import type { Trade } from "@/types/trade";

function ConnectionBanner({
  accountSource,
}: {
  accountSource: "MANUAL" | "MT5" | "MIXED";
}) {
  if (accountSource === "MT5") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connection status</CardTitle>
          <CardDescription>
            MT5 live sync will populate LIVE / STALE / DISCONNECTED states in a
            later phase.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connection status</CardTitle>
        <CardDescription>
          Showing open manual journal trades. MT5-synchronized live positions
          arrive in Phase 8–9.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-success text-sm font-medium">
          MANUAL · Journal positions are current
        </p>
      </CardContent>
    </Card>
  );
}

export function LiveTradesManager({
  accounts,
  initialOpenTrades,
}: {
  accounts: TradingAccount[];
  initialOpenTrades: Trade[];
}) {
  const router = useRouter();
  const getAuthToken = useClientAuthToken();
  const [accountId, setAccountId] = useState("");
  const [openTrades, setOpenTrades] = useState(initialOpenTrades);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string | null>(
    new Date().toISOString(),
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const accountOptions = [
    { value: "", label: "All accounts" },
    ...accounts.map((account) => ({
      value: account.id,
      label: account.name,
    })),
  ];

  const accountSource: "MANUAL" | "MT5" | "MIXED" = (() => {
    const tradeSources = new Set(openTrades.map((trade) => trade.source));

    if (tradeSources.size === 0) {
      return accounts.some((account) => account.source === "MT5")
        ? "MT5"
        : "MANUAL";
    }

    if (tradeSources.size > 1) {
      return "MIXED";
    }

    return tradeSources.has("MT5") ? "MT5" : "MANUAL";
  })();

  async function handleRefresh() {
    setIsRefreshing(true);

    try {
      const response = await listTrades(getAuthToken, {
        status: "OPEN",
        limit: 50,
        sort: "openedAt_desc",
        ...(accountId ? { tradingAccountId: accountId } : {}),
      });

      setOpenTrades(response.data);
      setLastRefreshedAt(new Date().toISOString());
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to refresh open trades.",
      );
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <PageHeader
            eyebrow="Monitor"
            title="Live trades"
            description="Monitor open positions, stop loss, take profit, and sync status."
          />
          {lastRefreshedAt ? (
            <p className="text-muted-foreground text-xs">
              Last refreshed{" "}
              {new Intl.DateTimeFormat("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(lastRefreshedAt))}
            </p>
          ) : null}
        </div>
        <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="live-account">Account</Label>
            <DropdownSelect
              id="live-account"
              name="live-account"
              options={accountOptions}
              value={accountId}
              onValueChange={setAccountId}
            />
          </div>
          <Button
            type="button"
            disabled={isRefreshing}
            onClick={() => void handleRefresh()}
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <ConnectionBanner accountSource={accountSource} />

      <OpenPositionsCard
        trades={openTrades}
        title="Open positions"
        description="Floating PnL and live MT5 prices will appear once broker sync is enabled."
      />
    </div>
  );
}
