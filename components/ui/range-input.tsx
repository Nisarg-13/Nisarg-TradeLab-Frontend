import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function RangeInput({
  id,
  label,
  value,
  onChange,
  min = 1,
  max = 10,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        <span className="font-mono text-sm tabular-nums">{value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className={cn(
          "accent-primary bg-muted h-2 w-full cursor-pointer appearance-none rounded-full",
        )}
      />
      <div className="text-muted-foreground flex justify-between text-xs">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
