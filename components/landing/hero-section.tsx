import { Check } from "lucide-react";

import { LandingAuthButtons } from "@/components/landing/landing-auth-buttons";
import { LANDING_HERO, LANDING_HERO_HIGHLIGHTS } from "@/lib/constants/landing";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pt-16 pb-12 md:pt-24 md:pb-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(242,167,27,0.1),transparent_50%)]" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-10 text-center">
        <div className="space-y-5">
          <p className="text-primary landing-fade-up text-xs font-medium tracking-[0.25em] uppercase">
            {LANDING_HERO.eyebrow}
          </p>
          <h1 className="landing-fade-up landing-delay-100 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            {LANDING_HERO.headline}
          </h1>
          <p className="text-muted-foreground landing-fade-up landing-delay-200 mx-auto max-w-2xl text-base leading-relaxed md:text-lg">
            {LANDING_HERO.description}
          </p>
        </div>

        <div className="landing-fade-up landing-delay-300">
          <LandingAuthButtons primaryLabel={LANDING_HERO.primaryCta} />
        </div>

        <ul className="landing-fade-up landing-delay-400 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {LANDING_HERO_HIGHLIGHTS.map((item) => (
            <li
              key={item}
              className="text-muted-foreground flex items-center gap-2 text-sm"
            >
              <Check className="text-primary size-4 shrink-0" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
