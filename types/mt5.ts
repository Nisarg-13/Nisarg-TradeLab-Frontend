export type Mt5ConnectionStatus = "CONNECTED" | "DISCONNECTED" | "ERROR";

export type LiveDataStatus = "LIVE" | "STALE" | "DISCONNECTED";

export type Mt5Connection = {
  id: string;
  tradingAccountId: string;
  tradingAccount?: {
    id: string;
    name: string;
    currency: string;
    source: string;
  };
  mt5Login: string | null;
  serverName: string | null;
  brokerName: string | null;
  status: Mt5ConnectionStatus;
  lastHeartbeatAt: string | null;
  lastSyncedAt: string | null;
  lastPositionSnapshotAt?: string | null;
  liveDataStatus?: "LIVE" | "STALE" | "DISCONNECTED";
  eaVersion: string | null;
  connectionKey?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateMt5ConnectionResponse = {
  connection: Mt5Connection;
  connectionKey: string;
};

export type ApiDataResponse<T> = {
  data: T;
};
