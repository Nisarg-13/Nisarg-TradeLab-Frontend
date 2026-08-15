"use client";

import { useSyncExternalStore } from "react";

import { useTimezone } from "@/components/providers/timezone-provider";
import {
  formatClockPeriod,
  formatClockTime,
  getClockSnapshot,
  getServerClockSnapshot,
  subscribeToClock,
} from "@/lib/constants/timezones";

export function HeaderClock() {
  const { timezone } = useTimezone();
  const timestamp = useSyncExternalStore(
    subscribeToClock,
    getClockSnapshot,
    getServerClockSnapshot,
  );
  const now = timestamp !== null ? new Date(timestamp) : null;

  const time = now ? formatClockTime(now, timezone) : "--:--:--";
  const period = now ? formatClockPeriod(now, timezone) : "";

  return (
    <div
      className="text-right"
      aria-live="polite"
      aria-label={now ? `Current time in ${timezone}` : "Loading current time"}
    >
      <p
        className="font-mono text-sm font-medium tabular-nums"
        suppressHydrationWarning
      >
        {time}
        {period ? ` ${period}` : null}
      </p>
    </div>
  );
}
