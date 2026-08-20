"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LandingAuthButtonsProps = {
  layout?: "row" | "column";
  primaryLabel?: string;
  showSecondary?: boolean;
  className?: string;
};

export function LandingAuthButtons({
  layout = "row",
  primaryLabel = "Start Trading Journal",
  showSecondary = true,
  className,
}: LandingAuthButtonsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        layout === "column" ? "flex-col" : "flex-col sm:flex-row",
        className,
      )}
    >
      <SignUpButton mode="redirect" forceRedirectUrl="/dashboard">
        <Button size="lg" className="min-w-44">
          {primaryLabel}
        </Button>
      </SignUpButton>
      {showSecondary ? (
        <SignInButton mode="redirect" forceRedirectUrl="/dashboard">
          <Button size="lg" variant="outline" className="min-w-32">
            Sign In
          </Button>
        </SignInButton>
      ) : null}
    </div>
  );
}

export function LandingDashboardLink({ className }: { className?: string }) {
  return (
    <Link
      href="/dashboard"
      className={cn(buttonVariants({ size: "lg" }), "min-w-44", className)}
    >
      Open Dashboard
    </Link>
  );
}
