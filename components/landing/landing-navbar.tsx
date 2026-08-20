"use client";

import { Menu, TrendingUp, X } from "lucide-react";
import { useState } from "react";

import { LandingAuthButtons } from "@/components/landing/landing-auth-buttons";
import { Button } from "@/components/ui/button";
import { LANDING_NAV_ITEMS } from "@/lib/constants/landing";
import { cn } from "@/lib/utils";

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToSection(href: string) {
  const id = href.replace("#", "");
  const element = document.getElementById(id);
  element?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function LandingNavbar() {
  const [open, setOpen] = useState(false);

  function handleNavClick(href: string) {
    setOpen(false);
    scrollToSection(href);
  }

  function handleLogoClick() {
    setOpen(false);
    scrollToTop();
  }

  return (
    <header className="bg-background/80 border-border/60 landing-navbar-enter sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <button
          type="button"
          onClick={handleLogoClick}
          className="flex items-center gap-3 text-left transition-opacity hover:opacity-90"
          aria-label="Back to top of page"
        >
          <div className="bg-primary flex size-9 items-center justify-center rounded-lg">
            <TrendingUp
              className="text-primary-foreground size-5"
              aria-hidden
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold tracking-tight">
              Nisarg&apos;s TradeLab
            </p>
            <p className="text-muted-foreground text-xs">
              Track. Analyze. Improve.
            </p>
          </div>
        </button>

        <nav
          className="hidden items-center gap-6 lg:flex"
          aria-label="Landing page sections"
        >
          {LANDING_NAV_ITEMS.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => handleNavClick(item.href)}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LandingAuthButtons
            primaryLabel="Get Started"
            showSecondary={false}
            className="flex-row"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </Button>
      </div>

      <div
        className={cn(
          "border-border/60 border-t lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav
          className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4"
          aria-label="Mobile landing navigation"
        >
          {LANDING_NAV_ITEMS.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => handleNavClick(item.href)}
              className="text-muted-foreground hover:text-foreground rounded-lg px-3 py-2 text-left text-sm transition-colors"
            >
              {item.label}
            </button>
          ))}
          <div className="border-border/60 mt-4 border-t pt-4">
            <LandingAuthButtons
              layout="column"
              primaryLabel="Get Started"
              showSecondary={false}
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
