import { AccountsManager } from "@/components/accounts/accounts-manager";
import { listAccounts } from "@/lib/api/accounts";
import { listMt5Connections } from "@/lib/api/mt5";
import { getServerAuthToken } from "@/lib/auth/server";
import type { TradingAccount } from "@/types/account";
import type { Mt5Connection } from "@/types/mt5";

export default async function AccountsPage() {
  let accounts: TradingAccount[] = [];
  let mt5Connections: Mt5Connection[] = [];

  try {
    const response = await listAccounts(getServerAuthToken);
    accounts = response.data;
  } catch {
    accounts = [];
  }

  try {
    const response = await listMt5Connections(getServerAuthToken);
    mt5Connections = response.data;
  } catch {
    mt5Connections = [];
  }

  return (
    <AccountsManager
      initialAccounts={accounts}
      initialMt5Connections={mt5Connections}
    />
  );
}
