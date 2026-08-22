"use client";

import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PLAN_COMPLIANCE_OPTIONS } from "@/lib/constants/plan-compliance";
import { cn } from "@/lib/utils";
import type { AnalyticsQuery } from "@/types/analytics";
import type { TradingAccount } from "@/types/account";
import type { Mistake, Strategy, Tag } from "@/types/strategy";

const DIRECTION_OPTIONS = [
  { value: "", label: "All directions" },
  { value: "LONG", label: "Long" },
  { value: "SHORT", label: "Short" },
];

const RESULT_OPTIONS = [
  { value: "", label: "All results" },
  { value: "WIN", label: "Winners" },
  { value: "LOSS", label: "Losers" },
  { value: "BREAKEVEN", label: "Breakeven" },
];

const MARKET_BIAS_OPTIONS = [
  { value: "", label: "Any market bias" },
  { value: "BULLISH", label: "Bullish" },
  { value: "BEARISH", label: "Bearish" },
  { value: "NEUTRAL", label: "Neutral" },
];

const SESSION_OPTIONS = [
  { value: "", label: "Any session" },
  { value: "ASIA", label: "Asia" },
  { value: "LONDON", label: "London" },
  { value: "OVERLAP", label: "London / NY overlap" },
  { value: "NEW_YORK", label: "New York" },
  { value: "OFF_HOURS", label: "Off hours" },
];

const EMOTION_OPTIONS = [
  { value: "", label: "Any emotion" },
  ...[
    "CALM",
    "CONFIDENT",
    "FEAR",
    "FOMO",
    "GREED",
    "IMPATIENT",
    "REVENGE",
    "OTHER",
  ].map((value) => ({
    value,
    label: value.charAt(0) + value.slice(1).toLowerCase(),
  })),
];

