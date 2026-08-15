export type LiveDataStatus = "LIVE" | "STALE" | "DISCONNECTED";

export type LiveTradeConnection = {
  connectionId: string;
  tradingAccountId: string;
  tradingAccountName: string;
  mt5Login: string | null;
  serverName: string | null;
  connectionStatus: string;
  liveStatus: LiveDataStatus;
  lastHeartbeatAt: string | null;
  lastSnapshotAt: string | null;
};

export type LiveTradePosition = {
  id: string;
  tradingAccountId: string;
  tradingAccount: {
    id: string;
    name: string;
    currency: string;
  };
  source: "MANUAL" | "MT5" | "CSV";
  symbol: string;
  direction: "LONG" | "SHORT";
  status: "OPEN" | "CLOSED" | "CANCELLED";
  averageEntryPrice: string;
  currentPrice: string | null;
  currentStopLoss: string | null;
  currentTakeProfit: string | null;
  currentVolume: string;
  initialRiskAmount: string | null;
  floatingPnl: string | null;
  currentR: string | null;
  openedAt: string;
  lastSyncedAt: string | null;
  liveStatus: LiveDataStatus;
};

export type LiveTradesResponse = {
  liveStatus: LiveDataStatus;
  connections: LiveTradeConnection[];
  positions: LiveTradePosition[];
};

export type LiveTradesQuery = {
  tradingAccountId?: string;
};

export type ApiDataResponse<T> = {
  data: T;
};
