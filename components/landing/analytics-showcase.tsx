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
  { label: "EURUSD", value: "+$1,240", tone: "text-profit" },
  { label: "XAUUSD", value: "+$860", tone: "text-profit" },
  { label: "GBPUSD", value: "-$320", tone: "text-loss" },
  { label: "NAS100", value: "+$540", tone: "text-profit" },
] as const;

export function AnalyticsShowcase() {
  return (
    <LandingSection
      id="analytics"
      title={LANDING_ANALYTICS_SECTION.title}
      description={LANDING_ANALYTICS_SECTION.description}
    >
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {LANDING_ANALYTICS_CATEGORIES.map((item) => (
              <li
                key={item}
                className="text-muted-foreground bg-card/60 rounded-lg border px-3 py-2 text-sm"
              >
                {item}
              </li>
            ))}
          </ul>
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
                className="bg-background/60 flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <span className="font-medium">{row.label}</span>
                <span className={cn("tabular-data font-semibold", row.tone)}>
                  {row.value}
                </span>
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
