export function pnlTextClass(value: number | string | null | undefined) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric) || numeric === 0) {
    return "text-muted-foreground";
  }

  return numeric > 0 ? "text-profit" : "text-loss";
}

export function pnlSurfaceClass(value: number | string | null | undefined) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric) || numeric === 0) {
    return "border-border bg-muted/40 text-muted-foreground";
  }

  if (numeric > 0) {
    return "border-profit/30 bg-profit-soft/40 text-profit";
  }

  return "border-loss/30 bg-loss-soft/40 text-loss";
}
