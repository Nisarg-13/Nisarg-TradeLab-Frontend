"use client";

import { LANDING_NAV_ITEMS } from "@/lib/constants/landing";

function scrollToSection(href: string) {
  const id = href.replace("#", "");
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function LandingFooter() {
  return (
    <footer className="px-6 py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          <button
            type="button"
            onClick={scrollToTop}
            className="text-lg font-semibold transition-opacity hover:opacity-80"
          >
            Nisarg&apos;s TradeLab
          </button>
          <p className="text-muted-foreground text-sm">
            Track. Analyze. Improve.
          </p>
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
            Built for trading performance review and journaling. Not financial
            advice.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold">Explore</p>
          <ul className="space-y-2">
            {LANDING_NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <button
                  type="button"
                  onClick={() => scrollToSection(item.href)}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
