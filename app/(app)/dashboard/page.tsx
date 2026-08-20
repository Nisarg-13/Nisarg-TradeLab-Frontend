import { DashboardManager } from "@/components/dashboard/dashboard-manager";
import { EMPTY_ANALYTICS_SUMMARY } from "@/lib/analytics/empty-summary";
import {
  getAnalyticsSummary,
  getInstrumentPerformance,
  getStrategyPerformance,
} from "@/lib/api/analytics";
import { listTrades } from "@/lib/api/trades";
import { getServerAuthToken } from "@/lib/auth/server";
import { getServerAppContext } from "@/lib/server/app-context";
import type {
  InstrumentPerformance,
  StrategyPerformance,
} from "@/types/analytics";
import type { Trade } from "@/types/trade";

export default async function DashboardPage() {
  const { accounts, query } = await getServerAppContext();

  const [
    summaryResult,
    instrumentsResult,
    strategiesResult,
    recentTradesResult,
    openTradesResult,
  ] = await Promise.all([
    getAnalyticsSummary(getServerAuthToken, query)
      .then((response) => response.data)
      .catch(() => EMPTY_ANALYTICS_SUMMARY),
    getInstrumentPerformance(getServerAuthToken, query)
      .then((response) => response.data)
      .catch(() => [] as InstrumentPerformance[]),
    getStrategyPerformance(getServerAuthToken, query)
      .then((response) => response.data)
      .catch(() => [] as StrategyPerformance[]),
    listTrades(getServerAuthToken, {
      limit: 5,
      sort: "openedAt_desc",
      ...query,
    })
      .then((response) => response.data)
      .catch(() => [] as Trade[]),
    listTrades(getServerAuthToken, {
      status: "OPEN",
      limit: 5,
      sort: "openedAt_desc",
      ...query,
    })
      .then((response) => response.data)
      .catch(() => [] as Trade[]),
  ]);

  return (
    <DashboardManager
      accounts={accounts}
      initialSummary={summaryResult}
      initialInstruments={instrumentsResult}
      initialStrategies={strategiesResult}
      initialRecentTrades={recentTradesResult}
      openTrades={openTradesResult}
    />
  );
}
