import { formatClockPeriod, formatClockTime } from "@/lib/constants/timezones";
import type { TradeStatus } from "@/types/trade";

type DateTimeStyleOptions = {
  dateStyle?: "full" | "long" | "medium" | "short";
  timeStyle?: "full" | "long" | "medium" | "short";
};

const HAS_TIMEZONE_SUFFIX = /(?:Z|[+-]\d{2}:\d{2})$/;

export function parseApiDateTime(value: string) {
  const normalized = HAS_TIMEZONE_SUFFIX.test(value) ? value : `${value}Z`;
  return new Date(normalized);
}

export function formatDateTime(
  value: string | null | undefined,
  timeZone: string,
  options: DateTimeStyleOptions = {
    dateStyle: "medium",
    timeStyle: "short",
  },
) {
  if (!value) {
    return "—";
  }

  const date = parseApiDateTime(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    ...options,
    timeZone,
  }).format(date);
}

/** Date + 24h clock time with AM/PM period — matches the app header clock. */
export function formatAppDateTime(
  value: string | null | undefined,
  timeZone: string,
) {
  if (!value) {
    return "—";
  }

  const date = parseApiDateTime(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const datePart = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone,
  }).format(date);
  const timePart = formatClockTime(date, timeZone);
  const period = formatClockPeriod(date, timeZone);

  return period
    ? `${datePart}, ${timePart} ${period}`
    : `${datePart}, ${timePart}`;
}

export function formatDateTimeWithSeconds(
  value: string | null | undefined,
  timeZone: string,
) {
  return formatDateTime(value, timeZone, {
    dateStyle: "medium",
    timeStyle: "medium",
  });
}

function formatDurationParts(totalSeconds: number) {
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;
  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days}d`);
  }

  if (hours > 0) {
    parts.push(`${hours}h`);
  }

  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }

  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds}s`);
  }

  return parts.join(" ");
}

export function formatTradeHoldingDuration(
  openedAt: string,
  closedAt: string | null,
  status: TradeStatus,
) {
  const opened = new Date(openedAt).getTime();
  const closed = closedAt ? new Date(closedAt).getTime() : Date.now();

  if (!Number.isFinite(opened) || !Number.isFinite(closed)) {
    return "—";
  }

  const totalSeconds = Math.max(0, Math.floor((closed - opened) / 1_000));
  const duration = formatDurationParts(totalSeconds);

  if (status === "OPEN") {
    return `${duration} (open)`;
  }

  return duration;
}
