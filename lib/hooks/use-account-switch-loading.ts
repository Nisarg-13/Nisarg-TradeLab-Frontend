"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useAutoReloadOnAccountChange } from "@/lib/hooks/use-auto-reload-on-account-change";

type AccountSwitchLoadingOptions = {
  skipInitial?: boolean;
  consumeSkipReload?: () => boolean;
};

export function useAccountSwitchLoading(
  isReady: boolean,
  accountId: string,
  reload: () => void | Promise<void>,
  options?: AccountSwitchLoadingOptions,
) {
  const [isAccountSwitchLoading, setIsAccountSwitchLoading] = useState(false);
  const reloadRef = useRef(reload);

  useEffect(() => {
    reloadRef.current = reload;
  }, [reload]);

  const reloadWithLoading = useCallback(async () => {
    setIsAccountSwitchLoading(true);

    try {
      await reloadRef.current();
    } finally {
      setIsAccountSwitchLoading(false);
    }
  }, []);

  useAutoReloadOnAccountChange(isReady, accountId, reloadWithLoading, options);

  return { isAccountSwitchLoading, reloadWithLoading };
}

export function resolveAccountLabel(
  accounts: Array<{ id: string; name: string }>,
  accountId: string,
) {
  if (!accountId) {
    return "All accounts";
  }

  return (
    accounts.find((account) => account.id === accountId)?.name ??
    "Selected account"
  );
}
