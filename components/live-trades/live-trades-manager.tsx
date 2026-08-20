"use client";

import { useMemo } from "react";
import { OpenPositionsCard } from "@/components/live-trades/open-positions-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
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
import { TableSkeleton } from "@/components/ui/skeleton";
import { LIVE_TRADES_POLL_INTERVAL_MS } from "@/lib/live-trades/constants";
import { useLiveTradesRefresh } from "@/lib/hooks/use-live-trades-refresh";
import {
  useInitialPersistedAccountLoad,
  usePersistedAccountId,
} from "@/lib/hooks/use-persisted-account-id";
import { useFormatDateTime } from "@/lib/hooks/use-format-datetime";
import { cn } from "@/lib/utils";
import type { TradingAccount } from "@/types/account";
import type {
  LiveDataStatus,
  LiveTradeConnection,
  LiveTradesResponse,
} from "@/types/live-trades";

function liveStatusTone(status: LiveDataStatus) {
  switch (status) {
    case "LIVE":
      return "border-profit/30 bg-profit/10 text-profit";
    case "STALE":
      return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    default:
      return "border-loss/30 bg-loss/10 text-loss";
  }
}

function ConnectionStatusCard({
  liveStatus,
  connections,
}: {
  liveStatus: LiveDataStatus;
  connections: LiveTradeConnection[];
}) {
  return (
    <Card>
      <CardHeader className="gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Connection status</CardTitle>
          <CardDescription>
            Backend determines whether MT5 data is live, stale, or disconnected.
          </CardDescription>
        </div>
        <Badge className={liveStatusTone(liveStatus)}>{liveStatus}</Badge>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {connections.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No MT5 connections yet. Generate a connection key from Accounts.
          </p>
        ) : (
          connections.map((connection) => (
            <div
              key={connection.connectionId}
              className="rounded-lg border px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{connection.tradingAccountName}</p>
                <Badge className={liveStatusTone(connection.liveStatus)}>
                  {connection.liveStatus}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                {connection.mt5Login ?? "Not paired"} ·{" "}
                {connection.serverName ?? "No server"}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Last heartbeat:{" "}
                {connection.lastHeartbeatAt
                  ? new Date(connection.lastHeartbeatAt).toLocaleString()
                  : "Never"}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Last price snapshot:{" "}
                {connection.lastSnapshotAt
                  ? new Date(connection.lastSnapshotAt).toLocaleString()
                  : "Never"}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function LiveTradesManager({
  accounts,
  initialData,
}: {
  accounts: TradingAccount[];
  initialData: LiveTradesResponse;
}) {
  const { format: formatDateTime } = useFormatDateTime();
  const { accountId, setAccountId, isReady } = usePersistedAccountId(accounts);

  const {
    data,
    positions,
    filteredConnections,
    lastRefreshedAt,
    lastMt5SnapshotAt,
    isRefreshing,
    refreshLiveTrades,
  } = useLiveTradesRefresh({
    accountId,
    initialData,
    isReady,
  });

  const accountOptions = useMemo(
    () => [
      { value: "", label: "All accounts" },
      ...accounts.map((account) => ({
        value: account.id,
        label: account.name,
      })),
    ],
    [accounts],
  );

  useInitialPersistedAccountLoad(
    isReady,
    () => refreshLiveTrades(),
    Boolean(accountId),
  );

  const pollIntervalSeconds = LIVE_TRADES_POLL_INTERVAL_MS / 1_000;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <PageHeader
            eyebrow="Monitor"
            title="Live trades"
            description="Monitor open positions, floating PnL, and MT5 sync status."
          />
          <p className="text-muted-foreground text-xs">
            MT5 data last received{" "}
            {lastMt5SnapshotAt ? formatDateTime(lastMt5SnapshotAt) : "never"}.
            UI refetches every {pollIntervalSeconds}s
            {lastRefreshedAt
              ? ` · last UI refresh ${formatDateTime(lastRefreshedAt)}`
              : ""}
            .
          </p>
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
            onClick={() => void refreshLiveTrades()}
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <ConnectionStatusCard
        liveStatus={data.liveStatus}
        connections={filteredConnections}
      />

      {isRefreshing && positions.length === 0 ? (
        <Card>
          <CardContent className="py-6">
            <TableSkeleton rows={4} />
          </CardContent>
        </Card>
      ) : (
        <OpenPositionsCard positions={positions} />
      )}

      {data.liveStatus === "STALE" ? (
        <p className={cn("text-sm", liveStatusTone("STALE"))}>
          Live prices may be stale or missing. Check that the MT5 EA is running
          and that &quot;Last price snapshot&quot; is updating on the connection
          card above.
        </p>
      ) : null}
    </div>
  );
}
