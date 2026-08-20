import { ShieldCheck } from "lucide-react";

import { LandingSection } from "@/components/landing/landing-section";
import { LANDING_NO_SIGNALS } from "@/lib/constants/landing";

export function NoSignalsSection() {
  return (
    <LandingSection
      variant="muted"
      title="TradeLab Doesn't Tell You What to Trade. It Helps You Understand How You Trade."
      description="TradeLab focuses on your journal, your metrics, your execution, your behavior, and your process."
    >
      <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
        {LANDING_NO_SIGNALS.map((item) => (
          <div
            key={item}
            className="bg-card flex items-center gap-3 rounded-xl border px-4 py-4"
          >
            <ShieldCheck className="text-primary size-5 shrink-0" aria-hidden />
            <p className="text-sm font-medium">{item}</p>
          </div>
        ))}
      </div>
    </LandingSection>
  );
}
