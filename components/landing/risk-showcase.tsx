import { LandingSection } from "@/components/landing/landing-section";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CALCULATOR_ROWS = [
  ["Account Balance", "$10,000"],
  ["Risk", "0.5%"],
  ["Risk Amount", "$50"],
  ["Entry", "1.15820"],
  ["Stop Loss", "1.15680"],
  ["Take Profit", "1.16100"],
] as const;

const RESULT_ROWS = [
  ["Recommended Size", "0.36 lot"],
  ["Planned R:R", "1:2"],
  ["Potential Loss", "$50"],
  ["Potential Profit", "$100"],
] as const;

const RISK_HIGHLIGHTS = [
  "Per-trade risk",
  "Daily risk",
  "Open risk",
  "Consecutive losses",
  "Risk escalation",
  "Drawdown awareness",
] as const;

export function RiskShowcase() {
  return (
    <LandingSection
      id="risk-management"
      title="Know Your Risk Before You Enter"
      description="TradeLab helps calculate position size and understand the financial impact of a trade before execution."
    >
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <Card className="bg-card/90">
          <CardHeader>
            <CardTitle className="text-base">Risk calculator preview</CardTitle>
            <CardDescription>Sample position sizing output</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {CALCULATOR_ROWS.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm"
                >
                  <span className="text-muted-foreground">{label}</span>
                  <span className="tabular-data font-medium">{value}</span>
                </div>
              ))}
            </div>
            <div className="border-border/60 space-y-2 border-t pt-4">
              {RESULT_ROWS.map(([label, value]) => (
                <div
                  key={label}
                  className="bg-background/60 flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm"
                >
                  <span className="text-muted-foreground">{label}</span>
                  <span className="tabular-data font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-2 sm:grid-cols-2">
          {RISK_HIGHLIGHTS.map((item) => (
            <div
              key={item}
              className="text-muted-foreground bg-card/60 rounded-lg border px-4 py-3 text-sm"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </LandingSection>
  );
}
