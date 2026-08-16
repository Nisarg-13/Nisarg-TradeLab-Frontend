"use client";

import { useState } from "react";
import { toast } from "sonner";

import { JournalFields } from "@/components/journal/journal-fields";
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
import { updateTrade } from "@/lib/api/trades";
import { useClientAuthToken } from "@/lib/auth/client";
import { PLAN_COMPLIANCE_OPTIONS } from "@/lib/constants/plan-compliance";
import type { JournalFieldValues } from "@/types/journal";
import type { MarketBias } from "@/types/journal";
import type { Mistake, Strategy, Tag } from "@/types/strategy";
import type {
  PlanComplianceStatus,
  Trade,
  TradeReviewInput,
} from "@/types/trade";

function toggleSelection(
  current: string[],
  id: string,
  setter: (value: string[]) => void,
) {
  setter(
    current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id],
  );
}

function toJournalValues(review: Trade["review"]): JournalFieldValues {
  return {
    marketBias: review?.marketBias ?? "",
    preTradePlan: review?.preTradePlan ?? "",
    postTradePlan: review?.postTradePlan ?? "",
    confidenceScore: review?.confidenceScore ?? 7,
    whatWentWell: review?.whatWentWell ?? "",
    whatWentWrong: review?.whatWentWrong ?? "",
  };
}

function buildReviewPayload(
  values: JournalFieldValues,
  planCompliance: string,
): TradeReviewInput {
  return {
    marketBias: values.marketBias
      ? (values.marketBias as MarketBias)
      : undefined,
    preTradePlan: values.preTradePlan || undefined,
    postTradePlan: values.postTradePlan || undefined,
    confidenceScore: values.confidenceScore,
    planCompliance: planCompliance
      ? (planCompliance as PlanComplianceStatus)
      : undefined,
    whatWentWell: values.whatWentWell || undefined,
    whatWentWrong: values.whatWentWrong || undefined,
  };
}

export function TradeJournalCard({
  trade,
  strategies,
  tags,
  mistakes,
  onUpdated,
}: {
  trade: Trade;
  strategies: Strategy[];
  tags: Tag[];
  mistakes: Mistake[];
  onUpdated: (trade: Trade) => void;
}) {
  const getAuthToken = useClientAuthToken();
  const [isSaving, setIsSaving] = useState(false);
  const [values, setValues] = useState(() => toJournalValues(trade.review));
  const [planCompliance, setPlanCompliance] = useState(
    trade.review?.planCompliance ?? "",
  );
  const [selectedStrategyIds, setSelectedStrategyIds] = useState(() =>
    trade.strategies.map((strategy) => strategy.id),
  );
  const [selectedTagIds, setSelectedTagIds] = useState(() =>
    trade.tags.map((tag) => tag.id),
  );
  const [selectedMistakeIds, setSelectedMistakeIds] = useState(() =>
    trade.mistakes.map((mistake) => mistake.id),
  );

  async function handleSave() {
    setIsSaving(true);

    try {
      const response = await updateTrade(getAuthToken, trade.id, {
        strategyIds: selectedStrategyIds,
        tagIds: selectedTagIds,
        mistakeIds: selectedMistakeIds,
        review: buildReviewPayload(values, planCompliance),
      });

      toast.success("Trade journal saved.");
      onUpdated(response.data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save trade journal.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Trade journal</CardTitle>
          <CardDescription>
            Capture strategies, entry criteria, mistakes, market read, plan,
            confidence, and review for this trade.
          </CardDescription>
        </div>
        <Button
          type="button"
          disabled={isSaving}
          onClick={() => void handleSave()}
        >
          {isSaving ? "Saving..." : "Save journal"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Strategies</Label>
          <div className="flex flex-wrap gap-2">
            {strategies.map((strategy) => (
              <Button
                key={strategy.id}
                type="button"
                size="sm"
                variant={
                  selectedStrategyIds.includes(strategy.id)
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  toggleSelection(
                    selectedStrategyIds,
                    strategy.id,
                    setSelectedStrategyIds,
                  )
                }
              >
                {strategy.name}
              </Button>
            ))}
            {strategies.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No strategies yet. Create strategies on the Strategies page.
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Entry criteria</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Button
                key={tag.id}
                type="button"
                size="sm"
                variant={
                  selectedTagIds.includes(tag.id) ? "default" : "outline"
                }
                onClick={() =>
                  toggleSelection(selectedTagIds, tag.id, setSelectedTagIds)
                }
              >
                {tag.name}
              </Button>
            ))}
            {tags.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No entry criteria yet. Create entry criteria on the Strategies
                page.
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Mistakes</Label>
          <div className="flex flex-wrap gap-2">
            {mistakes.map((mistake) => (
              <Button
                key={mistake.id}
                type="button"
                size="sm"
                variant={
                  selectedMistakeIds.includes(mistake.id)
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  toggleSelection(
                    selectedMistakeIds,
                    mistake.id,
                    setSelectedMistakeIds,
                  )
                }
              >
                {mistake.name}
              </Button>
            ))}
            {mistakes.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No mistakes yet. Create mistakes on the Strategies page.
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="trade-plan-compliance">Plan compliance</Label>
          <DropdownSelect
            id="trade-plan-compliance"
            name="trade-plan-compliance"
            options={PLAN_COMPLIANCE_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            value={planCompliance}
            onValueChange={setPlanCompliance}
          />
        </div>

        <JournalFields idPrefix="trade" values={values} onChange={setValues} />
      </CardContent>
    </Card>
  );
}
