import { getServerAppContext } from "@/lib/server/app-context";
import { resolveAccountIdForAccounts } from "@/lib/preferences/selected-account";
import { getServerCurrentUser } from "@/lib/api/users.server";

export async function getServerSelectedAccountId(
  accounts?: Array<{ id: string }>,
): Promise<string | undefined> {
  if (!accounts) {
    const context = await getServerAppContext();
    return context.selectedAccountId;
  }

  if (accounts.length === 0) {
    return undefined;
  }

  try {
    const user = await getServerCurrentUser();
    const resolved = resolveAccountIdForAccounts(
      user.data.selectedTradingAccountId ?? "",
      accounts,
    );

    if (resolved) {
      return resolved;
    }
  } catch {
    // Fall back to single-account default below.
  }

  return accounts.length === 1 ? accounts[0].id : undefined;
}

export function buildTradingAccountQuery(accountId?: string) {
  return accountId ? { tradingAccountId: accountId } : {};
}
