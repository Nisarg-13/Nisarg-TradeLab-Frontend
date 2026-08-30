"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { JournalFields } from "@/components/journal/journal-fields";
import { PageHeader } from "@/components/layout/page-header";
import { AccountSwitchLoadingOverlay } from "@/components/layout/account-switch-loading-overlay";
import { Badge } from "@/components/ui/badge";
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
  createDailyJournalEntry,
  listDailyJournalEntries,
  updateDailyJournalEntry,
} from "@/lib/api/journal";
import { useClientAuthToken } from "@/lib/auth/client";
import {
  useInitialPersistedAccountLoad,
  usePersistedAccountId,
} from "@/lib/hooks/use-persisted-account-id";
import { resolveAccountLabel } from "@/lib/hooks/use-account-switch-loading";
import { shouldSkipServerMatchedAccountLoad } from "@/lib/preferences/server-account-load";
import type { TradingAccount } from "@/types/account";
import type {
  DailyJournal,
  JournalFieldValues,
  MarketBias,
} from "@/types/journal";

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function toJournalValues(entry?: DailyJournal | null): JournalFieldValues {
  return {
    marketBias: entry?.marketBias ?? "",
    preTradePlan: entry?.preTradePlan ?? "",
    postTradePlan: entry?.postTradePlan ?? "",
    confidenceScore: entry?.confidenceScore ?? 7,
    whatWentWell: entry?.whatWentWell ?? "",
    whatWentWrong: entry?.whatWentWrong ?? "",
  };
}

function buildJournalPayload(values: JournalFieldValues) {
  return {
    marketBias: values.marketBias
      ? (values.marketBias as MarketBias)
      : undefined,
    confidenceScore: values.confidenceScore,
    preTradePlan: values.preTradePlan || undefined,
    postTradePlan: values.postTradePlan || undefined,
    whatWentWell: values.whatWentWell || undefined,
    whatWentWrong: values.whatWentWrong || undefined,
  };
}

