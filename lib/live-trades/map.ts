import type { Trade } from "@/types/trade";
import type { LiveTradePosition } from "@/types/live-trades";

export function mapTradeToLivePosition(trade: Trade): LiveTradePosition {
  return {
    id: trade.id,
    tradingAccountId: trade.tradingAccountId,
    tradingAccount: trade.tradingAccount,
    source: trade.source,
    symbol: trade.symbol,
    direction: trade.direction,
    status: trade.status,
    averageEntryPrice: trade.averageEntryPrice,
    currentPrice: null,
    currentStopLoss: trade.currentStopLoss,
    currentTakeProfit: trade.currentTakeProfit,
    currentVolume: trade.currentVolume,
    initialRiskAmount: trade.initialRiskAmount,
    floatingPnl: null,
    currentR: null,
    openedAt: trade.openedAt,
    lastSyncedAt: null,
    liveStatus: trade.source === "MT5" ? "DISCONNECTED" : "LIVE",
  };
}
