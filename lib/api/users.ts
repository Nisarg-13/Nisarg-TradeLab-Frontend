import { cache } from "react";

import { getServerAuthToken } from "@/lib/auth/server";

import { apiRequest } from "./client";
import type { ApiDataResponse, UserProfile } from "@/types/user";

export async function getCurrentUser(
  getAuthToken: () => Promise<string | null>,
) {
  return apiRequest<ApiDataResponse<UserProfile>>("/api/v1/users/me", {
    getAuthToken,
  });
}

/** Dedupes /users/me within a single server render (layout + page). */
export const getServerCurrentUser = cache(async () => {
  return getCurrentUser(getServerAuthToken);
});

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
