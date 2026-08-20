import { ArrowDown } from "lucide-react";

import { LandingSection } from "@/components/landing/landing-section";
import { LANDING_HOW_IT_WORKS } from "@/lib/constants/landing";

export function HowItWorks() {
  return (
    <LandingSection
      variant="muted"
      title="From Trading Activity to Measurable Improvement"
      description="A structured workflow that turns raw trading history into actionable process changes."
    >
      <div className="flex flex-col gap-4 md:gap-6">
        {LANDING_HOW_IT_WORKS.map((step, index) => (
          <div key={step.step} className="flex flex-col items-center gap-4">
            <div className="bg-card hover:bg-card-hover w-full rounded-xl border p-6 transition-all duration-300 hover:-translate-y-0.5">
              <div className="bg-primary/15 text-primary mb-4 flex size-10 items-center justify-center rounded-full text-sm font-semibold">
                {step.step}
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
            {index < LANDING_HOW_IT_WORKS.length - 1 ? (
              <ArrowDown
                className="text-muted-foreground size-5 shrink-0"
                aria-hidden
              />
            ) : null}
          </div>
        ))}
      </div>
    </LandingSection>
  );
}
