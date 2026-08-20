import { ArrowRight } from "lucide-react";

import { EquitySparkline } from "@/components/landing/equity-sparkline";
import { LandingSection } from "@/components/landing/landing-section";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LANDING_HOW_IT_WORKS } from "@/lib/constants/landing";

export function HowItWorks() {
  return (
    <LandingSection
      variant="muted"
      title="From Trading Activity to Measurable Improvement"
      description="A structured workflow that turns raw trading history into actionable process changes."
    >
      <div className="grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-3">
        {LANDING_HOW_IT_WORKS.map((step, index) => (
          <div key={step.step} className="contents">
            <div className="bg-card hover:bg-card-hover flex flex-col items-center rounded-xl border p-6 text-center transition-all duration-300 hover:-translate-y-0.5">
              <div className="bg-primary/15 text-primary mb-4 flex size-10 items-center justify-center rounded-full text-sm font-semibold">
                {step.step}
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-muted-foreground mt-2 max-w-xs text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
            {index < LANDING_HOW_IT_WORKS.length - 1 ? (
              <div className="hidden items-center justify-center md:flex">
                <ArrowRight
                  className="text-muted-foreground size-5 shrink-0"
                  aria-hidden
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <Card className="bg-card/90 mt-10">
        <CardHeader className="text-center">
          <CardTitle className="text-base">Equity curve</CardTitle>
          <CardDescription>
            See account growth build as your process improves — sample dashboard
            view
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EquitySparkline
            className="h-44 w-full md:h-52"
            gradientId="how-it-works-equity"
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border px-4 py-3 text-center">
              <p className="text-muted-foreground text-xs">Starting balance</p>
              <p className="tabular-data font-semibold">$10,000</p>
            </div>
            <div className="rounded-lg border px-4 py-3 text-center">
              <p className="text-muted-foreground text-xs">Current balance</p>
              <p className="text-profit tabular-data font-semibold">$14,280</p>
            </div>
            <div className="rounded-lg border px-4 py-3 text-center">
              <p className="text-muted-foreground text-xs">Return</p>
              <p className="text-profit tabular-data font-semibold">+42.8%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </LandingSection>
  );
}
