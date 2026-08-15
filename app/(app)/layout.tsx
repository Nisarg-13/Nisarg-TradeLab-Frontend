import { AppShell } from "@/components/layout/app-shell";
import { TimezoneProvider } from "@/components/providers/timezone-provider";
import { getCurrentUser } from "@/lib/api/users";
import { getServerAuthToken } from "@/lib/auth/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialTimezone = "UTC";

  try {
    const response = await getCurrentUser(getServerAuthToken);
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
