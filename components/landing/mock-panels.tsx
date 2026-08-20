import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MockAiInsightCard } from "@/components/landing/mock-ai-insight-card";
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
  const height = 140;
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
      className="h-36 w-full"
      role="img"
      aria-label="Sample equity curve"
    >
      <defs>
        <linearGradient id="landing-equity-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgb(47 140 255 / 0.35)" />
          <stop offset="100%" stopColor="rgb(47 140 255 / 0)" />
        </linearGradient>
      </defs>
      <polygon
        fill="url(#landing-equity-fill)"
        points={`0,${height} ${points} ${width},${height}`}
      />
      <polyline
        fill="none"
        stroke="rgb(47 140 255)"
        strokeWidth="3"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
}

export function MockDashboardPanel() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {SUMMARY_CARDS.map((card) => (
          <Card key={card.label} className="bg-card/90">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs tracking-wide uppercase">
                {card.label}
              </CardDescription>
              <CardTitle
                className={cn("tabular-data text-xl font-semibold", card.tone)}
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
      <Card className="bg-card/90">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Equity curve</CardTitle>
        </CardHeader>
        <CardContent>
          <EquitySparkline />
        </CardContent>
      </Card>
    </div>
  );
}

const ANALYTICS_ROWS = [
  { label: "EURUSD", value: "+$1,240", tone: "text-profit" },
  { label: "XAUUSD", value: "+$860", tone: "text-profit" },
  { label: "GBPUSD", value: "-$320", tone: "text-loss" },
  { label: "NAS100", value: "+$540", tone: "text-profit" },
] as const;

export function MockAnalyticsPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="bg-card/90">
        <CardHeader>
          <CardTitle className="text-base">Instrument performance</CardTitle>
          <CardDescription>Sample closed-trade breakdown</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {ANALYTICS_ROWS.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm"
            >
              <span>{row.label}</span>
              <span className={cn("tabular-data font-semibold", row.tone)}>
                {row.value}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="bg-card/90">
        <CardHeader>
          <CardTitle className="text-base">Session heatmap</CardTitle>
          <CardDescription>Best trading hours — sample</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-1.5">
            {Array.from({ length: 20 }, (_, index) => (
              <div
                key={index}
                className={cn(
                  "aspect-square rounded-sm",
                  index % 5 === 0
                    ? "bg-profit/40"
                    : index % 3 === 0
                      ? "bg-profit/20"
                      : index % 4 === 0
                        ? "bg-loss/25"
                        : "bg-muted",
                )}
                aria-hidden
              />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-profit/10 border-profit/20 rounded-lg border p-3">
              <p className="text-muted-foreground text-xs">Best session</p>
              <p className="text-profit text-sm font-medium">New York</p>
            </div>
            <div className="bg-loss/10 border-loss/20 rounded-lg border p-3">
              <p className="text-muted-foreground text-xs">Weakest session</p>
              <p className="text-loss text-sm font-medium">London open</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function MockAiCoachPanel() {
  return <MockAiInsightCard />;
}

export function MockTradeDetailPanel() {
  return (
    <Card className="bg-card/90">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">EURUSD · Long</CardTitle>
            <CardDescription>Closed · Breakout continuation</CardDescription>
          </div>
          <span className="text-profit tabular-data text-lg font-semibold">
            +$186.40
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Entry", "1.08420"],
            ["Stop Loss", "1.08280"],
            ["Take Profit", "1.08710"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border px-3 py-2.5">
              <p className="text-muted-foreground text-xs">{label}</p>
              <p className="tabular-data font-medium">{value}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border px-3 py-2.5">
            <p className="text-muted-foreground text-xs">Strategy</p>
            <p className="text-sm">NY Open Momentum</p>
          </div>
          <div className="rounded-lg border px-3 py-2.5">
            <p className="text-muted-foreground text-xs">Plan compliance</p>
            <p className="text-profit text-sm font-medium">Followed plan</p>
          </div>
        </div>
        <div className="rounded-lg border px-3 py-3">
          <p className="text-muted-foreground mb-1 text-xs">Journal note</p>
          <p className="text-sm leading-relaxed">
            Waited for pullback into prior high. Risk was 0.5% with clean
            structure and no impulse entry.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
