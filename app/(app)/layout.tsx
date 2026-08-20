import { AppShell } from "@/components/layout/app-shell";
import { TimezoneProvider } from "@/components/providers/timezone-provider";
import { TimezoneSync } from "@/components/providers/timezone-sync";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <TimezoneProvider initialTimezone="UTC">
      <TimezoneSync />
      <AppShell>{children}</AppShell>
    </TimezoneProvider>
  );
}
