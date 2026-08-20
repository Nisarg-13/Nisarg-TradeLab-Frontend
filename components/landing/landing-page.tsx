import { AiCoachShowcase } from "@/components/landing/ai-coach-showcase";
import { AnalyticsShowcase } from "@/components/landing/analytics-showcase";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { FinalCta } from "@/components/landing/final-cta";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
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
        <ProductPreview />
        <FeatureGrid />
        <HowItWorks />
        <AnalyticsShowcase />
        <AiCoachShowcase />
        <RiskShowcase />
        <Mt5Showcase />
        <PsychologyShowcase />
        <NoSignalsSection />
        <FinalCta />
      </main>
      <LandingFooter />
    </>
  );
}
