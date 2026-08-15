"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCurrentUser } from "@/lib/api/users";
import { useClientAuthToken } from "@/lib/auth/client";
import type { UserProfile } from "@/types/user";

const TIMEZONES = [
  "UTC",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "AUD", "CAD", "JPY", "CHF"];

export function ProfileSettingsForm({ profile }: { profile: UserProfile }) {
  const router = useRouter();
  const getAuthToken = useClientAuthToken();
  const [timezone, setTimezone] = useState(profile.timezone);
  const [preferredCurrency, setPreferredCurrency] = useState(
    profile.preferredCurrency,
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      await updateCurrentUser(getAuthToken, {
        timezone,
        preferredCurrency: preferredCurrency.toUpperCase(),
      });
      setMessage("Settings saved.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Preferences</CardTitle>
        <CardDescription>
          Timezone and currency preferences used across analytics and journal
          views.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid max-w-xl gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={profile.email} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <select
              id="timezone"
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
              className="border-input bg-background flex h-10 w-full rounded-lg border px-3 py-2 text-base"
            >
              {TIMEZONES.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferredCurrency">Preferred currency</Label>
            <select
              id="preferredCurrency"
              value={preferredCurrency}
              onChange={(event) => setPreferredCurrency(event.target.value)}
              className="border-input bg-background flex h-10 w-full rounded-lg border px-3 py-2 text-base"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
          {message ? (
            <p className="text-base text-green-700 dark:text-green-300">{message}</p>
          ) : null}
          {error ? <p className="text-base text-destructive">{error}</p> : null}
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