export function AnalyticsFilters({
  accounts,
  strategies,
  tags,
  mistakes,
  draftFilters,
  accountId = "",
  activeFilterCount,
  filtersOpen,
  isLoading,
  onToggleOpen,
  onChange,
  onApply,
  onClear,
}: {
  accounts: TradingAccount[];
  strategies: Strategy[];
  tags: Tag[];
  mistakes: Mistake[];
  draftFilters: AnalyticsQuery;
  accountId?: string;
  activeFilterCount: number;
  filtersOpen: boolean;
  isLoading: boolean;
  onToggleOpen: () => void;
  onChange: (next: AnalyticsQuery) => void;
  onApply: () => void;
  onClear: () => void;
}) {
  const accountOptions = [
    { value: "", label: "All accounts" },
    ...accounts.map((account) => ({
      value: account.id,
      label: account.name,
    })),
  ];

  const strategyOptions = [
    { value: "", label: "All strategies" },
    ...strategies.map((strategy) => ({
      value: strategy.id,
      label: strategy.name,
    })),
  ];

  const tagOptions = [
    { value: "", label: "All entry criteria" },
    ...tags.map((tag) => ({
      value: tag.id,
      label: tag.name,
    })),
  ];

  const mistakeOptions = [
    { value: "", label: "All mistakes" },
    ...mistakes.map((mistake) => ({
      value: mistake.id,
      label: mistake.name,
    })),
  ];

  function updateField<K extends keyof AnalyticsQuery>(
    field: K,
    value: AnalyticsQuery[K] | "",
  ) {
    onChange({
      ...draftFilters,
      [field]: value || undefined,
    });
  }

  return (
    <Card>
      <CardHeader
        className={cn(
          "gap-4 sm:flex-row sm:items-start sm:justify-between",
          filtersOpen && "border-b pb-5",
        )}
      >
        <div className="min-w-0 flex-1 space-y-1">
          <CardTitle className="leading-snug">Global filters</CardTitle>
          <CardDescription>
            Filter every analytics view by account, date range, entry criteria,
            and psychology fields.
            {activeFilterCount > 0
              ? ` · ${activeFilterCount} filter${activeFilterCount === 1 ? "" : "s"} active`
              : ""}
          </CardDescription>
        </div>
        <Button
          type="button"
          variant={filtersOpen ? "secondary" : "outline"}
          className="shrink-0"
          onClick={onToggleOpen}
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Filters
          {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </Button>
      </CardHeader>
      {filtersOpen ? (
        <div className="bg-muted/20 border-b px-6 py-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="analytics-account">Account</Label>
              <DropdownSelect
                id="analytics-account"
                name="analytics-account"
                options={accountOptions}
                value={draftFilters.tradingAccountId ?? accountId ?? ""}
                onValueChange={(value) =>
                  updateField("tradingAccountId", value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="analytics-closed-from">Closed from</Label>
              <Input
                id="analytics-closed-from"
                type="date"
                value={draftFilters.closedFrom ?? ""}
                onChange={(event) =>
                  updateField("closedFrom", event.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="analytics-closed-to">Closed to</Label>
              <Input
                id="analytics-closed-to"
                type="date"
                value={draftFilters.closedTo ?? ""}
                onChange={(event) =>
                  updateField("closedTo", event.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="analytics-symbol">Instrument</Label>
              <Input
                id="analytics-symbol"
                placeholder="EUR/USD"
                value={draftFilters.symbol ?? ""}
                onChange={(event) => updateField("symbol", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="analytics-strategy">Strategy</Label>
              <DropdownSelect
                id="analytics-strategy"
                name="analytics-strategy"
                options={strategyOptions}
                value={draftFilters.strategyId ?? ""}
                onValueChange={(value) => updateField("strategyId", value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="analytics-tag">Entry criteria</Label>
              <DropdownSelect
                id="analytics-tag"
                name="analytics-tag"
                options={tagOptions}
                value={draftFilters.tagId ?? ""}
                onValueChange={(value) => updateField("tagId", value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="analytics-direction">Direction</Label>
              <DropdownSelect
                id="analytics-direction"
                name="analytics-direction"
                options={DIRECTION_OPTIONS}
                value={draftFilters.direction ?? ""}
                onValueChange={(value) =>
                  updateField("direction", value as AnalyticsQuery["direction"])
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="analytics-result">Result</Label>
              <DropdownSelect
                id="analytics-result"
                name="analytics-result"
                options={RESULT_OPTIONS}
                value={draftFilters.result ?? ""}
                onValueChange={(value) =>
                  updateField("result", value as AnalyticsQuery["result"])
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="analytics-session">Trading session</Label>
              <DropdownSelect
                id="analytics-session"
                name="analytics-session"
                options={SESSION_OPTIONS}
                value={draftFilters.session ?? ""}
                onValueChange={(value) =>
                  updateField("session", value as AnalyticsQuery["session"])
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="analytics-risk-min">Risk % min</Label>
              <Input
                id="analytics-risk-min"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.25"
                value={draftFilters.riskMin ?? ""}
                onChange={(event) => updateField("riskMin", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="analytics-risk-max">Risk % max</Label>
              <Input
                id="analytics-risk-max"
                type="number"
                min="0"
                step="0.01"
                placeholder="1.00"
                value={draftFilters.riskMax ?? ""}
                onChange={(event) => updateField("riskMax", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="analytics-confidence-min">Confidence min</Label>
              <Input
                id="analytics-confidence-min"
                type="number"
                min="1"
                max="10"
                step="1"
                placeholder="1"
                value={draftFilters.confidenceMin ?? ""}
                onChange={(event) =>
                  updateField("confidenceMin", event.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="analytics-confidence-max">Confidence max</Label>
              <Input
                id="analytics-confidence-max"
                type="number"
                min="1"
                max="10"
                step="1"
                placeholder="10"
                value={draftFilters.confidenceMax ?? ""}
                onChange={(event) =>
                  updateField("confidenceMax", event.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="analytics-market-bias">Market bias</Label>
              <DropdownSelect
                id="analytics-market-bias"
                name="analytics-market-bias"
                options={MARKET_BIAS_OPTIONS}
                value={draftFilters.marketBias ?? ""}
                onValueChange={(value) =>
                  updateField(
                    "marketBias",
                    value as AnalyticsQuery["marketBias"],
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="analytics-mistake">Mistake</Label>
              <DropdownSelect
                id="analytics-mistake"
                name="analytics-mistake"
                options={mistakeOptions}
                value={draftFilters.mistakeId ?? ""}
                onValueChange={(value) => updateField("mistakeId", value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="analytics-pre-emotion">Pre-trade emotion</Label>
              <DropdownSelect
                id="analytics-pre-emotion"
                name="analytics-pre-emotion"
                options={EMOTION_OPTIONS}
                value={draftFilters.preTradeEmotion ?? ""}
                onValueChange={(value) => updateField("preTradeEmotion", value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="analytics-post-emotion">Post-trade emotion</Label>
              <DropdownSelect
                id="analytics-post-emotion"
                name="analytics-post-emotion"
                options={EMOTION_OPTIONS}
                value={draftFilters.postTradeEmotion ?? ""}
                onValueChange={(value) =>
                  updateField("postTradeEmotion", value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="analytics-plan-compliance">Plan compliance</Label>
              <DropdownSelect
                id="analytics-plan-compliance"
                name="analytics-plan-compliance"
                options={[
                  { value: "", label: "Any plan status" },
                  ...PLAN_COMPLIANCE_OPTIONS.filter(
                    (option) => option.value !== "",
                  ),
                ]}
                value={draftFilters.planCompliance ?? ""}
                onValueChange={(value) =>
                  updateField(
                    "planCompliance",
                    value as AnalyticsQuery["planCompliance"],
                  )
                }
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
            <Button type="button" disabled={isLoading} onClick={onApply}>
              {isLoading ? "Applying..." : "Apply filters"}
            </Button>
            {activeFilterCount > 0 ? (
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={onClear}
              >
                Clear
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
    </Card>
  );
}
