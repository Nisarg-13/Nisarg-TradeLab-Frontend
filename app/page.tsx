import { auth } from "@clerk/nextjs/server";
import { TrendingUp } from "lucide-react";
import { redirect } from "next/navigation";

import { LandingAuthActions } from "@/components/auth/landing-auth-actions";
import { PublicThemeToggle } from "@/components/layout/public-theme-toggle";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(242,167,27,0.08),transparent_45%)]" />
      <PublicThemeToggle />
      <main className="relative flex w-full max-w-2xl flex-col items-center gap-8 text-center">
        <div className="bg-primary flex size-14 items-center justify-center rounded-xl">
          <TrendingUp className="text-primary-foreground size-7" />
        </div>
        <div className="space-y-3">
          <p className="text-primary text-xs font-medium tracking-[0.25em] uppercase">
            Personal Trading Journal
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Nisarg&apos;s TradeLab
          </h1>
          <p className="text-muted-foreground text-lg">
            Track. Analyze. Improve.
          </p>
        </div>

        <p className="text-muted-foreground max-w-lg text-sm leading-relaxed">
          Record trades, calculate risk, review performance, and improve with
          evidence-backed analytics and AI coaching. Sign in with Google, Apple,
          or email.
        </p>

        <LandingAuthActions />
      </main>
    </div>
  );
}
