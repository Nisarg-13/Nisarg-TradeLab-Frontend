import { ErrorBoundary } from "@/components/layout/error-boundary";
import { LiveTradesManager } from "@/components/live-trades/live-trades-manager";
import { getLiveTrades } from "@/lib/api/live-trades";
import { getServerAuthToken } from "@/lib/auth/server";
import { getServerAppContext } from "@/lib/server/app-context";
import type { LiveTradesResponse } from "@/types/live-trades";

const EMPTY_LIVE_TRADES: LiveTradesResponse = {
  liveStatus: "DISCONNECTED",
  connections: [],
  positions: [],
};

export default async function LiveTradesPage() {
  const { accounts, query } = await getServerAppContext();

  const liveTrades = await getLiveTrades(getServerAuthToken, query)
    .then((response) => response.data)
    .catch(() => EMPTY_LIVE_TRADES);

  return (
    <ErrorBoundary fallbackTitle="Live trades failed to load">
      <LiveTradesManager accounts={accounts} initialData={liveTrades} />
    </ErrorBoundary>
  );
}
