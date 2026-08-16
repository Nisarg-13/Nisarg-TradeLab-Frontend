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

import { PLAN_COMPLIANCE_OPTIONS } from "@/lib/constants/plan-compliance";

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
  filters,
  accountId = "",
  isLoading,
  onChange,
  onApply,
}: {
  accounts: TradingAccount[];
  strategies: Strategy[];
  tags: Tag[];
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
            Filter every analytics view by account, date range, entry criteria,
            and psychology fields. Filters persist in the URL.
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
          <Label htmlFor="analytics-tag">Entry criteria</Label>
          <DropdownSelect
            id="analytics-tag"
            name="analytics-tag"
            options={tagOptions}
            value={filters.tagId ?? ""}
            onValueChange={(value) => updateField("tagId", value)}
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
          <Label htmlFor="analytics-session">Trading session</Label>
          <DropdownSelect
            id="analytics-session"
            name="analytics-session"
            options={SESSION_OPTIONS}
            value={filters.session ?? ""}
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
            value={filters.riskMin ?? ""}
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
            value={filters.riskMax ?? ""}
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
            value={filters.confidenceMin ?? ""}
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
            value={filters.confidenceMax ?? ""}
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
            value={filters.marketBias ?? ""}
            onValueChange={(value) =>
              updateField("marketBias", value as AnalyticsQuery["marketBias"])
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
            value={filters.planCompliance ?? ""}
            onValueChange={(value) =>
              updateField(
                "planCompliance",
                value as AnalyticsQuery["planCompliance"],
              )
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
