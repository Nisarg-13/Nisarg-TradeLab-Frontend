import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";
import { getCurrentUser } from "@/lib/api/users";
import { getServerAuthToken } from "@/lib/auth/server";

export default async function SettingsPage() {
  let profile = null;

  try {
    const response = await getCurrentUser(getServerAuthToken);
    profile = response.data;
  } catch {
    profile = null;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground text-sm">Settings</p>
        <h1 className="text-3xl font-semibold tracking-tight">App Settings</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
          Manage your profile timezone for analytics and the live header clock.
        </p>
      </div>

      {profile ? (
        <ProfileSettingsForm key={profile.updatedAt} profile={profile} />
      ) : (
        <p className="text-muted-foreground text-sm">
          Unable to load profile settings. Please refresh and try again.
        </p>
      )}
    </div>
  );
}
