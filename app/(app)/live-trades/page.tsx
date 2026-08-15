import { ErrorBoundary } from "@/components/layout/error-boundary";
import { LiveTradesManager } from "@/components/live-trades/live-trades-manager";
import { listAccounts } from "@/lib/api/accounts";
import { getLiveTrades } from "@/lib/api/live-trades";
import { getServerAuthToken } from "@/lib/auth/server";
import type { TradingAccount } from "@/types/account";
import type { LiveTradesResponse } from "@/types/live-trades";

const EMPTY_LIVE_TRADES: LiveTradesResponse = {
  liveStatus: "DISCONNECTED",
  connections: [],
  positions: [],
};

export default async function LiveTradesPage() {
  let accounts: TradingAccount[] = [];
  let liveTrades: LiveTradesResponse = EMPTY_LIVE_TRADES;

  try {
    const accountsResponse = await listAccounts(getServerAuthToken);
    accounts = accountsResponse.data;
  } catch {
    accounts = [];
  }

  try {
    const liveTradesResponse = await getLiveTrades(getServerAuthToken, {
      tradingAccountId: accounts.length === 1 ? accounts[0].id : undefined,
    });
    liveTrades = liveTradesResponse.data;
  } catch {
    liveTrades = EMPTY_LIVE_TRADES;
  }

  return (
    <ErrorBoundary fallbackTitle="Live trades failed to load">
      <LiveTradesManager accounts={accounts} initialData={liveTrades} />
    </ErrorBoundary>
  );
}
