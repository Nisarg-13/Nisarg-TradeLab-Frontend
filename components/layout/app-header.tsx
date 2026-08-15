"use client";

import { UserButton } from "@clerk/nextjs";

import { ThemeToggle } from "@/components/theme-toggle";

import { MobileNav } from "./mobile-nav";

export function AppHeader() {
  return (
    <header className="bg-card flex items-center justify-between border-b px-4 py-3 md:px-6">
      <MobileNav />
      <div className="hidden md:block">
        <p className="text-base font-medium">Trading Journal</p>
        <p className="text-muted-foreground text-sm">
          Plan, journal, review, and improve
        </p>
      </div>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <UserButton />
      </div>
    </header>
  );
}
