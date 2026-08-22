import type { TimeAnalytics, TradeMetricsGroup } from "@/types/analytics";

export function formatHour24(hour: number) {
  const normalized = ((hour % 24) + 24) % 24;
  return `${String(normalized).padStart(2, "0")}:00`;
}

export function formatHourWindow24(startHour: number, durationHours: number) {
  const start = ((startHour % 24) + 24) % 24;
  const end = (start + durationHours) % 24;
  return `${formatHour24(start)} – ${formatHour24(end)}`;
}

export function formatTwoHourWindow24(startHour: number) {
  return formatHourWindow24(startHour, 2);
}

function relabelHourRows(rows: TradeMetricsGroup[]) {
  return rows.map((row) => ({
    ...row,
    label: formatHour24(Number(row.key)),
  }));
}

function relabelTwoHourRows(rows: TradeMetricsGroup[]) {
  return rows.map((row) => ({
    ...row,
    label: formatTwoHourWindow24(Number(row.key)),
  }));
}

/** Relabel hour-based analytics rows using 24-hour clock (matches header). */
export function applyProfileTimeLabels(time: TimeAnalytics): TimeAnalytics {
  return {
    ...time,
    hours: relabelHourRows(time.hours),
    twoHourWindows: relabelTwoHourRows(time.twoHourWindows),
  };
}

export function getCurrentTwoHourWindowStart(
  timeZone: string,
  now = new Date(),
) {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "numeric",
      hour12: false,
    }).format(now),
  );

  return Math.floor(hour / 2) * 2;
}
