export type SampleConfidence = "HIGH" | "MODERATE" | "LOW" | "INSUFFICIENT";

export type AiPeriodPreset =
  "all_time" | "yesterday" | "last_week" | "last_month";

export type AiAnalysis = {
  id: string;
  tradingAccountId: string | null;
  sampleSize: number;
  sampleConfidence: SampleConfidence;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  patterns: string[];
  recommendations: string[];
  rulesForNextTrades: string[];
  dataLimitations: string[];
  source: "openai" | "gemini" | "analytics";
  fallbackReason: string | null;
  periodLabel?: string | null;
  periodPreset?: AiPeriodPreset | null;
  createdAt: string;
};

export type AiChatAnswer = {
  intent: string;
  confidence: SampleConfidence;
  summary: string;
  strengths?: string[];
  weaknesses?: string[];
  avoid?: string[];
  focus?: string[];
  instruments?: string[];
  evidence?: string[];
  limitations?: string[];
  timezone?: string | null;
  periodLabel?: string | null;
};

export type AiChatMessage = {
  id: string;
  tradingAccountId: string | null;
  periodPreset?: AiPeriodPreset | null;
  question: string;
  answer: AiChatAnswer;
  createdAt: string;
};

export type AiScopeQuery = {
  tradingAccountId?: string;
  periodPreset?: AiPeriodPreset;
};

export type AiAnalysisQuery = AiScopeQuery;

export type AiChatInput = AiScopeQuery & {
  question: string;
};

export type ApiDataResponse<T> = {
  data: T;
};