function formatEntryTitle(entry: DailyJournal) {
  return new Date(`${entry.date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DailyJournalManager({
  accounts,
  serverSelectedAccountId = "",
  initialEntries,
}: {
  accounts: TradingAccount[];
  serverSelectedAccountId?: string;
  initialEntries: DailyJournal[];
}) {
  const getAuthToken = useClientAuthToken();
  const { accountId, setAccountId, isReady } = usePersistedAccountId(
    accounts,
    serverSelectedAccountId,
  );
  const selectedAccountId = accountId || accounts[0]?.id || "";
  const [entries, setEntries] = useState(initialEntries);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(
    initialEntries[0]?.id ?? null,
  );
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAccountSwitchLoading, setIsAccountSwitchLoading] = useState(false);
  const [draftAccountId, setDraftAccountId] = useState(
    selectedAccountId || accounts[0]?.id || "",
  );
  const [draftDate, setDraftDate] = useState(todayIsoDate());
  const [journalValues, setJournalValues] = useState<JournalFieldValues>(() =>
    toJournalValues(initialEntries[0]),
  );

  const accountOptions = useMemo(
    () =>
      accounts.map((account) => ({
        value: account.id,
        label: account.name,
      })),
    [accounts],
  );

  const filteredEntries = useMemo(
    () =>
      entries.filter((entry) => entry.tradingAccountId === selectedAccountId),
    [entries, selectedAccountId],
  );

  const refreshEntries = useCallback(
    async (accountFilterId?: string) => {
      const response = await listDailyJournalEntries(getAuthToken, {
        tradingAccountId: accountFilterId,
      });
      setEntries(response.data);
      return response.data;
    },
    [getAuthToken],
  );

  const handleAccountChange = useCallback(
    async (value: string) => {
      setAccountId(value);
      setIsAccountSwitchLoading(true);

      try {
        const accountFilterId = value || accounts[0]?.id;
        const refreshed = await refreshEntries(accountFilterId);
        setSelectedEntryId(refreshed[0]?.id ?? null);
        setIsCreating(false);
      } finally {
        setIsAccountSwitchLoading(false);
      }
    },
    [accounts, refreshEntries, setAccountId],
  );

  useInitialPersistedAccountLoad(
    isReady,
    async () => {
      const refreshed = await refreshEntries(accountId);
      setSelectedEntryId(refreshed[0]?.id ?? null);
    },
    {
      enabled: Boolean(accountId),
      skip: shouldSkipServerMatchedAccountLoad(
        accountId,
        serverSelectedAccountId,
      ),
    },
  );

  const selectedEntry =
    entries.find((entry) => entry.id === selectedEntryId) ?? null;

  function startCreate() {
    setIsCreating(true);
    setSelectedEntryId(null);
    setDraftAccountId(selectedAccountId || accounts[0]?.id || "");
    setDraftDate(todayIsoDate());
    setJournalValues(toJournalValues());
  }

  function startEdit(entry: DailyJournal) {
    setIsCreating(false);
    setSelectedEntryId(entry.id);
    setDraftAccountId(entry.tradingAccountId);
    setDraftDate(entry.date);
    setJournalValues(toJournalValues(entry));
  }

  async function handleSave() {
    if (!draftAccountId) {
      toast.error("Select a trading account.");
      return;
    }

    setIsSaving(true);

    try {
      const payload = buildJournalPayload(journalValues);

      if (isCreating) {
        const response = await createDailyJournalEntry(getAuthToken, {
          tradingAccountId: draftAccountId,
          date: draftDate,
          ...payload,
        });

        const refreshed = await refreshEntries(selectedAccountId || undefined);
        setSelectedEntryId(response.data.id);
        setIsCreating(false);
        if (refreshed.length === 0) {
          setEntries([response.data]);
        }
        toast.success("Daily journal entry created.");
      } else if (selectedEntry) {
        const response = await updateDailyJournalEntry(
          getAuthToken,
          selectedEntry.id,
          payload,
        );

        setEntries((current) =>
          current.map((entry) =>
            entry.id === response.data.id ? response.data : entry,
          ),
        );
        toast.success("Daily journal entry updated.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save journal entry.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Journal"
        description="Capture your market read, plan, confidence, and review for the session."
      >
        <Button type="button" onClick={startCreate}>
          New entry
        </Button>
      </PageHeader>

      <AccountSwitchLoadingOverlay
        isLoading={isAccountSwitchLoading}
        accountLabel={resolveAccountLabel(accounts, selectedAccountId)}
      >
        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Entries</CardTitle>
              <CardDescription>
                Review past sessions and open an entry to edit.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="journal-account-filter">Trading account</Label>
                <DropdownSelect
                  id="journal-account-filter"
                  name="journal-account-filter"
                  value={selectedAccountId}
                  onValueChange={(value) => {
                    void handleAccountChange(value).catch(() => undefined);
                  }}
                  options={accountOptions}
                />
              </div>

              <div className="space-y-2">
                {filteredEntries.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No journal entries yet for this account.
                  </p>
                ) : (
                  filteredEntries.map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => startEdit(entry)}
                      className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
                        selectedEntryId === entry.id
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium">{formatEntryTitle(entry)}</p>
                        {entry.marketBias ? (
                          <Badge variant="outline">{entry.marketBias}</Badge>
                        ) : null}
                      </div>
                      <p className="text-muted-foreground mt-1 text-sm">
                        Confidence {entry.confidenceScore ?? "—"}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>
                  {isCreating
                    ? "New journal entry"
                    : selectedEntry
                      ? formatEntryTitle(selectedEntry)
                      : "Select or create an entry"}
                </CardTitle>
                <CardDescription>
                  Capture your market read, plan, confidence, and review for
                  this session.
                </CardDescription>
              </div>
              {isCreating || selectedEntry ? (
                <Button
                  type="button"
                  disabled={isSaving}
                  onClick={() => void handleSave()}
                >
                  {isSaving ? "Saving..." : "Save journal"}
                </Button>
              ) : null}
            </CardHeader>
            <CardContent className="space-y-6">
              {isCreating || selectedEntry ? (
                <>
                  {isCreating ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="journal-account">Trading account</Label>
                        <DropdownSelect
                          id="journal-account"
                          name="journal-account"
                          value={draftAccountId}
                          onValueChange={setDraftAccountId}
                          options={accountOptions}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="journal-date">Date</Label>
                        <Input
                          id="journal-date"
                          type="date"
                          value={draftDate}
                          onChange={(event) => setDraftDate(event.target.value)}
                        />
                      </div>
                    </div>
                  ) : null}

                  <JournalFields
                    idPrefix="daily"
                    values={journalValues}
                    onChange={setJournalValues}
                  />
                </>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Choose an existing entry from the list or create a new one.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </AccountSwitchLoadingOverlay>
    </div>
  );
}
