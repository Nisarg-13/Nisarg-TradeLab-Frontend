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
import { Select } from "@/components/ui/select";
import {
  archiveAccount,
  createAccount,
  updateAccount,
  updateRiskSettings,
} from "@/lib/api/accounts";
import { useClientAuthToken } from "@/lib/auth/client";
import type { AccountType, TradingAccount } from "@/types/account";

const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: "PERSONAL", label: "Personal" },
  { value: "DEMO", label: "Demo" },
  { value: "PROP_CHALLENGE", label: "Prop Challenge" },
  { value: "FUNDED", label: "Funded" },
  { value: "OTHER", label: "Other" },
];

function formatMoney(value: string, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export function AccountsManager({
  initialAccounts,
}: {
  initialAccounts: TradingAccount[];
}) {
  const router = useRouter();
  const getAuthToken = useClientAuthToken();
  const [accounts, setAccounts] = useState(initialAccounts);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialAccounts[0]?.id ?? null,
  );
  const [showCreate, setShowCreate] = useState(initialAccounts.length === 0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const selected = accounts.find((account) => account.id === selectedId) ?? null;

  async function refresh() {
    router.refresh();
  }

  async function handleCreate(formData: FormData) {
    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const response = await createAccount(getAuthToken, {
        name: String(formData.get("name") ?? ""),
        type: String(formData.get("type") ?? "PERSONAL") as AccountType,
        brokerName: String(formData.get("brokerName") ?? "") || undefined,
        currency: String(formData.get("currency") ?? "USD").toUpperCase(),
        startingBalance: Number(formData.get("startingBalance") ?? 0),
      });

      setAccounts((current) => [response.data, ...current]);
      setSelectedId(response.data.id);
      setShowCreate(false);
      setMessage("Trading account created.");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdate(formData: FormData) {
    if (!selected) return;

    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const response = await updateAccount(getAuthToken, selected.id, {
        name: String(formData.get("name") ?? selected.name),
        type: String(formData.get("type") ?? selected.type) as AccountType,
        brokerName: String(formData.get("brokerName") ?? "") || undefined,
        currency: String(formData.get("currency") ?? selected.currency),
        currentBalance: Number(
          formData.get("currentBalance") ?? selected.currentBalance,
        ),
      });

      setAccounts((current) =>
        current.map((account) =>
          account.id === selected.id ? response.data : account,
        ),
      );
      setMessage("Account updated.");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update account.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleArchive() {
    if (!selected) return;

    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      await archiveAccount(getAuthToken, selected.id);
      setAccounts((current) => current.filter((account) => account.id !== selected.id));
      setSelectedId(null);
      setMessage("Account archived.");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive account.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRiskUpdate(formData: FormData) {
    if (!selected) return;

    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const response = await updateRiskSettings(getAuthToken, selected.id, {
        defaultRiskPercentage: Number(formData.get("defaultRiskPercentage")),
        maxRiskPerTradePercentage: Number(
          formData.get("maxRiskPerTradePercentage"),
        ),
        maxDailyRiskPercentage: Number(formData.get("maxDailyRiskPercentage")),
        maxDailyLossPercentage: Number(formData.get("maxDailyLossPercentage")),
        maxOpenRiskPercentage: Number(formData.get("maxOpenRiskPercentage")),
        maxTradesPerDay: Number(formData.get("maxTradesPerDay")),
        maxConsecutiveLosses: Number(formData.get("maxConsecutiveLosses")),
        strictMode: formData.get("strictMode") === "on",
      });

      setAccounts((current) =>
        current.map((account) =>
          account.id === selected.id
            ? { ...account, riskSettings: response.data }
            : account,
        ),
      );
      setMessage("Risk settings updated.");
      await refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update risk settings.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-base">Accounts</p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Trading Accounts
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-base">
            Create accounts, track balances, and configure risk limits per
            account.
          </p>
        </div>
        <Button onClick={() => setShowCreate((value) => !value)}>
          {showCreate ? "Cancel" : "New Account"}
        </Button>
      </div>

      {message ? (
        <p className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-base text-green-700 dark:text-green-300">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-base text-destructive">
          {error}
        </p>
      ) : null}

      {showCreate ? (
        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Add a manual trading account with a starting balance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleCreate} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="create-name">Account name</Label>
                <Input id="create-name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-type">Account type</Label>
                <Select id="create-type" name="type" defaultValue="PERSONAL">
                  {ACCOUNT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-broker">Broker name</Label>
                <Input id="create-broker" name="brokerName" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-currency">Currency</Label>
                <Input id="create-currency" name="currency" defaultValue="USD" maxLength={3} required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="create-balance">Starting balance</Label>
                <Input id="create-balance" name="startingBalance" type="number" min="0" step="0.01" required />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Create account"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Your Accounts</CardTitle>
            <CardDescription>
              {accounts.length} active account{accounts.length === 1 ? "" : "s"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {accounts.length === 0 ? (
              <p className="text-muted-foreground text-base">
                No accounts yet. Create your first trading account.
              </p>
            ) : (
              accounts.map((account) => (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => setSelectedId(account.id)}
                  className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
                    selectedId === account.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <p className="font-medium">{account.name}</p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {account.type.replaceAll("_", " ")} ·{" "}
                    {formatMoney(account.currentBalance, account.currency)}
                  </p>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        {selected ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Edit Account</CardTitle>
                <CardDescription>
                  Update account details and current balance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={handleUpdate} className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Account name</Label>
                    <Input id="edit-name" name="name" defaultValue={selected.name} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-type">Account type</Label>
                    <Select id="edit-type" name="type" defaultValue={selected.type}>
                      {ACCOUNT_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-broker">Broker name</Label>
                    <Input id="edit-broker" name="brokerName" defaultValue={selected.brokerName ?? ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-currency">Currency</Label>
                    <Input id="edit-currency" name="currency" defaultValue={selected.currency} maxLength={3} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-starting-balance">Starting balance</Label>
                    <Input id="edit-starting-balance" value={selected.startingBalance} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-current-balance">Current balance</Label>
                    <Input id="edit-current-balance" name="currentBalance" type="number" min="0" step="0.01" defaultValue={selected.currentBalance} required />
                  </div>
                  <div className="flex flex-wrap gap-3 md:col-span-2">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save changes"}
                    </Button>
                    <Button type="button" variant="destructive" disabled={isSaving} onClick={handleArchive}>
                      Archive account
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {selected.riskSettings ? (
              <Card>
                <CardHeader>
                  <CardTitle>Risk Settings</CardTitle>
                  <CardDescription>
                    Configure per-account risk limits used by the risk engine.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form action={handleRiskUpdate} className="grid gap-4 md:grid-cols-2">
                    {[
                      ["defaultRiskPercentage", "Default risk %"],
                      ["maxRiskPerTradePercentage", "Max risk per trade %"],
                      ["maxDailyRiskPercentage", "Max daily risk %"],
                      ["maxDailyLossPercentage", "Max daily loss %"],
                      ["maxOpenRiskPercentage", "Max open risk %"],
                      ["maxTradesPerDay", "Max trades per day"],
                      ["maxConsecutiveLosses", "Max consecutive losses"],
                    ].map(([name, label]) => (
                      <div className="space-y-2" key={name}>
                        <Label htmlFor={`risk-${name}`}>{label}</Label>
                        <Input
                          id={`risk-${name}`}
                          name={name}
                          type="number"
                          step={name.includes("Day") || name.includes("Losses") ? "1" : "0.01"}
                          defaultValue={
                            selected.riskSettings?.[
                              name as keyof typeof selected.riskSettings
                            ] as string | number
                          }
                          required
                        />
                      </div>
                    ))}
                    <div className="flex items-center gap-2 md:col-span-2">
                      <input
                        id="strictMode"
                        name="strictMode"
                        type="checkbox"
                        defaultChecked={selected.riskSettings.strictMode}
                        className="size-4"
                      />
                      <Label htmlFor="strictMode">Strict mode (block violating trades)</Label>
                    </div>
                    <div className="md:col-span-2">
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save risk settings"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
