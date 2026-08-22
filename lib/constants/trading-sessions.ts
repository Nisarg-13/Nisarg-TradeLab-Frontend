export const TRADING_SESSION_ORDER = [
  "ASIA",
  "LONDON",
  "OVERLAP",
  "NEW_YORK",
  "OFF_HOURS",
] as const;

export type TradingSessionId = (typeof TRADING_SESSION_ORDER)[number];

export const TRADING_SESSION_BANDS: Array<{
  id: TradingSessionId;
  label: string;
  shortLabel: string;
  startHour: number;
  endHour: number;
  tone: string;
}> = [
  {
    id: "ASIA",
    label: "Asia",
    shortLabel: "Asia",
    startHour: 0,
    endHour: 7,
    tone: "bg-sky-500/20 border-sky-500/40 text-sky-100",
  },
  {
    id: "LONDON",
    label: "London",
    shortLabel: "London",
    startHour: 8,
    endHour: 12,
    tone: "bg-blue-500/20 border-blue-500/40 text-blue-100",
  },
  {
    id: "OVERLAP",
    label: "London / New York overlap",
    shortLabel: "Overlap",
    startHour: 13,
    endHour: 16,
    tone: "bg-violet-500/20 border-violet-500/40 text-violet-100",
  },
  {
    id: "NEW_YORK",
    label: "New York",
    shortLabel: "New York",
    startHour: 17,
    endHour: 20,
    tone: "bg-indigo-500/20 border-indigo-500/40 text-indigo-100",
  },
  {
    id: "OFF_HOURS",
    label: "Off hours",
    shortLabel: "Off hours",
    startHour: 21,
    endHour: 23,
    tone: "bg-muted/60 border-border text-muted-foreground",
  },
];

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
