import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const SUMMARY_CARDS = [
  {
    label: "Net PnL",
    value: "$4,280.50",
    hint: "127 closed trades",
    tone: "text-profit",
  },
  {
    label: "Win Rate",
    value: "58.3%",
    hint: "74 wins / 53 losses",
    tone: "text-foreground",
  },
  {
    label: "Profit Factor",
    value: "1.84",
    hint: "Above 1.5 target",
    tone: "text-profit",
  },
  {
    label: "Max Drawdown",
    value: "4.2%",
    hint: "$842 peak-to-trough",
    tone: "text-loss",
  },
] as const;

const EQUITY_POINTS = [42, 48, 45, 52, 58, 55, 63, 68, 64, 72, 78, 84];

function EquitySparkline() {
  const width = 560;
  const height = 160;
  const max = Math.max(...EQUITY_POINTS);
  const min = Math.min(...EQUITY_POINTS);
  const range = max - min || 1;

  const points = EQUITY_POINTS.map((value, index) => {
    const x = (index / (EQUITY_POINTS.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 24) - 12;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-40 w-full"
      role="img"
      aria-label="Sample equity curve trending upward"
    >
      <defs>
        <linearGradient id="equity-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgb(47 140 255 / 0.35)" />
          <stop offset="100%" stopColor="rgb(47 140 255 / 0)" />
        </linearGradient>
      </defs>
      <polygon
        fill="url(#equity-fill)"
        points={`0,${height} ${points} ${width},${height}`}
      />
      <polyline
        fill="none"
        stroke="rgb(47 140 255)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function ProductPreview() {
  return (
    <section className="px-6 pb-20 md:pb-28">
      <div className="mx-auto w-full max-w-6xl">
        <div className="border-border/80 from-card/80 to-background relative overflow-hidden rounded-2xl border bg-gradient-to-b p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] md:p-6">
          <div className="border-border/60 bg-background/70 mb-4 flex items-center gap-2 rounded-lg border px-4 py-3">
            <div className="flex gap-1.5" aria-hidden>
              <span className="bg-loss/80 size-2.5 rounded-full" />
              <span className="bg-primary/80 size-2.5 rounded-full" />
              <span className="bg-success/80 size-2.5 rounded-full" />
            </div>
            <p className="text-muted-foreground mx-auto text-xs md:text-sm">
              Dashboard preview — sample performance data
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {SUMMARY_CARDS.map((card) => (
              <Card key={card.label} className="hover:bg-card-hover bg-card/90">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs tracking-wide uppercase">
                    {card.label}
                  </CardDescription>
                  <CardTitle
                    className={cn(
                      "tabular-data text-2xl font-semibold",
                      card.tone,
                    )}
                  >
                    {card.value}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-xs">{card.hint}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-card/90 mt-4">
            <CardHeader>
              <CardTitle className="text-base">Equity curve</CardTitle>
              <CardDescription>
                Rolling account growth across closed trades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EquitySparkline />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
