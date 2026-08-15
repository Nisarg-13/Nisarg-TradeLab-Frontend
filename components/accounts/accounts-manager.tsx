"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  archiveAccount,
  createAccount,
  updateAccount,
} from "@/lib/api/accounts";
import { useClientAuthToken } from "@/lib/auth/client";
import { formatMoney } from "@/lib/formatting/currency";
import type { AccountType, TradingAccount } from "@/types/account";

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "AUD", "CAD", "JPY", "CHF"];

const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: "PERSONAL", label: "Personal" },
  { value: "PROP_CHALLENGE", label: "Prop Challenge" },
];

const CURRENCY_OPTIONS = CURRENCIES.map((currency) => ({
  value: currency,
  label: currency,
}));

function getAccountTypeLabel(type: AccountType) {
  return (
    ACCOUNT_TYPES.find((item) => item.value === type)?.label ??
    type.replaceAll("_", " ")
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="text-base font-medium">{value}</p>
    </div>
  );
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
  const [showCreate, setShowCreate] = useState(false);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const selected =
    accounts.find((account) => account.id === selectedId) ?? null;

  function selectAccount(accountId: string | null) {
    setSelectedId(accountId);
    setIsEditingAccount(false);
    setShowDeleteConfirm(false);
  }

  async function refresh() {
    router.refresh();
  }

  async function handleCreate(formData: FormData) {
    setIsSaving(true);

    try {
      const response = await createAccount(getAuthToken, {
        name: String(formData.get("name") ?? ""),
        type: String(formData.get("type") ?? "PERSONAL") as AccountType,
        brokerName: String(formData.get("brokerName") ?? "") || undefined,
        currency: String(formData.get("currency") ?? "USD").toUpperCase(),
        startingBalance: Number(formData.get("startingBalance") ?? 0),
      });

      setAccounts((current) => [response.data, ...current]);
      selectAccount(response.data.id);
      setShowCreate(false);
      toast.success("Trading account created.");
      await refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create account.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdate(formData: FormData) {
    if (!selected) return;

    setIsSaving(true);

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
      toast.success("Account updated.");
      setIsEditingAccount(false);
      await refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update account.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!selected) return;

    setIsSaving(true);

    try {
      await archiveAccount(getAuthToken, selected.id);
      setAccounts((current) =>
        current.filter((account) => account.id !== selected.id),
      );
      selectAccount(null);
      toast.success("Account deleted.");
      await refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete account.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-sm">Accounts</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Trading Accounts
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            Create accounts and track balances for your trading journal.
          </p>
        </div>
        <Button
          onClick={() => {
            setShowCreate((value) => !value);
            if (!showCreate) {
              setIsEditingAccount(false);
            }
          }}
        >
          {showCreate ? "Cancel" : "New Account"}
        </Button>
      </div>

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
                <DropdownSelect
                  id="create-type"
                  name="type"
                  defaultValue="PERSONAL"
                  options={ACCOUNT_TYPES}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-broker">Broker name</Label>
                <Input id="create-broker" name="brokerName" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-currency">Currency</Label>
                <DropdownSelect
                  id="create-currency"
                  name="currency"
                  defaultValue="USD"
                  options={CURRENCY_OPTIONS}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="create-balance">Starting balance</Label>
                <Input
                  id="create-balance"
                  name="startingBalance"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                />
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

      {!showCreate ? (
        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Your Accounts</CardTitle>
              <CardDescription>
                {accounts.length} active account
                {accounts.length === 1 ? "" : "s"}
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
                    onClick={() => selectAccount(account.id)}
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
            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>Account Details</CardTitle>
                  <CardDescription>
                    View account details and balance.
                  </CardDescription>
                </div>
                {!isEditingAccount ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditingAccount(true)}
                  >
                    Edit
                  </Button>
                ) : null}
              </CardHeader>
              <CardContent>
                {isEditingAccount ? (
                  <form
                    action={handleUpdate}
                    className="grid gap-4 md:grid-cols-2"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Account name</Label>
                      <Input
                        id="edit-name"
                        name="name"
                        defaultValue={selected.name}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-type">Account type</Label>
                      <DropdownSelect
                        key={`edit-type-${selected.id}`}
                        id="edit-type"
                        name="type"
                        defaultValue={
                          selected.type === "PERSONAL" ||
                          selected.type === "PROP_CHALLENGE"
                            ? selected.type
                            : "PERSONAL"
                        }
                        options={ACCOUNT_TYPES}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-broker">Broker name</Label>
                      <Input
                        id="edit-broker"
                        name="brokerName"
                        defaultValue={selected.brokerName ?? ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-currency">Currency</Label>
                      <DropdownSelect
                        key={`edit-currency-${selected.id}`}
                        id="edit-currency"
                        name="currency"
                        defaultValue={selected.currency}
                        options={CURRENCY_OPTIONS}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-starting-balance">
                        Starting balance
                      </Label>
                      <Input
                        id="edit-starting-balance"
                        value={selected.startingBalance}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-current-balance">
                        Current balance
                      </Label>
                      <Input
                        id="edit-current-balance"
                        name="currentBalance"
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={selected.currentBalance}
                        required
                      />
                    </div>
                    <div className="flex flex-wrap gap-3 md:col-span-2">
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save changes"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isSaving}
                        onClick={() => setIsEditingAccount(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <DetailItem label="Account name" value={selected.name} />
                      <DetailItem
                        label="Account type"
                        value={getAccountTypeLabel(selected.type)}
                      />
                      <DetailItem
                        label="Broker name"
                        value={selected.brokerName || "—"}
                      />
                      <DetailItem label="Currency" value={selected.currency} />
                      <DetailItem
                        label="Starting balance"
                        value={formatMoney(
                          selected.startingBalance,
                          selected.currency,
                        )}
                      />
                      <DetailItem
                        label="Current balance"
                        value={formatMoney(
                          selected.currentBalance,
                          selected.currency,
                        )}
                      />
                    </div>
                    <div className="mt-6">
                      <Button
                        type="button"
                        variant="destructive"
                        disabled={isSaving}
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        Delete account
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ) : null}
        </div>
      ) : null}

      {showDeleteConfirm && selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Delete account?</CardTitle>
              <CardDescription>
                Are you sure you want to delete &quot;{selected.name}&quot;?
                This account will be removed from your active list.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={isSaving}
                onClick={handleDelete}
              >
                {isSaving ? "Deleting..." : "Delete account"}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
