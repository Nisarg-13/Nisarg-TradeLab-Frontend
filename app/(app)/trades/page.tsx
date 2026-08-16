import { TradesManager } from "@/components/trades/trades-manager";
import { listAccounts } from "@/lib/api/accounts";
import { listTrades } from "@/lib/api/trades";
import { getServerAuthToken } from "@/lib/auth/server";
import {
  buildTradingAccountQuery,
  getServerSelectedAccountId,
} from "@/lib/preferences/server-selected-account";
import type { TradingAccount } from "@/types/account";
import type { Trade } from "@/types/trade";

export default async function TradesPage() {
  let trades: Trade[] = [];
  let meta = { page: 1, limit: 10, total: 0, totalPages: 1 };
  let accounts: TradingAccount[] = [];

  try {
    const accountsResponse = await listAccounts(getServerAuthToken);
    accounts = accountsResponse.data;
  } catch {
    accounts = [];
  }

  const selectedAccountId = await getServerSelectedAccountId(
    getServerAuthToken,
    accounts,
  );

  try {
    const tradesResponse = await listTrades(getServerAuthToken, {
      sort: "openedAt_desc",
      limit: 10,
      ...buildTradingAccountQuery(selectedAccountId),
    });
    trades = tradesResponse.data;
    meta = tradesResponse.meta;
  } catch {
    trades = [];
  }

  return (
    <TradesManager
      initialTrades={trades}
      initialMeta={meta}
      accounts={accounts}
    />
  );
}
