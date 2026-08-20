import { LandingSection } from "@/components/landing/landing-section";
import {
  LANDING_PSYCHOLOGY_ITEMS,
  LANDING_PSYCHOLOGY_SECTION,
} from "@/lib/constants/landing";

export function PsychologyShowcase() {
  return (
    <LandingSection
      title={LANDING_PSYCHOLOGY_SECTION.title}
      description={LANDING_PSYCHOLOGY_SECTION.description}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {LANDING_PSYCHOLOGY_ITEMS.map((item) => (
          <div
            key={item}
            className="bg-card hover:bg-card-hover rounded-xl border p-4 text-sm font-medium transition-colors"
          >
            {item}
          </div>
        ))}
      </div>
      <p className="text-muted-foreground mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed">
        {LANDING_PSYCHOLOGY_SECTION.disclaimer}
      </p>
    </LandingSection>
  );
}
