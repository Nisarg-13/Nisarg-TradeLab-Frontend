import type { AssetClass } from "./instrument";
import type { TradeDirection } from "./risk";

export type TradeSource = "MANUAL" | "MT5" | "CSV";
export type TradeStatus = "OPEN" | "CLOSED" | "CANCELLED";
export type ExecutionType = "ENTRY" | "EXIT";
export type TradeEventType =
  | "OPENED"
  | "SL_CHANGED"
  | "TP_CHANGED"
  | "VOLUME_CHANGED"
  | "PARTIAL_CLOSE"
  | "BREAKEVEN"
  | "CLOSED";
export type TradeEmotion =
  | "CALM"
  | "CONFIDENT"
  | "FEAR"
  | "FOMO"
  | "GREED"
  | "IMPATIENT"
  | "REVENGE"
  | "OTHER";

export type TradeAccountSummary = {
  id: string;
  name: string;
  currency: string;
};

export type TradeStrategySummary = {
  id: string;
  name: string;
};

export type TradeTagSummary = {
  id: string;
  name: string;
};

export type TradeMistakeSummary = {
  id: string;
  name: string;
};

export type TradeExecution = {
  id: string;
  tradeId: string;
  type: ExecutionType;
  price: string;
  volume: string;
  profit: string;
  commission: string;
  swap: string;
  fee: string;
  executedAt: string;
};

export type TradeEvent = {
  id: string;
  tradeId: string;
  type: TradeEventType;
  previousValue: string | null;
  newValue: string | null;
  occurredAt: string;
  metadata: unknown;
};

export type TradeReview = {
  id: string;
  tradeId: string;
  preTradeEmotion: TradeEmotion | null;
  postTradeEmotion: TradeEmotion | null;
  confidenceScore: number | null;
  followedPlan: boolean | null;
  entryReason: string | null;
  notes: string | null;
  lesson: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Trade = {
  id: string;
  tradingAccountId: string;
  tradingAccount: TradeAccountSummary;
  source: TradeSource;
  symbol: string;
  assetClass: AssetClass;
  direction: TradeDirection;
  status: TradeStatus;
  openedAt: string;
  closedAt: string | null;
  averageEntryPrice: string;
  averageExitPrice: string | null;
  initialVolume: string;
  currentVolume: string;
  initialStopLoss: string | null;
  currentStopLoss: string | null;
  initialTakeProfit: string | null;
  currentTakeProfit: string | null;
  accountBalanceAtEntry: string | null;
  initialRiskAmount: string | null;
  initialRiskPercentage: string | null;
  plannedRR: string | null;
  grossPnl: string;
  commission: string;
  swap: string;
  fees: string;
  netPnl: string;
  realizedR: string | null;
  strategy: TradeStrategySummary | null;
  tags: TradeTagSummary[];
  mistakes: TradeMistakeSummary[];
  executions: TradeExecution[];
  events: TradeEvent[];
  review: TradeReview | null;
  createdAt: string;
  updatedAt: string;
};

export type TradeReviewInput = {
  preTradeEmotion?: TradeEmotion;
  postTradeEmotion?: TradeEmotion;
  confidenceScore?: number;
  followedPlan?: boolean;
  entryReason?: string;
  notes?: string;
  lesson?: string;
};

export type CreateTradeInput = {
  tradingAccountId: string;
  symbol: string;
  direction: TradeDirection;
  entryPrice: number;
  volume: number;
  stopLoss?: number;
  takeProfit?: number;
  executedAt?: string;
  accountBalanceAtEntry?: number;
  initialRiskAmount?: number;
  initialRiskPercentage?: number;
  plannedRR?: number;
  strategyId?: string;
  tagIds?: string[];
  mistakeIds?: string[];
  review?: TradeReviewInput;
};

export type UpdateTradeInput = {
  currentStopLoss?: number | null;
  currentTakeProfit?: number | null;
  strategyId?: string | null;
  tagIds?: string[];
  mistakeIds?: string[];
  review?: TradeReviewInput;
};

export type AddExecutionInput = {
  type: ExecutionType;
  price: number;
  volume: number;
  commission?: number;
  swap?: number;
  fee?: number;
  executedAt?: string;
};

export type CloseTradeInput = {
  price: number;
  commission?: number;
  swap?: number;
  fee?: number;
  executedAt?: string;
};

export type ListTradesQuery = {
  tradingAccountId?: string;
  symbol?: string;
  status?: TradeStatus;
  direction?: TradeDirection;
  openedFrom?: string;
  openedTo?: string;
  page?: number;
  limit?: number;
  sort?: "openedAt_desc" | "openedAt_asc" | "netPnl_desc" | "netPnl_asc";
};

export type PaginatedTradesResponse = {
  data: Trade[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ApiDataResponse<T> = {
  data: T;
};
