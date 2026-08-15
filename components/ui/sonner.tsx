"use client";

import { Toaster } from "sonner";

import { useTheme } from "@/components/theme-provider";

export function AppToaster() {
  const { theme } = useTheme();

  return (
    <Toaster
      theme={theme === "dark" ? "dark" : "light"}
      position="top-right"
      richColors
      closeButton
      duration={5000}
      toastOptions={{
        classNames: {
          toast:
            "group toast border-border bg-card text-foreground shadow-none",
          title: "text-sm font-medium",
          description: "text-muted-foreground text-sm",
        },
      }}
    />
  );
}
