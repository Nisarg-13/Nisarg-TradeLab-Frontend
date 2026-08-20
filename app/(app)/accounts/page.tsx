import { AccountsManager } from "@/components/accounts/accounts-manager";
import { listMt5Connections } from "@/lib/api/mt5";
import { getServerAuthToken } from "@/lib/auth/server";
import { getServerAccounts } from "@/lib/server/app-context";
import type { Mt5Connection } from "@/types/mt5";

export default async function AccountsPage() {
  const [accounts, mt5Connections] = await Promise.all([
    getServerAccounts(),
    listMt5Connections(getServerAuthToken)
      .then((response) => response.data)
      .catch(() => [] as Mt5Connection[]),
  ]);

  return (
    <AccountsManager
      initialAccounts={accounts}
      initialMt5Connections={mt5Connections}
    />
  );
}
