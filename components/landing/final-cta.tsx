import { SignInButton } from "@clerk/nextjs";

import { LandingAuthButtons } from "@/components/landing/landing-auth-buttons";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="border-border/60 border-b px-6 py-20 md:py-24">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Ready to Understand Your Trading Better?
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed md:text-lg">
          Start building a trading process backed by data, structured review,
          and measurable improvement.
        </p>
        <LandingAuthButtons
          primaryLabel="Start Trading Journal"
          showSecondary={false}
        />
        <p className="text-muted-foreground text-sm">
          Already have an account?{" "}
          <SignInButton mode="redirect" forceRedirectUrl="/dashboard">
            <Button variant="link" className="text-primary h-auto p-0">
              Sign in
            </Button>
          </SignInButton>
        </p>
      </div>
    </section>
  );
}
