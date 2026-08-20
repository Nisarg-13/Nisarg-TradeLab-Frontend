import { Check } from "lucide-react";

import { LandingAuthButtons } from "@/components/landing/landing-auth-buttons";
import { LANDING_HERO_HIGHLIGHTS } from "@/lib/constants/landing";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pt-16 pb-12 md:pt-24 md:pb-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(242,167,27,0.1),transparent_50%)]" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-10 text-center">
        <div className="space-y-5">
          <p className="text-primary text-xs font-medium tracking-[0.25em] uppercase">
            Personal Trading Journal
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            Turn Your Trading History Into Measurable Improvement
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed md:text-lg">
            Journal every trade, analyze your performance, manage risk, and
            uncover repeatable patterns with advanced analytics and
            evidence-based AI coaching.
          </p>
        </div>

        <LandingAuthButtons primaryLabel="Start Trading Journal" />

        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
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
