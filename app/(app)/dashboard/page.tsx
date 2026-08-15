import { DashboardManager } from "@/components/dashboard/dashboard-manager";
import { listAccounts } from "@/lib/api/accounts";
import {
  getAnalyticsSummary,
  getInstrumentPerformance,
  getPlanCompliance,
  getRiskStats,
  getStrategyPerformance,
} from "@/lib/api/analytics";
import { listTrades } from "@/lib/api/trades";
import { getServerAuthToken } from "@/lib/auth/server";
import type { TradingAccount } from "@/types/account";
import type {
  AnalyticsSummary,
  InstrumentPerformance,
  PlanComplianceGroup,
  RiskStatGroup,
  StrategyPerformance,
} from "@/types/analytics";
import type { Trade } from "@/types/trade";

const EMPTY_SUMMARY: AnalyticsSummary = {
  currency: "USD",
  tradeCount: 0,
  closedTradeCount: 0,
  openTradeCount: 0,
  netPnl: "0.00",
  returnPercentage: null,
  winRate: null,
  profitFactor: null,
  moneyExpectancy: null,
  rExpectancy: null,
  averageR: null,
  averageWinner: null,
  averageLoser: null,
  largestWinner: null,
  largestLoser: null,
  maxDrawdownAmount: "0.00",
  maxDrawdownPercentage: "0.00",
  currentDrawdownAmount: "0.00",
  currentDrawdownPercentage: "0.00",
  longestWinningStreak: 0,
  longestLosingStreak: 0,
  currentWinningStreak: 0,
  currentLosingStreak: 0,
  currentOpenRisk: "0.00",
  sampleConfidence: "INSUFFICIENT",
  equityCurve: [],
  calendar: [],
};

async function loadAnalytics(accountId?: string) {
  const query = accountId ? { tradingAccountId: accountId } : {};

  const [
    summaryResponse,
    instrumentsResponse,
    strategiesResponse,
    planComplianceResponse,
    riskStatsResponse,
  ] = await Promise.all([
    getAnalyticsSummary(getServerAuthToken, query),
    getInstrumentPerformance(getServerAuthToken, query),
    getStrategyPerformance(getServerAuthToken, query),
    getPlanCompliance(getServerAuthToken, query),
    getRiskStats(getServerAuthToken, query),
  ]);

  return {
    summary: summaryResponse.data,
    instruments: instrumentsResponse.data,
    strategies: strategiesResponse.data,
    planCompliance: planComplianceResponse.data,
    riskStats: riskStatsResponse.data,
  };
}

export default async function DashboardPage() {
  let accounts: TradingAccount[] = [];
  let summary: AnalyticsSummary = EMPTY_SUMMARY;
  let instruments: InstrumentPerformance[] = [];
  let strategies: StrategyPerformance[] = [];
  let planCompliance: PlanComplianceGroup[] = [];
  let riskStats: RiskStatGroup[] = [];
  let recentTrades: Trade[] = [];
  let openTrades: Trade[] = [];

  try {
    const accountsResponse = await listAccounts(getServerAuthToken);
    accounts = accountsResponse.data;
  } catch {
    accounts = [];
  }

  try {
    const analytics = await loadAnalytics(
      accounts.length === 1 ? accounts[0].id : undefined,
    );
    summary = analytics.summary;
    instruments = analytics.instruments;
    strategies = analytics.strategies;
    planCompliance = analytics.planCompliance;
    riskStats = analytics.riskStats;
  } catch {
    summary = EMPTY_SUMMARY;
    instruments = [];
    strategies = [];
    planCompliance = [];
    riskStats = [];
  }

  try {
    const [tradesResponse, openTradesResponse] = await Promise.all([
      listTrades(getServerAuthToken, {
        limit: 5,
        sort: "openedAt_desc",
      }),
      listTrades(getServerAuthToken, {
        status: "OPEN",
        limit: 5,
        sort: "openedAt_desc",
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
      initialPlanCompliance={planCompliance}
      initialRiskStats={riskStats}
      recentTrades={recentTrades}
      openTrades={openTrades}
    />
  );
}
