"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/page-header";
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
import { RangeInput } from "@/components/ui/range-input";
import { Textarea } from "@/components/ui/textarea";
import {
  createDailyJournalEntry,
  listDailyJournalEntries,
  updateDailyJournalEntry,
} from "@/lib/api/journal";
import { useClientAuthToken } from "@/lib/auth/client";
import type { TradingAccount } from "@/types/account";
import type {
  DailyJournal,
  MarketBias,
  UpdateDailyJournalInput,
} from "@/types/journal";

const MARKET_BIAS_OPTIONS: { value: MarketBias; label: string }[] = [
  { value: "BULLISH", label: "Bullish" },
  { value: "BEARISH", label: "Bearish" },
  { value: "NEUTRAL", label: "Neutral" },
];

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function emptyDraft(accountId: string): UpdateDailyJournalInput & {
  tradingAccountId: string;
  date: string;
} {
  return {
    tradingAccountId: accountId,
    date: todayIsoDate(),
    sleepQuality: 7,
    focus: 7,
    mood: 7,
    marketBias: "NEUTRAL",
    plannedMaxTrades: undefined,
    plannedMaxRisk: undefined,
    preMarketNotes: "",
    postMarketReview: "",
    whatWentWell: "",
    whatWentWrong: "",
    tomorrowImprovement: "",
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
  initialEntries,
}: {
  accounts: TradingAccount[];
  initialEntries: DailyJournal[];
}) {
  const getAuthToken = useClientAuthToken();
  const [entries, setEntries] = useState(initialEntries);
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts[0]?.id ?? "",
  );
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(
    initialEntries[0]?.id ?? null,
  );
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draft, setDraft] = useState(() => emptyDraft(accounts[0]?.id ?? ""));

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
      entries.filter((entry) =>
        selectedAccountId ? entry.tradingAccountId === selectedAccountId : true,
      ),
    [entries, selectedAccountId],
  );

  const selectedEntry =
    entries.find((entry) => entry.id === selectedEntryId) ?? null;

  function updateDraftField<K extends keyof typeof draft>(
    key: K,
    value: (typeof draft)[K],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function startCreate() {
    setIsCreating(true);
    setSelectedEntryId(null);
    setDraft(emptyDraft(selectedAccountId || accounts[0]?.id || ""));
  }

  function startEdit(entry: DailyJournal) {
    setIsCreating(false);
    setSelectedEntryId(entry.id);
    setDraft({
      tradingAccountId: entry.tradingAccountId,
      date: entry.date,
      sleepQuality: entry.sleepQuality ?? 7,
      focus: entry.focus ?? 7,
      mood: entry.mood ?? 7,
      marketBias: entry.marketBias ?? "NEUTRAL",
      plannedMaxTrades: entry.plannedMaxTrades ?? undefined,
      plannedMaxRisk: entry.plannedMaxRisk
        ? Number(entry.plannedMaxRisk)
        : undefined,
      preMarketNotes: entry.preMarketNotes ?? "",
      postMarketReview: entry.postMarketReview ?? "",
      whatWentWell: entry.whatWentWell ?? "",
      whatWentWrong: entry.whatWentWrong ?? "",
      tomorrowImprovement: entry.tomorrowImprovement ?? "",
    });
  }

  async function refreshEntries(accountId?: string) {
    const response = await listDailyJournalEntries(getAuthToken, {
      tradingAccountId: accountId,
    });
    setEntries(response.data);
    return response.data;
  }

  async function handleSave() {
    if (!draft.tradingAccountId) {
      toast.error("Select a trading account.");
      return;
    }

    setIsSaving(true);

    try {
      if (isCreating) {
        const response = await createDailyJournalEntry(getAuthToken, {
          tradingAccountId: draft.tradingAccountId,
          date: draft.date,
          sleepQuality: draft.sleepQuality,
          focus: draft.focus,
          mood: draft.mood,
          marketBias: draft.marketBias,
          plannedMaxTrades: draft.plannedMaxTrades,
          plannedMaxRisk: draft.plannedMaxRisk,
          preMarketNotes: draft.preMarketNotes || undefined,
          postMarketReview: draft.postMarketReview || undefined,
          whatWentWell: draft.whatWentWell || undefined,
          whatWentWrong: draft.whatWentWrong || undefined,
          tomorrowImprovement: draft.tomorrowImprovement || undefined,
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
          {
            sleepQuality: draft.sleepQuality,
            focus: draft.focus,
            mood: draft.mood,
            marketBias: draft.marketBias,
            plannedMaxTrades: draft.plannedMaxTrades,
            plannedMaxRisk: draft.plannedMaxRisk,
            preMarketNotes: draft.preMarketNotes || undefined,
            postMarketReview: draft.postMarketReview || undefined,
            whatWentWell: draft.whatWentWell || undefined,
            whatWentWrong: draft.whatWentWrong || undefined,
            tomorrowImprovement: draft.tomorrowImprovement || undefined,
          },
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
        description="Capture mindset, session planning, and post-market reviews."
      >
        <Button type="button" onClick={startCreate}>
          New entry
        </Button>
      </PageHeader>

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
                  setSelectedAccountId(value);
                  void refreshEntries(value).catch(() => undefined);
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
                      Sleep {entry.sleepQuality ?? "—"} · Focus{" "}
                      {entry.focus ?? "—"} · Mood {entry.mood ?? "—"}
                    </p>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isCreating
                ? "New journal entry"
                : selectedEntry
                  ? formatEntryTitle(selectedEntry)
                  : "Select or create an entry"}
            </CardTitle>
            <CardDescription>
              Track readiness, bias, and what you learned from the session.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isCreating || selectedEntry ? (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  {isCreating ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="journal-account">Trading account</Label>
                        <DropdownSelect
                          id="journal-account"
                          name="journal-account"
                          value={draft.tradingAccountId}
                          onValueChange={(value) =>
                            updateDraftField("tradingAccountId", value)
                          }
                          options={accountOptions}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="journal-date">Date</Label>
                        <Input
                          id="journal-date"
                          type="date"
                          value={draft.date}
                          onChange={(event) =>
                            updateDraftField("date", event.target.value)
                          }
                        />
                      </div>
                    </>
                  ) : null}

                  <div className="space-y-2">
                    <Label htmlFor="journal-bias">Market bias</Label>
                    <DropdownSelect
                      id="journal-bias"
                      name="journal-bias"
                      value={draft.marketBias ?? "NEUTRAL"}
                      onValueChange={(value) =>
                        updateDraftField("marketBias", value as MarketBias)
                      }
                      options={MARKET_BIAS_OPTIONS}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="journal-max-trades">
                      Planned max trades
                    </Label>
                    <Input
                      id="journal-max-trades"
                      type="number"
                      min="1"
                      value={draft.plannedMaxTrades ?? ""}
                      onChange={(event) =>
                        updateDraftField(
                          "plannedMaxTrades",
                          event.target.value
                            ? Number(event.target.value)
                            : undefined,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="journal-max-risk">
                      Planned max risk (%)
                    </Label>
                    <Input
                      id="journal-max-risk"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={draft.plannedMaxRisk ?? ""}
                      onChange={(event) =>
                        updateDraftField(
                          "plannedMaxRisk",
                          event.target.value
                            ? Number(event.target.value)
                            : undefined,
                        )
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <RangeInput
                    id="journal-sleep"
                    label="Sleep quality"
                    value={draft.sleepQuality ?? 7}
                    onChange={(value) =>
                      updateDraftField("sleepQuality", value)
                    }
                  />
                  <RangeInput
                    id="journal-focus"
                    label="Focus"
                    value={draft.focus ?? 7}
                    onChange={(value) => updateDraftField("focus", value)}
                  />
                  <RangeInput
                    id="journal-mood"
                    label="Mood"
                    value={draft.mood ?? 7}
                    onChange={(value) => updateDraftField("mood", value)}
                  />
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="journal-pre-market">Pre-market notes</Label>
                    <Textarea
                      id="journal-pre-market"
                      rows={4}
                      value={draft.preMarketNotes ?? ""}
                      onChange={(event) =>
                        updateDraftField("preMarketNotes", event.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="journal-post-market">
                      Post-market review
                    </Label>
                    <Textarea
                      id="journal-post-market"
                      rows={4}
                      value={draft.postMarketReview ?? ""}
                      onChange={(event) =>
                        updateDraftField("postMarketReview", event.target.value)
                      }
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="journal-well">What went well</Label>
                      <Textarea
                        id="journal-well"
                        rows={4}
                        value={draft.whatWentWell ?? ""}
                        onChange={(event) =>
                          updateDraftField("whatWentWell", event.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="journal-wrong">What went wrong</Label>
                      <Textarea
                        id="journal-wrong"
                        rows={4}
                        value={draft.whatWentWrong ?? ""}
                        onChange={(event) =>
                          updateDraftField("whatWentWrong", event.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="journal-tomorrow">
                        Tomorrow improvement
                      </Label>
                      <Textarea
                        id="journal-tomorrow"
                        rows={4}
                        value={draft.tomorrowImprovement ?? ""}
                        onChange={(event) =>
                          updateDraftField(
                            "tomorrowImprovement",
                            event.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <Button type="button" disabled={isSaving} onClick={handleSave}>
                  {isSaving ? "Saving..." : "Save entry"}
                </Button>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                Choose an existing entry from the list or create a new one.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
