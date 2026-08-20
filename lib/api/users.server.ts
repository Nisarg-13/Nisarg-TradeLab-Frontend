import "server-only";

import { cache } from "react";

import { getServerAuthToken } from "@/lib/auth/server";

import { getCurrentUser } from "./users";

/** Dedupes /users/me within a single server render (layout + page). */
export const getServerCurrentUser = cache(async () => {
  return getCurrentUser(getServerAuthToken);
});
