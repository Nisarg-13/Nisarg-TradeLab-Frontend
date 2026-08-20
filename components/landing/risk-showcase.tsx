import { AlertTriangle, Shield } from "lucide-react";

import { LandingSection } from "@/components/landing/landing-section";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

const RISK_RULES = [
  {
    title: "Per-trade risk cap",
    description: "Size every position from a fixed % of account balance.",
    status: "Within limit",
    tone: "text-profit",
  },
  {
    title: "Daily risk budget",
    description: "Stop opening new trades once daily loss limit is reached.",
    status: "$35 / $100 used",
    tone: "text-foreground",
  },
  {
    title: "Open risk exposure",
    description: "Track combined risk across all live positions.",
    status: "1.2% total",
    tone: "text-foreground",
  },
  {
    title: "Consecutive loss guard",
    description: "Pause after 3 losses in a row to reset execution.",
    status: "1 loss streak",
    tone: "text-profit",
  },
] as const;

export function RiskShowcase() {
  return (
    <LandingSection
      id="risk-management"
      title="Know Your Risk Before You Enter"
      description="TradeLab helps calculate position size and understand the financial impact of a trade before execution."
    >
      <div className="grid items-stretch gap-8 lg:grid-cols-2">
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

        <Card className="bg-card/90 flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="bg-primary/15 text-primary flex size-9 items-center justify-center rounded-lg">
                <Shield className="size-5" aria-hidden />
              </div>
              <div>
                <CardTitle className="text-base">
                  Account risk overview
                </CardTitle>
                <CardDescription>
                  Live guardrails before you place the next trade
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-profit/10 border-profit/20 rounded-lg border p-3">
                <p className="text-muted-foreground text-xs">Risk per trade</p>
                <p className="text-profit tabular-data text-lg font-semibold">
                  0.5%
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground text-xs">Max daily risk</p>
                <p className="tabular-data text-lg font-semibold">1.0%</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Daily risk used</span>
                  <span className="tabular-data font-medium">35%</span>
                </div>
                <div className="bg-muted h-2 overflow-hidden rounded-full">
                  <div className="bg-primary h-full w-[35%] rounded-full" />
                </div>
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Drawdown from peak
                  </span>
                  <span className="text-loss tabular-data font-medium">
                    4.2%
                  </span>
                </div>
                <div className="bg-muted h-2 overflow-hidden rounded-full">
                  <div className="bg-loss h-full w-[42%] rounded-full" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {RISK_RULES.map((rule) => (
                <div
                  key={rule.title}
                  className="bg-background/60 rounded-lg border px-3 py-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{rule.title}</p>
                      <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                        {rule.description}
                      </p>
                    </div>
                    <span
                      className={cn("shrink-0 text-xs font-medium", rule.tone)}
                    >
                      {rule.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-loss/10 border-loss/20 mt-auto flex items-start gap-2 rounded-lg border p-3">
              <AlertTriangle
                className="text-loss mt-0.5 size-4 shrink-0"
                aria-hidden
              />
              <p className="text-muted-foreground text-xs leading-relaxed">
                <span className="text-loss font-medium">
                  Risk escalation alert:
                </span>{" "}
                Last 2 trades used 0.75% instead of your 0.5% rule. TradeLab
                flags this before the next entry.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </LandingSection>
  );
}
