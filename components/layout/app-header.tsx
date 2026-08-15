"use client";

import { UserButton } from "@clerk/nextjs";

import { ThemeToggle } from "@/components/theme-toggle";

import { HeaderClock } from "./header-clock";
import { MobileNav } from "./mobile-nav";

export function AppHeader() {
  return (
    <header className="bg-card flex h-[4.5rem] shrink-0 items-center justify-between gap-4 border-b px-4 md:px-6">
      <MobileNav />
      <div className="hidden flex-col gap-0.5 leading-tight md:flex">
        <span className="text-base font-semibold tracking-tight">
          Trading Journal
        </span>
        <span className="text-muted-foreground text-xs tracking-wide uppercase">
          Plan, journal, review, and improve
        </span>
      </div>
      <div className="flex items-center gap-3 md:gap-4">
        <HeaderClock />
        <ThemeToggle />
        <div className="md:hidden">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
