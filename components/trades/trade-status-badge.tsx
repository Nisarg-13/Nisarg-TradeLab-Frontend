import { Badge } from "@/components/ui/badge";
import type { TradeStatus } from "@/types/trade";

const STATUS_VARIANTS: Record<
  TradeStatus,
  "default" | "secondary" | "outline"
> = {
  OPEN: "default",
  CLOSED: "secondary",
  CANCELLED: "outline",
};

export function TradeStatusBadge({ status }: { status: TradeStatus }) {
  return (
    <Badge
      variant={STATUS_VARIANTS[status]}
      className={status === "CANCELLED" ? "text-destructive" : undefined}
    >
      {status}
    </Badge>
  );
}
