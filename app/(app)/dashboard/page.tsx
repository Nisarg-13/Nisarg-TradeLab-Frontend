import { getServerAuthToken } from "@/lib/auth/server";
import { getCurrentUser } from "@/lib/api/users";

export default async function DashboardPage() {
  let welcomeEmail: string | null = null;

  try {
    const response = await getCurrentUser(getServerAuthToken);
    welcomeEmail = response.data.email;
  } catch {
    welcomeEmail = null;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground text-sm">Dashboard</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          {welcomeEmail ? `Welcome back, ${welcomeEmail}` : "Welcome back"}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Your authenticated app shell is ready. Trading accounts, journal
          workflows, analytics, and AI coaching will arrive in the next phases.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          "Review recent performance",
          "Plan the next trade with the risk calculator",
          "Journal closed trades and daily notes",
        ].map((item) => (
          <div
            key={item}
            className="bg-card text-muted-foreground rounded-xl border p-5 text-sm"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
