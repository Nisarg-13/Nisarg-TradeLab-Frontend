import { ShieldCheck } from "lucide-react";

import { LandingSection } from "@/components/landing/landing-section";
import { LANDING_NO_SIGNALS } from "@/lib/constants/landing";

export function NoSignalsSection() {
  return (
    <LandingSection
      variant="muted"
      title={LANDING_NO_SIGNALS.title}
      description={LANDING_NO_SIGNALS.description}
    >
      <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
        {LANDING_NO_SIGNALS.items.map((item) => (
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
