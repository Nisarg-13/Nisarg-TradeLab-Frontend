import { TradesManager } from "@/components/trades/trades-manager";
import { listMistakes, listStrategies, listTags } from "@/lib/api/strategies";
import { listTrades } from "@/lib/api/trades";
import { getServerAuthToken } from "@/lib/auth/server";
import { getServerAppContext } from "@/lib/server/app-context";
import type { Mistake, Strategy, Tag } from "@/types/strategy";
import type { Trade } from "@/types/trade";

export default async function TradesPage() {
  const { accounts, query } = await getServerAppContext();

  const [tradesResult, strategiesResult, tagsResult, mistakesResult] =
    await Promise.all([
      listTrades(getServerAuthToken, {
        sort: "openedAt_desc",
        limit: 50,
        ...query,
      })
        .then((response) => ({
          trades: response.data,
          meta: response.meta,
        }))
        .catch(() => ({
          trades: [] as Trade[],
          meta: { page: 1, limit: 50, total: 0, totalPages: 1 },
        })),
      listStrategies(getServerAuthToken)
        .then((response) => response.data)
        .catch(() => [] as Strategy[]),
      listTags(getServerAuthToken)
        .then((response) => response.data)
        .catch(() => [] as Tag[]),
      listMistakes(getServerAuthToken)
        .then((response) => response.data)
        .catch(() => [] as Mistake[]),
    ]);

  return (
    <TradesManager
      initialTrades={tradesResult.trades}
      initialMeta={tradesResult.meta}
      accounts={accounts}
      strategies={strategiesResult}
      tags={tagsResult}
      mistakes={mistakesResult}
    />
  );
}
