"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { TIMEZONE_CHANGE_EVENT } from "@/lib/constants/timezones";

type TimezoneContextValue = {
  timezone: string;
  setTimezone: (timezone: string) => void;
};

const TimezoneContext = createContext<TimezoneContextValue | null>(null);

export function TimezoneProvider({
  initialTimezone,
  children,
}: {
  initialTimezone: string;
  children: React.ReactNode;
}) {
  const [timezone, setTimezoneState] = useState(initialTimezone);

  const setTimezone = useCallback((nextTimezone: string) => {
    setTimezoneState(nextTimezone);
    window.dispatchEvent(
      new CustomEvent(TIMEZONE_CHANGE_EVENT, {
        detail: { timezone: nextTimezone },
      }),
    );
  }, []);

  const value = useMemo(
    () => ({ timezone, setTimezone }),
    [timezone, setTimezone],
  );

  return (
    <TimezoneContext.Provider value={value}>
      {children}
    </TimezoneContext.Provider>
  );
}

export function useTimezone() {
  const context = useContext(TimezoneContext);

  if (!context) {
    throw new Error("useTimezone must be used within TimezoneProvider");
  }

  return context;
}
