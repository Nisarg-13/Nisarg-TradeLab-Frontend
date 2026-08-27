"use client";

import { useEffect, useRef } from "react";

import {
  getTradeDataRefreshAt,
  TRADE_DATA_REFRESH_EVENT,
} from "@/lib/constants/trade-data-refresh";

/** Refetch client data after MT5 repair/sync mutations elsewhere in the app. */
export function useTradeDataRefresh(
  enabled: boolean,
  onRefresh: () => void | Promise<void>,
) {
  const lastHandledAtRef = useRef(0);
  const onRefreshRef = useRef(onRefresh);

  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    function handleRefreshSignal() {
      const latest = getTradeDataRefreshAt();

      if (latest <= lastHandledAtRef.current) {
        return;
      }

      lastHandledAtRef.current = latest;
      void onRefreshRef.current();
    }

    handleRefreshSignal();
    window.addEventListener(TRADE_DATA_REFRESH_EVENT, handleRefreshSignal);

    return () => {
      window.removeEventListener(TRADE_DATA_REFRESH_EVENT, handleRefreshSignal);
    };
  }, [enabled]);
}
