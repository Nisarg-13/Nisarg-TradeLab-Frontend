"use client";

import { useEffect, useState } from "react";

import { useTimezone } from "@/components/providers/timezone-provider";
import {
  formatClockPeriod,
  formatClockTime,
  TIMEZONE_CHANGE_EVENT,
} from "@/lib/constants/timezones";

export function HeaderClock() {
  const { timezone } = useTimezone();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    function handleTimezoneChange() {
      setNow(new Date());
    }

    window.addEventListener(TIMEZONE_CHANGE_EVENT, handleTimezoneChange);
    return () =>
      window.removeEventListener(TIMEZONE_CHANGE_EVENT, handleTimezoneChange);
  }, []);

  const time = formatClockTime(now, timezone);
  const period = formatClockPeriod(now, timezone);

  return (
    <div
      className="text-right"
      aria-live="polite"
      aria-label={`Current time in ${timezone}`}
    >
      <p className="font-mono text-sm font-medium tabular-nums">
        {time} {period}
      </p>
    </div>
  );
}
