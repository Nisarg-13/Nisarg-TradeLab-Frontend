"use client";

import { Loader2, Wallet } from "lucide-react";

import { cn } from "@/lib/utils";

export function AccountSwitchLoadingOverlay({
  isLoading,
  accountLabel,
  children,
  className,
}: {
  isLoading: boolean;
  accountLabel?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "space-y-6",
          "transition-[opacity,filter] duration-300 ease-out",
          isLoading && "pointer-events-none opacity-35 blur-[1.5px]",
        )}
      >
        {children}
      </div>

      {isLoading ? (
        <div
          className="absolute inset-0 z-10 flex items-start justify-center pt-12 sm:pt-20"
          aria-busy="true"
          aria-live="polite"
          role="status"
        >
          <div className="border-primary/25 bg-background/95 animate-in fade-in zoom-in-95 flex w-[min(100%,22rem)] items-center gap-3 rounded-2xl border px-4 py-3.5 shadow-2xl backdrop-blur-md duration-300">
            <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
              <Loader2 className="size-5 animate-spin" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 font-medium">
                <Wallet className="text-muted-foreground size-3.5 shrink-0" />
                Loading account data
              </p>
              <p className="text-muted-foreground truncate text-sm">
                {accountLabel
                  ? `Fetching ${accountLabel}…`
                  : "Fetching data for the selected account…"}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
