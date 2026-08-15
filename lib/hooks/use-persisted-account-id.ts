"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getCurrentUser, updateCurrentUser } from "@/lib/api/users";
import { useClientAuthToken } from "@/lib/auth/client";
import {
  migrateLegacyAccountPreference,
  resolveAccountIdForAccounts,
} from "@/lib/preferences/selected-account";

let cachedAccountId: string | null | undefined;

export function usePersistedAccountId(accounts: Array<{ id: string }>) {
  const getAuthToken = useClientAuthToken();
  const [accountId, setAccountIdState] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadPreference() {
      try {
        if (cachedAccountId !== undefined) {
          if (!cancelled) {
            setAccountIdState(
              resolveAccountIdForAccounts(cachedAccountId ?? "", accounts),
            );
          }
          return;
        }

        const response = await getCurrentUser(getAuthToken);
        let stored = response.data.selectedTradingAccountId ?? "";

        if (!stored) {
          stored = await migrateLegacyAccountPreference(getAuthToken, accounts);
        }

        cachedAccountId = stored;
        if (!cancelled) {
          setAccountIdState(resolveAccountIdForAccounts(stored, accounts));
        }
      } catch {
        if (!cancelled) {
          setAccountIdState("");
        }
      } finally {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    }

    void loadPreference();

    return () => {
      cancelled = true;
    };
  }, [accounts, getAuthToken]);

  const setAccountId = useCallback(
    (value: string) => {
      const resolved = resolveAccountIdForAccounts(value, accounts);
      setAccountIdState(resolved);
      cachedAccountId = resolved;

      void updateCurrentUser(getAuthToken, {
        selectedTradingAccountId: resolved || null,
      }).catch(() => {
        cachedAccountId = undefined;
      });
    },
    [accounts, getAuthToken],
  );

  return { accountId, setAccountId, isReady };
}

export function useInitialPersistedAccountLoad(
  isReady: boolean,
  onLoad: () => void | Promise<void>,
  enabled = true,
) {
  const onLoadRef = useRef(onLoad);
  const didLoadRef = useRef(false);

  useEffect(() => {
    onLoadRef.current = onLoad;
  }, [onLoad]);

  useEffect(() => {
    if (!enabled || !isReady || didLoadRef.current) {
      return;
    }

    didLoadRef.current = true;
    void onLoadRef.current();
  }, [enabled, isReady]);
}
