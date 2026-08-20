import { JournalFields } from "@/components/journal/journal-fields";
import { Button } from "@/components/ui/button";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Label } from "@/components/ui/label";
import { CHART_TIMEFRAME_OPTIONS } from "@/lib/constants/chart-timeframes";
import { PLAN_COMPLIANCE_OPTIONS } from "@/lib/constants/plan-compliance";
import { toggleSelection } from "@/lib/journal/trade-journal";
import type { JournalFieldValues } from "@/types/journal";
import type { Mistake, Strategy, Tag } from "@/types/strategy";

export function TradeJournalFormFields({
  idPrefix,
  strategies,
  tags,
  mistakes,
  chartTimeframe,
  onChartTimeframeChange,
  selectedStrategyIds,
  onSelectedStrategyIdsChange,
  selectedTagIds,
  onSelectedTagIdsChange,
  selectedMistakeIds,
  onSelectedMistakeIdsChange,
  planCompliance,
  onPlanComplianceChange,
  values,
  onValuesChange,
}: {
  idPrefix: string;
  strategies: Strategy[];
  tags: Tag[];
  mistakes: Mistake[];
  chartTimeframe: string;
  onChartTimeframeChange: (value: string) => void;
  selectedStrategyIds: string[];
  onSelectedStrategyIdsChange: (value: string[]) => void;
  selectedTagIds: string[];
  onSelectedTagIdsChange: (value: string[]) => void;
  selectedMistakeIds: string[];
  onSelectedMistakeIdsChange: (value: string[]) => void;
  planCompliance: string;
  onPlanComplianceChange: (value: string) => void;
  values: JournalFieldValues;
  onValuesChange: (value: JournalFieldValues) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-chart-timeframe`}>Chart timeframe</Label>
        <DropdownSelect
          id={`${idPrefix}-chart-timeframe`}
          name={`${idPrefix}-chart-timeframe`}
          value={chartTimeframe}
          onValueChange={onChartTimeframeChange}
          options={[
            { value: "", label: "Not set" },
            ...CHART_TIMEFRAME_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            })),
          ]}
        />
        <p className="text-muted-foreground text-xs">
          The timeframe you analyzed before taking this trade. Used in Insights
          analytics.
        </p>
      </div>

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
                  onSelectedStrategyIdsChange,
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
              variant={selectedTagIds.includes(tag.id) ? "default" : "outline"}
              onClick={() =>
                toggleSelection(selectedTagIds, tag.id, onSelectedTagIdsChange)
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
                selectedMistakeIds.includes(mistake.id) ? "default" : "outline"
              }
              onClick={() =>
                toggleSelection(
                  selectedMistakeIds,
                  mistake.id,
                  onSelectedMistakeIdsChange,
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
        <Label htmlFor={`${idPrefix}-plan-compliance`}>Plan compliance</Label>
        <DropdownSelect
          id={`${idPrefix}-plan-compliance`}
          name={`${idPrefix}-plan-compliance`}
          options={PLAN_COMPLIANCE_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          value={planCompliance}
          onValueChange={onPlanComplianceChange}
        />
      </div>

      <JournalFields
        idPrefix={idPrefix}
        values={values}
        onChange={onValuesChange}
      />
    </div>
  );
}
