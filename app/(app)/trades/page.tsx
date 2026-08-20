import { TradesManager } from "@/components/trades/trades-manager";
import { listTrades } from "@/lib/api/trades";
import { getServerAuthToken } from "@/lib/auth/server";
import { getServerAppContext } from "@/lib/server/app-context";
import type { Trade } from "@/types/trade";

export default async function TradesPage() {
  const { accounts, query } = await getServerAppContext();

  const tradesResult = await listTrades(getServerAuthToken, {
    sort: "openedAt_desc",
    limit: 10,
    ...query,
  })
    .then((response) => ({
      trades: response.data,
      meta: response.meta,
    }))
    .catch(() => ({
      trades: [] as Trade[],
      meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
    }));

  return (
    <TradesManager
      initialTrades={tradesResult.trades}
      initialMeta={tradesResult.meta}
      accounts={accounts}
    />
  );
}
