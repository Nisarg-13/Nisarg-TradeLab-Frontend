import {
  TRADING_SESSION_BANDS,
  TRADING_SESSION_ORDER,
  type TradingSessionId,
} from "@/lib/constants/trading-sessions";
import type {
  SessionPerformance,
  SessionSymbolRow,
  SessionWeekdayCell,
} from "@/types/analytics";

export function orderSessionPerformance(
  sessions: SessionPerformance[],
): SessionPerformance[] {
  const byId = new Map(sessions.map((session) => [session.session, session]));

  return TRADING_SESSION_ORDER.map((sessionId) => {
    const band = TRADING_SESSION_BANDS.find((entry) => entry.id === sessionId);

    return (
      byId.get(sessionId) ?? {
        session: sessionId,
        sessionLabel: band?.label ?? sessionId,
        tradeCount: 0,
        winCount: 0,
        lossCount: 0,
        netPnl: "0.00",
        totalR: null,
        winRate: null,
        averageR: null,
        moneyExpectancy: null,
        rExpectancy: null,
        profitFactor: null,
        sampleConfidence: "INSUFFICIENT" as const,
      }
    );
  });
}

export function buildSessionContribution(sessions: SessionPerformance[]) {
  const active = sessions.filter((session) => session.tradeCount > 0);
  const totalTrades = active.reduce(
    (sum, session) => sum + session.tradeCount,
    0,
  );
  const totalAbsPnl = active.reduce(
    (sum, session) => sum + Math.abs(Number(session.netPnl)),
    0,
  );

  return active.map((session) => ({
    session: session.session,
    label: session.sessionLabel,
    tradeCount: session.tradeCount,
    netPnl: Number(session.netPnl),
    tradeShare: totalTrades > 0 ? (session.tradeCount / totalTrades) * 100 : 0,
    profitShare:
      totalAbsPnl > 0
        ? (Math.abs(Number(session.netPnl)) / totalAbsPnl) * 100
        : 0,
    moneyExpectancy: session.moneyExpectancy
      ? Number(session.moneyExpectancy)
      : null,
  }));
}

export function buildSessionInstrumentMatrix(
  rows: SessionSymbolRow[],
  maxSymbols = 6,
) {
  const symbolTotals = new Map<string, number>();

  for (const row of rows) {
    symbolTotals.set(
      row.symbol,
      (symbolTotals.get(row.symbol) ?? 0) + row.tradeCount,
    );
  }

  const symbols = [...symbolTotals.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, maxSymbols)
    .map(([symbol]) => symbol);

  const cells: Array<{
    session: TradingSessionId;
    sessionLabel: string;
    symbol: string;
    tradeCount: number;
    winCount: number;
    lossCount: number;
    netPnl: number;
  }> = [];

  for (const sessionId of TRADING_SESSION_ORDER) {
    for (const symbol of symbols) {
      const match = rows.find(
        (row) => row.session === sessionId && row.symbol === symbol,
      );

      cells.push({
        session: sessionId,
        sessionLabel:
          match?.sessionLabel ??
          rows.find((row) => row.session === sessionId)?.sessionLabel ??
          sessionId,
        symbol,
        tradeCount: match?.tradeCount ?? 0,
        winCount: match?.winCount ?? 0,
        lossCount: match?.lossCount ?? 0,
        netPnl: match ? Number(match.netPnl) : 0,
      });
    }
  }

  return { symbols, cells };
}

export function getSessionWeekdayCell(
  cells: SessionWeekdayCell[],
  session: string,
  dayOfWeek: number,
) {
  return (
    cells.find(
      (cell) => cell.session === session && cell.dayOfWeek === dayOfWeek,
    ) ?? null
  );
}

export function formatExpectancyShort(value: string | null | undefined) {
  if (!value) {
    return "Exp —";
  }

  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "Exp —";
  }

  const prefix = amount > 0 ? "+" : amount < 0 ? "" : "";
  return `Exp ${prefix}${amount.toFixed(2)}`;
}
