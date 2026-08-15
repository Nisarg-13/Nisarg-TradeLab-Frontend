import { apiRequest } from "./client";
import type {
  ApiDataResponse,
  RiskSettings,
  TradingAccount,
} from "@/types/account";

export type CreateAccountInput = {
  name: string;
  type: TradingAccount["type"];
  brokerName?: string;
  currency: string;
  startingBalance: number;
  currentBalance?: number;
};

export type UpdateAccountInput = Partial<
  Pick<
    CreateAccountInput,
    "name" | "type" | "brokerName" | "currency" | "currentBalance"
  >
>;

export type UpdateRiskSettingsInput = Partial<{
  defaultRiskPercentage: number;
  maxRiskPerTradePercentage: number;
  maxDailyRiskPercentage: number;
  maxDailyLossPercentage: number;
  maxOpenRiskPercentage: number;
  maxTradesPerDay: number;
  maxConsecutiveLosses: number;
  strictMode: boolean;
}>;

export async function listAccounts(
  getAuthToken: () => Promise<string | null>,
  includeArchived = false,
) {
  const query = includeArchived ? "?includeArchived=true" : "";
  return apiRequest<ApiDataResponse<TradingAccount[]>>(
    `/api/v1/accounts${query}`,
    { getAuthToken },
  );
}

export async function createAccount(
  getAuthToken: () => Promise<string | null>,
  input: CreateAccountInput,
) {
  return apiRequest<ApiDataResponse<TradingAccount>>("/api/v1/accounts", {
    method: "POST",
    body: JSON.stringify(input),
    getAuthToken,
  });
}

export async function updateAccount(
  getAuthToken: () => Promise<string | null>,
  accountId: string,
  input: UpdateAccountInput,
) {
  return apiRequest<ApiDataResponse<TradingAccount>>(
    `/api/v1/accounts/${accountId}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
      getAuthToken,
    },
  );
}

export async function archiveAccount(
  getAuthToken: () => Promise<string | null>,
  accountId: string,
) {
  return apiRequest<ApiDataResponse<TradingAccount>>(
    `/api/v1/accounts/${accountId}/archive`,
    {
      method: "POST",
      getAuthToken,
    },
  );
}

export async function updateRiskSettings(
  getAuthToken: () => Promise<string | null>,
  accountId: string,
  input: UpdateRiskSettingsInput,
) {
  return apiRequest<ApiDataResponse<RiskSettings>>(
    `/api/v1/accounts/${accountId}/risk-settings`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
      getAuthToken,
    },
  );
}
