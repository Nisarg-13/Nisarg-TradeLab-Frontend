import { LandingSection } from "@/components/landing/landing-section";
import { LANDING_PSYCHOLOGY_ITEMS } from "@/lib/constants/landing";

export function PsychologyShowcase() {
  return (
    <LandingSection
      title="Track More Than Profit and Loss"
      description="Trading performance is influenced by more than entries and exits. TradeLab helps you record the context around your decisions and review historical associations between behavior and outcomes."
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
        TradeLab surfaces patterns in your journal data. It does not claim
        causation — it helps you review what tended to coincide with stronger or
        weaker outcomes in your own history.
      </p>
    </LandingSection>
  );
}
