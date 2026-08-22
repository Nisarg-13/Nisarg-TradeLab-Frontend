export type TradeWinLossCounts = {
  tradeCount: number;
  winCount?: number;
  lossCount?: number;
};

export function hasWinLossCounts(
  counts: TradeWinLossCounts,
): counts is TradeWinLossCounts & { winCount: number; lossCount: number } {
  return counts.winCount !== undefined && counts.lossCount !== undefined;
}

export function formatWinLossCounts(winCount: number, lossCount: number) {
  return `${winCount}W / ${lossCount}L`;
}

export function formatTradeCountInline({
  tradeCount,
  winCount,
  lossCount,
}: TradeWinLossCounts) {
  if (winCount !== undefined && lossCount !== undefined) {
    return `${tradeCount} · ${formatWinLossCounts(winCount, lossCount)}`;
  }

  return String(tradeCount);
}

export function formatTradesPhrase({
  tradeCount,
  winCount,
  lossCount,
}: TradeWinLossCounts) {
  const noun = `trade${tradeCount === 1 ? "" : "s"}`;

  if (winCount !== undefined && lossCount !== undefined) {
    return `${tradeCount} ${noun} · ${formatWinLossCounts(winCount, lossCount)}`;
  }

  return `${tradeCount} ${noun}`;
}
