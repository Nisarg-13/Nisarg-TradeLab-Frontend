export function formatHoldingTime(minutes: string | null) {
  if (!minutes) {
    return "—";
  }

  const value = Number(minutes);

  if (!Number.isFinite(value)) {
    return "—";
  }

  if (value < 60) {
    return `${Math.round(value)} min`;
  }

  if (value < 1440) {
    const hours = value / 60;
    return hours >= 10 ? `${Math.round(hours)} hr` : `${hours.toFixed(1)} hr`;
  }

  const days = value / 1440;
  return days >= 10 ? `${Math.round(days)} days` : `${days.toFixed(1)} days`;
}
