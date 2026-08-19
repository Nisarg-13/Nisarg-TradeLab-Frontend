export type SampleConfidence = "HIGH" | "MODERATE" | "LOW" | "INSUFFICIENT";

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
  createdAt: string;
};

export type AiChatAnswer = {
  intent: string;
  confidence: SampleConfidence;
  summary: string;
  evidence: string[];
  limitations: string[];
};

export type AiChatMessage = {
  id: string;
  question: string;
  answer: AiChatAnswer;
  createdAt: string;
};

export type AiAnalysisQuery = {
  tradingAccountId?: string;
};

export type AiChatInput = {
  question: string;
  tradingAccountId?: string;
};

export type ApiDataResponse<T> = {
  data: T;
};
