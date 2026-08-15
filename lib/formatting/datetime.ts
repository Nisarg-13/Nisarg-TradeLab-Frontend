import type { TradeStatus } from "@/types/trade";

export function formatDateTimeWithSeconds(value: string | null | undefined) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);
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
