"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { getLiveTrades } from "@/lib/api/live-trades";
import { LIVE_TRADES_POLL_INTERVAL_MS } from "@/lib/live-trades/constants";
import { getLatestMt5SnapshotAt } from "@/lib/live-trades/mt5-sync-time";
import { useClientAuthToken } from "@/lib/auth/client";
import type {
  LiveTradePosition,
  LiveTradesResponse,
} from "@/types/live-trades";

export function useLiveTradesRefresh({
  accountId,
  initialData,
  isReady,
  limit,
}: {
  accountId: string;
  initialData: LiveTradesResponse;
  isReady: boolean;
  limit?: number;
}) {
  const getAuthToken = useClientAuthToken();
  const [data, setData] = useState(initialData);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string | null>(
    new Date().toISOString(),
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const fetchInFlightRef = useRef(false);

  const filteredConnections = accountId
    ? data.connections.filter(
        (connection) => connection.tradingAccountId === accountId,
      )
    : data.connections;

  const filteredPositions: LiveTradePosition[] = accountId
    ? data.positions.filter(
        (position) => position.tradingAccountId === accountId,
      )
    : data.positions;

  const positions =
    limit !== undefined ? filteredPositions.slice(0, limit) : filteredPositions;

  const lastMt5SnapshotAt = getLatestMt5SnapshotAt(filteredConnections);

  const refreshLiveTrades = useCallback(
    async (options?: { silent?: boolean }) => {
      if (fetchInFlightRef.current) {
        return;
      }

      fetchInFlightRef.current = true;

      if (!options?.silent) {
        setIsRefreshing(true);
      }

      try {
        const response = await getLiveTrades(getAuthToken, {
          tradingAccountId: accountId || undefined,
        });

        setData(response.data);
        setLastRefreshedAt(new Date().toISOString());
      } catch (error) {
        if (!options?.silent) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to refresh live trades.",
          );
        }
      } finally {
        fetchInFlightRef.current = false;
        if (!options?.silent) {
          setIsRefreshing(false);
        }
      }
    },
    [accountId, getAuthToken],
  );

  useEffect(() => {
    if (!isReady) return;

    const timeoutId = window.setTimeout(() => {
      void refreshLiveTrades({ silent: true });
    }, 0);

    const intervalId = window.setInterval(() => {
      void refreshLiveTrades({ silent: true });
    }, LIVE_TRADES_POLL_INTERVAL_MS);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [accountId, isReady, refreshLiveTrades]);

  return {
    data,
    positions,
    filteredConnections,
    lastRefreshedAt,
    lastMt5SnapshotAt,
    isRefreshing,
    refreshLiveTrades,
  };
}
