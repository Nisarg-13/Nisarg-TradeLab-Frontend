"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";

export function useClientAuthToken() {
  const { getToken } = useAuth();

  return useCallback(() => getToken(), [getToken]);
}
