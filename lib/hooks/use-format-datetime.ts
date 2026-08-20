"use client";

import { useCallback } from "react";

import { useTimezone } from "@/components/providers/timezone-provider";
import {
  formatAppDateTime,
  formatDateTime,
  formatDateTimeWithSeconds,
} from "@/lib/formatting/datetime";

export function useFormatDateTime() {
  const { timezone } = useTimezone();

  const formatWithSeconds = useCallback(
    (value: string | null | undefined) =>
      formatDateTimeWithSeconds(value, timezone),
    [timezone],
  );

  const format = useCallback(
    (value: string | null | undefined) => formatDateTime(value, timezone),
    [timezone],
  );

  const formatApp = useCallback(
    (value: string | null | undefined) => formatAppDateTime(value, timezone),
    [timezone],
  );

  return {
    timezone,
    format,
    formatApp,
    formatWithSeconds,
  };
}
