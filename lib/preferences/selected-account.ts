import { updateCurrentUser } from "@/lib/api/users";

const STORAGE_KEY = "tradelab.selected-account-id";
const ALL_ACCOUNTS_VALUE = "__all__";

export function readLegacyAccountId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored === null) {
    return null;
  }

  return stored === ALL_ACCOUNTS_VALUE ? "" : stored;
}

export function clearLegacyAccountPreference() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
}

export function resolveAccountIdForAccounts(
  accountId: string,
  accounts: Array<{ id: string }>,
) {
  if (!accountId) {
    return "";
  }

  return accounts.some((account) => account.id === accountId) ? accountId : "";
}

export async function migrateLegacyAccountPreference(
  getAuthToken: () => Promise<string | null>,
  accounts: Array<{ id: string }>,
) {
  const legacy = readLegacyAccountId();

  if (legacy === null) {
    return "";
  }

  const resolved = resolveAccountIdForAccounts(legacy, accounts);

  try {
    await updateCurrentUser(getAuthToken, {
      selectedTradingAccountId: resolved || null,
    });
    clearLegacyAccountPreference();
  } catch {
    return resolved;
  }

  return resolved;
}
