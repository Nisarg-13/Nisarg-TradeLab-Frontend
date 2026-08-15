import { TradesManager } from "@/components/trades/trades-manager";
import { listAccounts } from "@/lib/api/accounts";
import { listTrades } from "@/lib/api/trades";
import { getServerAuthToken } from "@/lib/auth/server";
import type { TradingAccount } from "@/types/account";
import type { Trade } from "@/types/trade";

export default async function TradesPage() {
  let trades: Trade[] = [];
  let meta = { page: 1, limit: 10, total: 0, totalPages: 1 };
  let accounts: TradingAccount[] = [];

  try {
    const [tradesResponse, accountsResponse] = await Promise.all([
      listTrades(getServerAuthToken, { sort: "openedAt_desc", limit: 10 }),
      listAccounts(getServerAuthToken),
    ]);
    trades = tradesResponse.data;
    meta = tradesResponse.meta;
    accounts = accountsResponse.data;
  } catch {
    trades = [];
    accounts = [];
  }

  return (
    <TradesManager
      initialTrades={trades}
      initialMeta={meta}
      accounts={accounts}
    />
  );
}
