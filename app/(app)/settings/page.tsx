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
        <p className="text-muted-foreground text-base">Settings</p>
        <h1 className="text-4xl font-semibold tracking-tight">App Settings</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-base">
          Manage your profile preferences for timezone and reporting currency.
        </p>
      </div>

      {profile ? (
        <ProfileSettingsForm profile={profile} />
      ) : (
        <p className="text-muted-foreground text-base">
          Unable to load profile settings. Please refresh and try again.
        </p>
      )}
    </div>
  );
}
