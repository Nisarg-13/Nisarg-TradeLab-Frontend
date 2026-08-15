import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Label } from "@/components/ui/label";
import { RangeInput } from "@/components/ui/range-input";
import { Textarea } from "@/components/ui/textarea";
import { MARKET_BIAS_SELECT_OPTIONS } from "@/lib/constants/market-bias";
import type { JournalFieldValues } from "@/types/journal";

export function JournalFields({
  idPrefix,
  values,
  onChange,
}: {
  idPrefix: string;
  values: JournalFieldValues;
  onChange: (values: JournalFieldValues) => void;
}) {
  function updateField<K extends keyof JournalFieldValues>(
    key: K,
    value: JournalFieldValues[K],
  ) {
    onChange({ ...values, [key]: value });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-market-bias`}>Market bias</Label>
          <DropdownSelect
            id={`${idPrefix}-market-bias`}
            name={`${idPrefix}-market-bias`}
            options={MARKET_BIAS_SELECT_OPTIONS}
            value={values.marketBias}
            onValueChange={(value) => updateField("marketBias", value)}
          />
        </div>
        <RangeInput
          id={`${idPrefix}-confidence`}
          label="Confidence while taking trade"
          value={values.confidenceScore}
          onChange={(value) => updateField("confidenceScore", value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-pre-plan`}>
          Plan before taking the trade
        </Label>
        <Textarea
          id={`${idPrefix}-pre-plan`}
          rows={4}
          placeholder="What was your setup, trigger, and plan before entry?"
          value={values.preTradePlan}
          onChange={(event) => updateField("preTradePlan", event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-post-plan`}>
          Plan after taking the trade
        </Label>
        <Textarea
          id={`${idPrefix}-post-plan`}
          rows={4}
          placeholder="How did you plan to manage the trade after entry?"
          value={values.postTradePlan}
          onChange={(event) => updateField("postTradePlan", event.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-went-well`}>What went well</Label>
          <Textarea
            id={`${idPrefix}-went-well`}
            rows={4}
            value={values.whatWentWell}
            onChange={(event) =>
              updateField("whatWentWell", event.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-went-wrong`}>What went wrong</Label>
          <Textarea
            id={`${idPrefix}-went-wrong`}
            rows={4}
            value={values.whatWentWrong}
            onChange={(event) =>
              updateField("whatWentWrong", event.target.value)
            }
          />
        </div>
      </div>
    </div>
  );
}
