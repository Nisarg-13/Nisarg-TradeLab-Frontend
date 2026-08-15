"use client";

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
import type { AnalyticsQuery } from "@/types/analytics";
import type { TradingAccount } from "@/types/account";
import type { Mistake, Strategy } from "@/types/strategy";

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

const FOLLOWED_PLAN_OPTIONS = [
  { value: "", label: "Any plan status" },
  { value: "true", label: "Followed plan" },
  { value: "false", label: "Did not follow plan" },
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
  mistakes,
  filters,
  accountId = "",
  isLoading,
  onChange,
  onApply,
}: {
  accounts: TradingAccount[];
  strategies: Strategy[];
  mistakes: Mistake[];
  filters: AnalyticsQuery;
  accountId?: string;
  isLoading: boolean;
  onChange: (next: AnalyticsQuery) => void;
  onApply: () => void;
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
      ...filters,
      [field]: value || undefined,
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle>Global filters</CardTitle>
          <CardDescription>
            Filter every analytics view by account, date range, setup, and
            psychology fields.
          </CardDescription>
        </div>
        <Button type="button" disabled={isLoading} onClick={onApply}>
          {isLoading ? "Applying..." : "Apply filters"}
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="analytics-account">Account</Label>
          <DropdownSelect
            id="analytics-account"
            name="analytics-account"
            options={accountOptions}
            value={filters.tradingAccountId ?? accountId ?? ""}
            onValueChange={(value) => updateField("tradingAccountId", value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="analytics-closed-from">Closed from</Label>
          <Input
            id="analytics-closed-from"
            type="date"
            value={filters.closedFrom ?? ""}
            onChange={(event) => updateField("closedFrom", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="analytics-closed-to">Closed to</Label>
          <Input
            id="analytics-closed-to"
            type="date"
            value={filters.closedTo ?? ""}
            onChange={(event) => updateField("closedTo", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="analytics-symbol">Instrument</Label>
          <Input
            id="analytics-symbol"
            placeholder="EUR/USD"
            value={filters.symbol ?? ""}
            onChange={(event) => updateField("symbol", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="analytics-strategy">Strategy</Label>
          <DropdownSelect
            id="analytics-strategy"
            name="analytics-strategy"
            options={strategyOptions}
            value={filters.strategyId ?? ""}
            onValueChange={(value) => updateField("strategyId", value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="analytics-direction">Direction</Label>
          <DropdownSelect
            id="analytics-direction"
            name="analytics-direction"
            options={DIRECTION_OPTIONS}
            value={filters.direction ?? ""}
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
            value={filters.result ?? ""}
            onValueChange={(value) =>
              updateField("result", value as AnalyticsQuery["result"])
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="analytics-mistake">Mistake</Label>
          <DropdownSelect
            id="analytics-mistake"
            name="analytics-mistake"
            options={mistakeOptions}
            value={filters.mistakeId ?? ""}
            onValueChange={(value) => updateField("mistakeId", value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="analytics-pre-emotion">Pre-trade emotion</Label>
          <DropdownSelect
            id="analytics-pre-emotion"
            name="analytics-pre-emotion"
            options={EMOTION_OPTIONS}
            value={filters.preTradeEmotion ?? ""}
            onValueChange={(value) => updateField("preTradeEmotion", value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="analytics-post-emotion">Post-trade emotion</Label>
          <DropdownSelect
            id="analytics-post-emotion"
            name="analytics-post-emotion"
            options={EMOTION_OPTIONS}
            value={filters.postTradeEmotion ?? ""}
            onValueChange={(value) => updateField("postTradeEmotion", value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="analytics-followed-plan">Plan compliance</Label>
          <DropdownSelect
            id="analytics-followed-plan"
            name="analytics-followed-plan"
            options={FOLLOWED_PLAN_OPTIONS}
            value={filters.followedPlan ?? ""}
            onValueChange={(value) =>
              updateField(
                "followedPlan",
                value as AnalyticsQuery["followedPlan"],
              )
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
