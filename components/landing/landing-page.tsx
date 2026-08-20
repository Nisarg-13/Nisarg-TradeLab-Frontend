import dynamic from "next/dynamic";

import { HeroSection } from "@/components/landing/hero-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingReveal } from "@/components/landing/landing-reveal";
import { ProductPreview } from "@/components/landing/product-preview";

const FeatureGrid = dynamic(
  () =>
    import("@/components/landing/feature-grid").then((mod) => mod.FeatureGrid),
  { loading: () => null },
);
const HowItWorks = dynamic(
  () =>
    import("@/components/landing/how-it-works").then((mod) => mod.HowItWorks),
  { loading: () => null },
);
const AnalyticsShowcase = dynamic(
  () =>
    import("@/components/landing/analytics-showcase").then(
      (mod) => mod.AnalyticsShowcase,
    ),
  { loading: () => null },
);
const AiCoachShowcase = dynamic(
  () =>
    import("@/components/landing/ai-coach-showcase").then(
      (mod) => mod.AiCoachShowcase,
    ),
  { loading: () => null },
);
const RiskShowcase = dynamic(
  () =>
    import("@/components/landing/risk-showcase").then(
      (mod) => mod.RiskShowcase,
    ),
  { loading: () => null },
);
const Mt5Showcase = dynamic(
  () =>
    import("@/components/landing/mt5-showcase").then((mod) => mod.Mt5Showcase),
  { loading: () => null },
);
const PsychologyShowcase = dynamic(
  () =>
    import("@/components/landing/psychology-showcase").then(
      (mod) => mod.PsychologyShowcase,
    ),
  { loading: () => null },
);
const NoSignalsSection = dynamic(
  () =>
    import("@/components/landing/no-signals-section").then(
      (mod) => mod.NoSignalsSection,
    ),
  { loading: () => null },
);
const FinalCta = dynamic(
  () => import("@/components/landing/final-cta").then((mod) => mod.FinalCta),
  { loading: () => null },
);

export function LandingPage() {
  return (
    <>
      <LandingNavbar />
      <main>
        <HeroSection />
        <LandingReveal delay={80}>
          <ProductPreview />
        </LandingReveal>
        <LandingReveal>
          <FeatureGrid />
        </LandingReveal>
        <LandingReveal>
          <HowItWorks />
        </LandingReveal>
        <LandingReveal>
          <AnalyticsShowcase />
        </LandingReveal>
        <LandingReveal>
          <AiCoachShowcase />
        </LandingReveal>
        <LandingReveal>
          <RiskShowcase />
        </LandingReveal>
        <LandingReveal>
          <Mt5Showcase />
        </LandingReveal>
        <LandingReveal>
          <PsychologyShowcase />
        </LandingReveal>
        <LandingReveal>
          <NoSignalsSection />
        </LandingReveal>
        <LandingReveal>
          <FinalCta />
        </LandingReveal>
      </main>
      <LandingReveal delay={100}>
        <LandingFooter />
      </LandingReveal>
    </>
  );
}
