import { DashboardManager } from "@/components/dashboard/dashboard-manager";
import { EMPTY_ANALYTICS_SUMMARY } from "@/lib/analytics/empty-summary";
import { listAccounts } from "@/lib/api/accounts";
import {
  getAnalyticsSummary,
  getInstrumentPerformance,
  getStrategyPerformance,
} from "@/lib/api/analytics";
import { getServerCurrentUser } from "@/lib/api/users";
import { listTrades } from "@/lib/api/trades";
import { getServerAuthToken } from "@/lib/auth/server";
import {
  buildTradingAccountQuery,
  getServerSelectedAccountId,
} from "@/lib/preferences/server-selected-account";
import type { TradingAccount } from "@/types/account";
import type {
  AnalyticsSummary,
  InstrumentPerformance,
  StrategyPerformance,
} from "@/types/analytics";
import type { Trade } from "@/types/trade";

export default async function DashboardPage() {
  const [accounts] = await Promise.all([
    listAccounts(getServerAuthToken)
      .then((response) => response.data)
      .catch(() => [] as TradingAccount[]),
    getServerCurrentUser().catch(() => null),
  ]);

  const selectedAccountId = await getServerSelectedAccountId(accounts);
  const query = buildTradingAccountQuery(selectedAccountId);

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
      initialSummary={summaryResult as AnalyticsSummary}
      initialInstruments={instrumentsResult}
      initialStrategies={strategiesResult}
      initialRecentTrades={recentTradesResult}
      openTrades={openTradesResult}
    />
  );
}
