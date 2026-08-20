"use client";

import { useEffect } from "react";

import { useTimezone } from "@/components/providers/timezone-provider";
import { getCurrentUser } from "@/lib/api/users";
import { useClientAuthToken } from "@/lib/auth/client";

export function TimezoneSync() {
  const getAuthToken = useClientAuthToken();
  const { setTimezone } = useTimezone();

  useEffect(() => {
    let cancelled = false;

    void getCurrentUser(getAuthToken)
      .then((response) => {
        if (!cancelled && response.data.timezone) {
          setTimezone(response.data.timezone);
        }
      })
      .catch(() => {
        // Keep UTC default from layout.
      });

    return () => {
      cancelled = true;
    };
  }, [getAuthToken, setTimezone]);

  return null;
}
