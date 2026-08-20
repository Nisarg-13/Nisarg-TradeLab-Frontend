import { AppShell } from "@/components/layout/app-shell";
import { TimezoneProvider } from "@/components/providers/timezone-provider";
import { getServerCurrentUser } from "@/lib/api/users";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialTimezone = "UTC";

  try {
    const response = await getServerCurrentUser();
    initialTimezone = response.data.timezone;
  } catch {
    initialTimezone = "UTC";
  }

  return (
    <TimezoneProvider key={initialTimezone} initialTimezone={initialTimezone}>
      <AppShell>{children}</AppShell>
    </TimezoneProvider>
  );
}
