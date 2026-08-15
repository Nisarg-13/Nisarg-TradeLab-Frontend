export const TIMEZONE_CHANGE_EVENT = "tradelab-timezone-change";

export const TIMEZONE_OPTIONS = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "New York (US Eastern)" },
  { value: "America/Chicago", label: "Chicago (US Central)" },
  { value: "America/Los_Angeles", label: "Los Angeles (US Pacific)" },
  { value: "Europe/London", label: "London (UK)" },
  { value: "Europe/Berlin", label: "Berlin (Central Europe)" },
  { value: "Asia/Dubai", label: "Dubai (Gulf)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Asia/Singapore", label: "Singapore" },
  { value: "Asia/Tokyo", label: "Tokyo (Japan)" },
  { value: "Australia/Sydney", label: "Sydney (Australia)" },
] as const;

export const TIMEZONES = TIMEZONE_OPTIONS.map((option) => option.value);

export function getTimezoneOptions(currentTimezone: string) {
  const hasCurrent = TIMEZONE_OPTIONS.some(
    (option) => option.value === currentTimezone,
  );

  if (hasCurrent) {
    return [...TIMEZONE_OPTIONS];
  }

  return [
    ...TIMEZONE_OPTIONS,
    { value: currentTimezone, label: currentTimezone },
  ];
}

export function formatClockTime(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

export function formatClockPeriod(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    hour12: true,
  })
    .formatToParts(date)
    .find((part) => part.type === "dayPeriod")
    ?.value.toUpperCase();
}

export function getTimezoneLabel(timeZone: string) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "short",
    }).formatToParts(new Date());

    return (
      parts.find((part) => part.type === "timeZoneName")?.value ?? timeZone
    );
  } catch {
    return timeZone;
  }
}
