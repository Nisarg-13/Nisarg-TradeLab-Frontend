import { Badge } from "@/components/ui/badge";
import type { TradeDirection } from "@/types/risk";

const DIRECTION_VARIANTS: Record<
  TradeDirection,
  "default" | "secondary" | "profit" | "loss"
> = {
  LONG: "profit",
  SHORT: "loss",
};

const DIRECTION_LABELS: Record<TradeDirection, string> = {
  LONG: "Long",
  SHORT: "Short",
};

export function TradeDirectionBadge({
  direction,
}: {
  direction: TradeDirection;
}) {
  return (
    <Badge variant={DIRECTION_VARIANTS[direction]}>
      {DIRECTION_LABELS[direction]}
    </Badge>
  );
}
