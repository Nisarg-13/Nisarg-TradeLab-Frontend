import { PageHeader } from "@/components/layout/page-header";
import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";
import { getServerCurrentUser } from "@/lib/api/users.server";

export default async function SettingsPage() {
  let profile = null;

  try {
    const response = await getServerCurrentUser();
    profile = response.data;
  } catch {
    profile = null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="App Settings"
        description="Manage your profile timezone for analytics and the live header clock."
      />

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
