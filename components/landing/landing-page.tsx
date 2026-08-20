import { AiCoachShowcase } from "@/components/landing/ai-coach-showcase";
import { AnalyticsShowcase } from "@/components/landing/analytics-showcase";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { FinalCta } from "@/components/landing/final-cta";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingReveal } from "@/components/landing/landing-reveal";
import { Mt5Showcase } from "@/components/landing/mt5-showcase";
import { NoSignalsSection } from "@/components/landing/no-signals-section";
import { ProductPreview } from "@/components/landing/product-preview";
import { PsychologyShowcase } from "@/components/landing/psychology-showcase";
import { RiskShowcase } from "@/components/landing/risk-showcase";

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
