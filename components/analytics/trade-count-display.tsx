import {
  formatTradeCountInline,
  formatTradesPhrase,
  formatWinLossCounts,
  hasWinLossCounts,
  type TradeWinLossCounts,
} from "@/lib/formatting/trade-count";
import { cn } from "@/lib/utils";

export function TradeCountDisplay({
  tradeCount,
  winCount,
  lossCount,
  className,
  stacked = true,
}: TradeWinLossCounts & {
  className?: string;
  stacked?: boolean;
}) {
  const counts = { tradeCount, winCount, lossCount };

  if (!hasWinLossCounts(counts)) {
    return <span className={cn("tabular-data", className)}>{tradeCount}</span>;
  }

  if (!stacked) {
    return (
      <span className={cn("tabular-data", className)}>
        {formatTradeCountInline(counts)}
      </span>
    );
  }

  return (
    <div className={cn("tabular-data space-y-0.5", className)}>
      <div>{tradeCount}</div>
      <div className="text-muted-foreground text-xs">
        {formatWinLossCounts(counts.winCount, counts.lossCount)}
      </div>
    </div>
  );
}

export function TradeCountPhrase({
  tradeCount,
  winCount,
  lossCount,
  className,
}: TradeWinLossCounts & { className?: string }) {
  return (
    <span className={className}>
      {formatTradesPhrase({ tradeCount, winCount, lossCount })}
    </span>
  );
}
