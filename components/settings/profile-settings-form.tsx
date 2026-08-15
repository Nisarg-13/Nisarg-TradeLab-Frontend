"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { useTimezone } from "@/components/providers/timezone-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Label } from "@/components/ui/label";
import { getTimezoneOptions } from "@/lib/constants/timezones";
import { updateCurrentUser } from "@/lib/api/users";
import { useClientAuthToken } from "@/lib/auth/client";
import type { UserProfile } from "@/types/user";

export function ProfileSettingsForm({ profile }: { profile: UserProfile }) {
  const router = useRouter();
  const getAuthToken = useClientAuthToken();
  const { setTimezone: setGlobalTimezone } = useTimezone();
  const [timezone, setTimezone] = useState(profile.timezone);
  const [isSaving, setIsSaving] = useState(false);
  const timezoneOptions = useMemo(
    () => getTimezoneOptions(timezone),
    [timezone],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    try {
      await updateCurrentUser(getAuthToken, { timezone });
      setGlobalTimezone(timezone);
      toast.success("Settings saved.");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save settings.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timezone</CardTitle>
        <CardDescription>
          Used for analytics, journal timestamps, and the live header clock.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid max-w-xl gap-4">
          <div className="space-y-2">
            <Label htmlFor="timezone">Preferred timezone</Label>
            <DropdownSelect
              id="timezone"
              name="timezone"
              options={timezoneOptions}
              value={timezone}
              onValueChange={(nextTimezone) => {
                setTimezone(nextTimezone);
                setGlobalTimezone(nextTimezone);
              }}
            />
          </div>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
