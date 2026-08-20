import { cache } from "react";

import { listAccounts } from "@/lib/api/accounts";
import { getServerCurrentUser } from "@/lib/api/users";
import { getServerAuthToken } from "@/lib/auth/server";
import { buildTradingAccountQuery } from "@/lib/preferences/server-selected-account";
import { resolveAccountIdForAccounts } from "@/lib/preferences/selected-account";
import type { TradingAccount } from "@/types/account";
import type { UserProfile } from "@/types/user";

export type ServerAppContext = {
  accounts: TradingAccount[];
  user: UserProfile | null;
  selectedAccountId: string | undefined;
  query: ReturnType<typeof buildTradingAccountQuery>;
};

export const getServerAccounts = cache(async (): Promise<TradingAccount[]> => {
  try {
    const response = await listAccounts(getServerAuthToken);
    return response.data;
  } catch {
    return [];
  }
});

function resolveSelectedAccountId(
  accounts: TradingAccount[],
  user: UserProfile | null,
): string | undefined {
  if (accounts.length === 0) {
    return undefined;
  }

  if (user) {
    const resolved = resolveAccountIdForAccounts(
      user.selectedTradingAccountId ?? "",
      accounts,
    );
    if (resolved) {
      return resolved;
    }
  }

  return accounts.length === 1 ? accounts[0].id : undefined;
}

/** Shared accounts + user + selected account; deduped per server request. */
export const getServerAppContext = cache(
  async (): Promise<ServerAppContext> => {
    const [accounts, userResponse] = await Promise.all([
      getServerAccounts(),
      getServerCurrentUser().catch(() => null),
    ]);

    const user = userResponse?.data ?? null;
    const selectedAccountId = resolveSelectedAccountId(accounts, user);

    return {
      accounts,
      user,
      selectedAccountId,
      query: buildTradingAccountQuery(selectedAccountId),
    };
  },
);
