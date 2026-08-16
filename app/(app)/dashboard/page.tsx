import { DashboardManager } from "@/components/dashboard/dashboard-manager";
import { EMPTY_ANALYTICS_SUMMARY } from "@/lib/analytics/empty-summary";
import { listAccounts } from "@/lib/api/accounts";
import {
  getAnalyticsSummary,
  getInstrumentPerformance,
  getStrategyPerformance,
} from "@/lib/api/analytics";
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

async function loadAnalytics(accountId?: string) {
  const query = buildTradingAccountQuery(accountId);

  const [summaryResponse, instrumentsResponse, strategiesResponse] =
    await Promise.all([
      getAnalyticsSummary(getServerAuthToken, query),
      getInstrumentPerformance(getServerAuthToken, query),
      getStrategyPerformance(getServerAuthToken, query),
    ]);

  return {
    summary: summaryResponse.data,
    instruments: instrumentsResponse.data,
    strategies: strategiesResponse.data,
  };
}

export default async function DashboardPage() {
  let accounts: TradingAccount[] = [];
  let summary: AnalyticsSummary = EMPTY_ANALYTICS_SUMMARY;
  let instruments: InstrumentPerformance[] = [];
  let strategies: StrategyPerformance[] = [];
  let recentTrades: Trade[] = [];
  let openTrades: Trade[] = [];

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
    const analytics = await loadAnalytics(selectedAccountId);
    summary = analytics.summary;
    instruments = analytics.instruments;
    strategies = analytics.strategies;
  } catch {
    summary = EMPTY_ANALYTICS_SUMMARY;
    instruments = [];
    strategies = [];
  }

  try {
    const query = buildTradingAccountQuery(selectedAccountId);
    const [tradesResponse, openTradesResponse] = await Promise.all([
      listTrades(getServerAuthToken, {
        limit: 5,
        sort: "openedAt_desc",
        ...query,
      }),
      listTrades(getServerAuthToken, {
        status: "OPEN",
        limit: 5,
        sort: "openedAt_desc",
        ...query,
      }),
    ]);
    recentTrades = tradesResponse.data;
    openTrades = openTradesResponse.data;
  } catch {
    recentTrades = [];
    openTrades = [];
  }

  return (
    <DashboardManager
      accounts={accounts}
      initialSummary={summary}
      initialInstruments={instruments}
      initialStrategies={strategies}
      initialRecentTrades={recentTrades}
      openTrades={openTrades}
    />
  );
}
