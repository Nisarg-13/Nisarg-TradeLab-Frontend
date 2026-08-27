"use client";

import { useEffect, useRef } from "react";

export function useAutoReloadOnAccountChange(
  isReady: boolean,
  accountId: string,
  onReload: () => void | Promise<void>,
  options?: {
    skipInitial?: boolean;
    consumeSkipReload?: () => boolean;
  },
) {
  const onReloadRef = useRef(onReload);
  const skipInitialRef = useRef(options?.skipInitial ?? false);
  const consumeSkipReloadRef = useRef(options?.consumeSkipReload);
  const isFirstRunRef = useRef(true);

  useEffect(() => {
    onReloadRef.current = onReload;
  }, [onReload]);

  useEffect(() => {
    consumeSkipReloadRef.current = options?.consumeSkipReload;
  }, [options?.consumeSkipReload]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (isFirstRunRef.current) {
      isFirstRunRef.current = false;
      if (skipInitialRef.current) {
        return;
      }
    }

    if (consumeSkipReloadRef.current?.()) {
      return;
    }

    void onReloadRef.current();
  }, [accountId, isReady]);
}
