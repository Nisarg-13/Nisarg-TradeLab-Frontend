import { AppShell } from "@/components/layout/app-shell";
import { AppSessionProvider } from "@/components/providers/app-session-provider";
import { TimezoneProvider } from "@/components/providers/timezone-provider";
import { getServerAppContext } from "@/lib/server/app-context";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, selectedAccountId } = await getServerAppContext();

  return (
    <TimezoneProvider initialTimezone={user?.timezone ?? "UTC"}>
      <AppSessionProvider serverSelectedAccountId={selectedAccountId ?? ""}>
        <AppShell>{children}</AppShell>
      </AppSessionProvider>
    </TimezoneProvider>
  );
}
