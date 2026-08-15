import { AccountsManager } from "@/components/accounts/accounts-manager";
import { listAccounts } from "@/lib/api/accounts";
import { getServerAuthToken } from "@/lib/auth/server";
import type { TradingAccount } from "@/types/account";

export default async function AccountsPage() {
  let accounts: TradingAccount[] = [];

  try {
    const response = await listAccounts(getServerAuthToken);
    accounts = response.data;
  } catch {
    accounts = [];
  }

  return <AccountsManager initialAccounts={accounts} />;
}
