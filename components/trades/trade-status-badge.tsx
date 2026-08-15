import { Badge } from "@/components/ui/badge";
import type { TradeStatus } from "@/types/trade";

const STATUS_VARIANTS: Record<
  TradeStatus,
  "default" | "secondary" | "profit" | "loss"
> = {
  OPEN: "profit",
  CLOSED: "secondary",
  CANCELLED: "loss",
};

export function TradeStatusBadge({ status }: { status: TradeStatus }) {
  return <Badge variant={STATUS_VARIANTS[status]}>{status}</Badge>;
}
