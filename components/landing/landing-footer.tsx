"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";

import { LANDING_NAV_ITEMS } from "@/lib/constants/landing";

function scrollToSection(href: string) {
  const id = href.replace("#", "");
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function LandingFooter() {
  return (
    <footer className="px-6 py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-3">
          <p className="text-lg font-semibold">Nisarg&apos;s TradeLab</p>
          <p className="text-muted-foreground text-sm">
            Track. Analyze. Improve.
          </p>
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
            Built for trading performance review and journaling. Not financial
            advice.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold">Product</p>
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

        <div>
          <p className="mb-3 text-sm font-semibold">Account</p>
          <ul className="space-y-2">
            <li>
              <SignInButton mode="redirect" forceRedirectUrl="/dashboard">
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Sign In
                </button>
              </SignInButton>
            </li>
            <li>
              <SignUpButton mode="redirect" forceRedirectUrl="/dashboard">
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Create Account
                </button>
              </SignUpButton>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
