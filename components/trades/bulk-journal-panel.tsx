"use client";

import { useState } from "react";
import { toast } from "sonner";

import { TradeJournalFormFields } from "@/components/journal/trade-journal-form-fields";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { bulkUpdateTradeJournal } from "@/lib/api/trades";
import { useClientAuthToken } from "@/lib/auth/client";
import {
  buildJournalUpdateInput,
  EMPTY_JOURNAL_FORM,
} from "@/lib/journal/trade-journal";
import type { Mistake, Strategy, Tag } from "@/types/strategy";

export function BulkJournalPanel({
  selectedTradeIds,
  selectedSymbols,
  strategies,
  tags,
  mistakes,
  onSaved,
  onCancel,
}: {
  selectedTradeIds: string[];
  selectedSymbols: string[];
  strategies: Strategy[];
  tags: Tag[];
  mistakes: Mistake[];
  onSaved: () => void;
  onCancel: () => void;
}) {
  const getAuthToken = useClientAuthToken();
  const [isSaving, setIsSaving] = useState(false);
  const [values, setValues] = useState(EMPTY_JOURNAL_FORM.values);
  const [planCompliance, setPlanCompliance] = useState(
    EMPTY_JOURNAL_FORM.planCompliance,
  );
  const [selectedStrategyIds, setSelectedStrategyIds] = useState<string[]>(
    EMPTY_JOURNAL_FORM.strategyIds,
  );
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    EMPTY_JOURNAL_FORM.tagIds,
  );
  const [selectedMistakeIds, setSelectedMistakeIds] = useState<string[]>(
    EMPTY_JOURNAL_FORM.mistakeIds,
  );
  const [chartTimeframe, setChartTimeframe] = useState(
    EMPTY_JOURNAL_FORM.chartTimeframe,
  );

  const uniqueSymbols = [...new Set(selectedSymbols)];

  async function handleSave() {
    setIsSaving(true);

    try {
      const response = await bulkUpdateTradeJournal(getAuthToken, {
        tradeIds: selectedTradeIds,
        ...buildJournalUpdateInput({
          chartTimeframe,
          strategyIds: selectedStrategyIds,
          tagIds: selectedTagIds,
          mistakeIds: selectedMistakeIds,
          values,
          planCompliance,
        }),
      });

      toast.success(
        `Journal saved for ${response.meta.updated} trade${response.meta.updated === 1 ? "" : "s"}.`,
      );
      onSaved();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save journal for selected trades.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="border-primary/30">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Bulk journal edit</CardTitle>
          <CardDescription>
            Apply the same journal details to {selectedTradeIds.length} selected
            trade{selectedTradeIds.length === 1 ? "" : "s"}
            {uniqueSymbols.length > 0 ? ` (${uniqueSymbols.join(", ")})` : ""}.
            This replaces existing journal details on each selected trade.
          </CardDescription>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isSaving}
            onClick={() => void handleSave()}
          >
            {isSaving ? "Saving..." : "Apply to selected"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <TradeJournalFormFields
          idPrefix="bulk"
          strategies={strategies}
          tags={tags}
          mistakes={mistakes}
          chartTimeframe={chartTimeframe}
          onChartTimeframeChange={setChartTimeframe}
          selectedStrategyIds={selectedStrategyIds}
          onSelectedStrategyIdsChange={setSelectedStrategyIds}
          selectedTagIds={selectedTagIds}
          onSelectedTagIdsChange={setSelectedTagIds}
          selectedMistakeIds={selectedMistakeIds}
          onSelectedMistakeIdsChange={setSelectedMistakeIds}
          planCompliance={planCompliance}
          onPlanComplianceChange={setPlanCompliance}
          values={values}
          onValuesChange={setValues}
        />
      </CardContent>
    </Card>
  );
}
