import { apiRequest } from "./client";
import type { ApiDataResponse, UserProfile } from "@/types/user";

export async function getCurrentUser(
  getAuthToken: () => Promise<string | null>,
) {
  return apiRequest<ApiDataResponse<UserProfile>>("/api/v1/users/me", {
    getAuthToken,
  });
}

export async function updateCurrentUser(
  getAuthToken: () => Promise<string | null>,
  input: Partial<
    Pick<
      UserProfile,
      "timezone" | "preferredCurrency" | "selectedTradingAccountId"
    >
  >,
) {
  return apiRequest<ApiDataResponse<UserProfile>>("/api/v1/users/me", {
    method: "PATCH",
    body: JSON.stringify(input),
    getAuthToken,
  });
}
