import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { LandingAuthActions } from "@/components/auth/landing-auth-actions";
import { PublicThemeToggle } from "@/components/layout/public-theme-toggle";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <PublicThemeToggle />
      <main className="flex w-full max-w-2xl flex-col items-center gap-8 text-center">
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
            Personal Trading Journal
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Nisarg&apos;s TradeLab
          </h1>
          <p className="text-muted-foreground text-lg">
            Track. Analyze. Improve.
          </p>
        </div>

        <p className="text-muted-foreground max-w-lg">
          Record trades, calculate risk, review performance, and improve with
          evidence-backed analytics and AI coaching. Sign in with Google, Apple,
          or email.
        </p>

        <LandingAuthActions />
      </main>
    </div>
  );
}
