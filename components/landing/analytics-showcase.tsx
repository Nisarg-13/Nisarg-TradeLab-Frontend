import { LandingSection } from "@/components/landing/landing-section";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LANDING_ANALYTICS_CATEGORIES,
  LANDING_ANALYTICS_SECTION,
} from "@/lib/constants/landing";
import { cn } from "@/lib/utils";

const SAMPLE_ROWS = [
  {
    label: "EURUSD",
    value: "+$1,240",
    winRate: 62,
    tone: "text-profit",
    bar: "bg-profit",
  },
  {
    label: "XAUUSD",
    value: "+$860",
    winRate: 58,
    tone: "text-profit",
    bar: "bg-profit",
  },
  {
    label: "GBPUSD",
    value: "-$320",
    winRate: 44,
    tone: "text-loss",
    bar: "bg-loss",
  },
  {
    label: "NAS100",
    value: "+$540",
    winRate: 55,
    tone: "text-profit",
    bar: "bg-profit",
  },
  {
    label: "USDJPY",
    value: "+$210",
    winRate: 51,
    tone: "text-profit",
    bar: "bg-profit",
  },
  {
    label: "US30",
    value: "-$180",
    winRate: 39,
    tone: "text-loss",
    bar: "bg-loss",
  },
] as const;

const SESSION_ROWS = [
  { session: "New York", pnl: "+$1,420", trades: 48, tone: "text-profit" },
  { session: "London", pnl: "+$640", trades: 41, tone: "text-profit" },
  { session: "Asia", pnl: "-$220", trades: 38, tone: "text-loss" },
] as const;

export function AnalyticsShowcase() {
  return (
    <LandingSection
      id="analytics"
      title={LANDING_ANALYTICS_SECTION.title}
      description={LANDING_ANALYTICS_SECTION.description}
    >
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <ul className="grid gap-2 sm:grid-cols-2">
            {LANDING_ANALYTICS_CATEGORIES.map((item, index) => (
              <li
                key={item}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm",
                  index === 0
                    ? "bg-primary/10 text-primary border-primary/30 font-medium"
                    : "text-muted-foreground bg-card/60",
                )}
              >
                {item}
              </li>
            ))}
          </ul>

          <Card className="bg-card/90">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Session performance</CardTitle>
              <CardDescription>Where your edge shows up most</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {SESSION_ROWS.map((row) => (
                <div
                  key={row.session}
                  className="flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm"
                >
                  <div>
                    <p className="font-medium">{row.session}</p>
                    <p className="text-muted-foreground text-xs">
                      {row.trades} trades
                    </p>
                  </div>
                  <span className={cn("tabular-data font-semibold", row.tone)}>
                    {row.pnl}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/90">
          <CardHeader>
            <CardTitle className="text-base">Instrument performance</CardTitle>
            <CardDescription>Sample closed-trade breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {SAMPLE_ROWS.map((row) => (
              <div
                key={row.label}
                className="bg-background/60 rounded-lg border px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{row.label}</span>
                  <span className={cn("tabular-data font-semibold", row.tone)}>
                    {row.value}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
                    <div
                      className={cn("h-full rounded-full", row.bar)}
                      style={{ width: `${row.winRate}%` }}
                    />
                  </div>
                  <span className="text-muted-foreground tabular-data text-xs">
                    {row.winRate}% WR
                  </span>
                </div>
              </div>
            ))}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-profit/10 border-profit/20 rounded-lg border p-3">
                <p className="text-muted-foreground text-xs">Expectancy</p>
                <p className="text-profit tabular-data text-lg font-semibold">
                  +0.42R
                </p>
              </div>
              <div className="bg-loss/10 border-loss/20 rounded-lg border p-3">
                <p className="text-muted-foreground text-xs">Max DD</p>
                <p className="text-loss tabular-data text-lg font-semibold">
                  4.2%
                </p>
              </div>
              <div className="bg-profit/10 border-profit/20 rounded-lg border p-3">
                <p className="text-muted-foreground text-xs">Plan compliance</p>
                <p className="text-profit tabular-data text-lg font-semibold">
                  71%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </LandingSection>
  );
}
