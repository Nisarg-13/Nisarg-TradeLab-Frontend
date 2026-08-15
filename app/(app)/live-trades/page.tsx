import { LiveTradesManager } from "@/components/live-trades/live-trades-manager";
import { listAccounts } from "@/lib/api/accounts";
import { listTrades } from "@/lib/api/trades";
import { getServerAuthToken } from "@/lib/auth/server";
import type { TradingAccount } from "@/types/account";
import type { Trade } from "@/types/trade";

export default async function LiveTradesPage() {
  let accounts: TradingAccount[] = [];
  let openTrades: Trade[] = [];

  try {
    const accountsResponse = await listAccounts(getServerAuthToken);
    accounts = accountsResponse.data;
  } catch {
    accounts = [];
  }

  try {
    const tradesResponse = await listTrades(getServerAuthToken, {
      status: "OPEN",
      limit: 50,
      sort: "openedAt_desc",
    });
    openTrades = tradesResponse.data;
  } catch {
    openTrades = [];
  }

  return (
    <LiveTradesManager accounts={accounts} initialOpenTrades={openTrades} />
  );
}
