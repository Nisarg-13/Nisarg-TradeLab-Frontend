"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  createMt5Connection,
  listMt5Connections,
  recalculateMt5Trades,
  revokeMt5Connection,
} from "@/lib/api/mt5";
import { useClientAuthToken } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import type {
  LiveDataStatus,
  Mt5Connection,
  Mt5ConnectionStatus,
} from "@/types/mt5";

function statusTone(status: Mt5ConnectionStatus) {
  switch (status) {
    case "CONNECTED":
      return "border-profit/30 bg-profit/10 text-profit";
    case "ERROR":
      return "border-loss/30 bg-loss/10 text-loss";
    default:
      return "border-muted-foreground/30 bg-muted text-muted-foreground";
  }
}

function liveTone(status: LiveDataStatus) {
  switch (status) {
    case "LIVE":
      return "border-profit/30 bg-profit/10 text-profit";
    case "STALE":
      return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    default:
      return "border-loss/30 bg-loss/10 text-loss";
  }
}

export function Mt5ConnectionPanel({
  tradingAccountId,
  accountName,
  initialConnection,
}: {
  tradingAccountId: string;
  accountName: string;
  initialConnection: Mt5Connection | null;
}) {
  const getAuthToken = useClientAuthToken();
  const [connection, setConnection] = useState(initialConnection);
  const [connectionKey, setConnectionKey] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);

  async function refreshConnection() {
    const response = await listMt5Connections(getAuthToken);
    const next =
      response.data.find(
        (item) => item.tradingAccountId === tradingAccountId,
      ) ?? null;
    setConnection(next);
    return next;
  }

  async function handleCreate() {
    setIsWorking(true);

    try {
      const response = await createMt5Connection(
        getAuthToken,
        tradingAccountId,
      );
      setConnection(response.data.connection);
      setConnectionKey(response.data.connectionKey);
      toast.success(
        "MT5 connection key created. Copy it now — it won't be shown again.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create MT5 connection.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function handleRevoke() {
    if (!connection) return;

    setIsWorking(true);

    try {
      await revokeMt5Connection(getAuthToken, connection.id);
      setConnection(null);
      setConnectionKey(null);
      await refreshConnection();
      toast.success("MT5 connection revoked.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to revoke MT5 connection.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function handleRecalculateTrades() {
    if (!connection) return;

    setIsWorking(true);

    try {
      const response = await recalculateMt5Trades(
        getAuthToken,
        tradingAccountId,
      );
      toast.success(
        `Recalculated ${response.data.updated} of ${response.data.total} MT5 trades.`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to recalculate MT5 trades.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function copyKey() {
    if (!connectionKey) return;

    try {
      await navigator.clipboard.writeText(connectionKey);
      toast.success("Connection key copied.");
    } catch {
      toast.error("Unable to copy automatically. Copy the key manually.");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>MT5 Connection</CardTitle>
        <CardDescription>
          Pair the TradeLab sync EA with {accountName}. Keys are shown once at
          creation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {connection ? (
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-sm">Status</p>
              <Badge className={cn("mt-1", statusTone(connection.status))}>
                {connection.status}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">MT5 login</p>
              <p className="font-medium">
                {connection.mt5Login ?? "Not paired yet"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Server</p>
              <p className="font-medium">{connection.serverName ?? "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Live data</p>
              <Badge
                className={cn(
                  "mt-1",
                  liveTone(connection.liveDataStatus ?? "DISCONNECTED"),
                )}
              >
                {connection.liveDataStatus ?? "DISCONNECTED"}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Last sync</p>
              <p className="font-medium">
                {connection.lastSyncedAt
                  ? new Date(connection.lastSyncedAt).toLocaleString()
                  : "Never"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No MT5 connection yet. Generate a connection key and paste it into
            the TradeLab MT5 EA.
          </p>
        )}

        {connectionKey ? (
          <div className="border-primary/30 bg-primary/5 rounded-lg border p-4">
            <p className="text-sm font-medium">One-time connection key</p>
            <p className="mt-2 font-mono text-sm break-all">{connectionKey}</p>
            <Button
              type="button"
              variant="outline"
              className="mt-3"
              onClick={copyKey}
            >
              Copy key
            </Button>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          {!connection ? (
            <Button type="button" disabled={isWorking} onClick={handleCreate}>
              {isWorking ? "Creating..." : "Generate connection key"}
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                disabled={isWorking}
                onClick={handleRecalculateTrades}
              >
                {isWorking ? "Recalculating..." : "Recalculate trade PnL"}
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={isWorking}
                onClick={handleRevoke}
              >
                {isWorking ? "Revoking..." : "Revoke connection"}
              </Button>
            </>
          )}
        </div>
        {connection ? (
          <p className="text-muted-foreground text-xs">
            Use recalculate after dashboard PnL fixes if older MT5 imports show
            incorrect win rate or missing losses.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
