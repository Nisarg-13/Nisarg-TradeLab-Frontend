"use client";

import { MetricsGroupsTable } from "@/components/analytics/metrics-groups-table";
import { TradeCountPhrase } from "@/components/analytics/trade-count-display";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatMoney } from "@/lib/formatting/currency";
import { TradeCountDisplay } from "@/components/analytics/trade-count-display";
import { pnlTextClass } from "@/lib/formatting/pnl-tone";
import { cn } from "@/lib/utils";
import type { InsightsAnalytics, TradeMetricsGroup } from "@/types/analytics";

function HighlightCard({
  title,
  group,
  currency,
  tone,
}: {
  title: string;
  group: TradeMetricsGroup | null;
  currency: string;
  tone: "positive" | "negative";
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {group ? (
          <div className="space-y-1">
            <p className="text-lg font-semibold">{group.label}</p>
            <p
              className={cn(
                "tabular-data text-2xl font-semibold",
                tone === "positive"
                  ? pnlTextClass(group.netPnl)
                  : pnlTextClass(group.netPnl),
              )}
            >
              {formatMoney(group.netPnl, currency)}
            </p>
            <p className="text-muted-foreground text-sm">
              <TradeCountPhrase
                tradeCount={group.tradeCount}
                winCount={group.winCount}
                lossCount={group.lossCount}
              />
              {group.winRate
                ? ` · ${Number(group.winRate).toFixed(1)}% win rate`
                : ""}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Not enough data yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

function CoverageStat({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="rounded-lg border p-4">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="tabular-data mt-1 text-2xl font-semibold">
        {value}
        <span className="text-muted-foreground ml-2 text-base font-normal">
          / {total} ({percent}%)
        </span>
      </p>
    </div>
  );
}

export function InsightsAnalyticsPanel({
  data,
  currency,
}: {
  data: InsightsAnalytics;
  currency: string;
}) {
  const { highlights, journalCoverage } = data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Highlights</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Best and worst times, sessions, pairs, and chart timeframes from your
          closed trades.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <HighlightCard
            title="Most profitable hour"
            group={highlights.bestHour}
            currency={currency}
            tone="positive"
          />
          <HighlightCard
            title="Most losing hour"
            group={highlights.worstHour}
            currency={currency}
            tone="negative"
          />
          <HighlightCard
            title="Best session"
            group={highlights.bestSession}
            currency={currency}
            tone="positive"
          />
          <HighlightCard
            title="Worst session"
            group={highlights.worstSession}
            currency={currency}
            tone="negative"
          />
          <HighlightCard
            title="Best weekday"
            group={highlights.bestDayOfWeek}
            currency={currency}
            tone="positive"
          />
          <HighlightCard
            title="Worst weekday"
            group={highlights.worstDayOfWeek}
            currency={currency}
            tone="negative"
          />
          <HighlightCard
            title="Most profitable pair"
            group={highlights.bestSymbol}
            currency={currency}
            tone="positive"
          />
          <HighlightCard
            title="Most losing pair"
            group={highlights.worstSymbol}
            currency={currency}
            tone="negative"
          />
          <HighlightCard
            title="Best chart timeframe"
            group={highlights.bestTimeframe}
            currency={currency}
            tone="positive"
          />
          <HighlightCard
            title="Worst chart timeframe"
            group={highlights.worstTimeframe}
            currency={currency}
            tone="negative"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session × pair performance</CardTitle>
          <CardDescription>
            Which pairs work best or worst in each trading session (Asia,
            London, overlap, New York, off-hours).
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {data.sessionSymbols.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No closed trades yet.
            </p>
          ) : (
            <table className="w-full min-w-[920px] text-sm">
              <thead>
                <tr className="text-muted-foreground border-b text-left">
                  <th className="pb-2 font-medium">Session</th>
                  <th className="pb-2 font-medium">Pair</th>
                  <th className="pb-2 font-medium">Trades</th>
                  <th className="pb-2 font-medium">Net PnL</th>
                  <th className="pb-2 font-medium">Total R</th>
                  <th className="pb-2 font-medium">Win rate</th>
                  <th className="pb-2 font-medium">Avg R</th>
                  <th className="pb-2 font-medium">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {data.sessionSymbols.map((row) => (
                  <tr
                    key={`${row.session}-${row.symbol}`}
                    className="border-b last:border-0"
                  >
                    <td className="py-3">{row.sessionLabel}</td>
                    <td className="py-3 font-medium">{row.symbol}</td>
                    <td className="py-3">
                      <TradeCountDisplay
                        tradeCount={row.tradeCount}
                        winCount={row.winCount}
                        lossCount={row.lossCount}
                      />
                    </td>
                    <td
                      className={cn(
                        "tabular-data py-3",
                        pnlTextClass(row.netPnl),
                      )}
                    >
                      {formatMoney(row.netPnl, currency)}
                    </td>
                    <td className="tabular-data py-3">
                      {row.totalR ? `${row.totalR}R` : "—"}
                    </td>
                    <td className="tabular-data py-3">
                      {row.winRate ? `${Number(row.winRate).toFixed(1)}%` : "—"}
                    </td>
                    <td className="tabular-data py-3">
                      {row.averageR ? `${row.averageR}R` : "—"}
                    </td>
                    <td className="py-3">{row.sampleConfidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <MetricsGroupsTable
        title="Chart timeframe performance"
        description="Performance grouped by the chart timeframe you logged on each trade."
        rows={data.timeframes}
        currency={currency}
        nameHeader="Timeframe"
      />

      <Card>
        <CardHeader>
          <CardTitle>Timeframe win / loss split</CardTitle>
          <CardDescription>
            Where you tend to win vs lose based on the timeframe you took the
            entry on.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {data.timeframeOutcomes.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No closed trades yet.
            </p>
          ) : (
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="text-muted-foreground border-b text-left">
                  <th className="pb-2 font-medium">Timeframe</th>
                  <th className="pb-2 font-medium">Trades</th>
                  <th className="pb-2 font-medium">Wins</th>
                  <th className="pb-2 font-medium">Losses</th>
                  <th className="pb-2 font-medium">Breakeven</th>
                  <th className="pb-2 font-medium">Win rate</th>
                  <th className="pb-2 font-medium">Net PnL</th>
                </tr>
              </thead>
              <tbody>
                {data.timeframeOutcomes.map((row) => (
                  <tr key={row.key} className="border-b last:border-0">
                    <td className="py-3 font-medium">{row.label}</td>
                    <td className="py-3">
                      <TradeCountDisplay
                        tradeCount={row.tradeCount}
                        winCount={row.wins}
                        lossCount={row.losses}
                      />
                    </td>
                    <td className="tabular-data py-3 text-emerald-600 dark:text-emerald-400">
                      {row.wins}
                    </td>
                    <td className="tabular-data py-3 text-red-600 dark:text-red-400">
                      {row.losses}
                    </td>
                    <td className="tabular-data py-3">{row.breakeven}</td>
                    <td className="tabular-data py-3">
                      {row.winRate ? `${Number(row.winRate).toFixed(1)}%` : "—"}
                    </td>
                    <td
                      className={cn(
                        "tabular-data py-3",
                        pnlTextClass(row.netPnl),
                      )}
                    >
                      {formatMoney(row.netPnl, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Journal coverage</CardTitle>
          <CardDescription>
            How completely you are logging chart timeframe, plans, and review
            fields — richer journals unlock better insights.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <CoverageStat
            label="Chart timeframe set"
            value={journalCoverage.withChartTimeframe}
            total={journalCoverage.closedTrades}
          />
          <CoverageStat
            label="Pre-trade plan"
            value={journalCoverage.withPreTradePlan}
            total={journalCoverage.closedTrades}
          />
          <CoverageStat
            label="Post-trade plan"
            value={journalCoverage.withPostTradePlan}
            total={journalCoverage.closedTrades}
          />
          <CoverageStat
            label="What went well"
            value={journalCoverage.withWhatWentWell}
            total={journalCoverage.closedTrades}
          />
          <CoverageStat
            label="What went wrong"
            value={journalCoverage.withWhatWentWrong}
            total={journalCoverage.closedTrades}
          />
          <CoverageStat
            label="Plan compliance reviewed"
            value={journalCoverage.withPlanCompliance}
            total={journalCoverage.closedTrades}
          />
          <CoverageStat
            label="Entry criteria tagged"
            value={journalCoverage.withEntryCriteria}
            total={journalCoverage.closedTrades}
          />
          <CoverageStat
            label="Strategies tagged"
            value={journalCoverage.withStrategies}
            total={journalCoverage.closedTrades}
          />
          <CoverageStat
            label="Mistakes tagged"
            value={journalCoverage.withMistakesTagged}
            total={journalCoverage.closedTrades}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plan compliance by timeframe</CardTitle>
          <CardDescription>
            Whether you followed your plan on each chart timeframe, and how that
            correlates with win rate.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {data.planComplianceByTimeframe.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No closed trades yet.
            </p>
          ) : (
            <table className="w-full min-w-[920px] text-sm">
              <thead>
                <tr className="text-muted-foreground border-b text-left">
                  <th className="pb-2 font-medium">Timeframe</th>
                  <th className="pb-2 font-medium">Followed</th>
                  <th className="pb-2 font-medium">Partial</th>
                  <th className="pb-2 font-medium">Did not follow</th>
                  <th className="pb-2 font-medium">Not reviewed</th>
                  <th className="pb-2 font-medium">Followed win rate</th>
                  <th className="pb-2 font-medium">Not followed win rate</th>
                </tr>
              </thead>
              <tbody>
                {data.planComplianceByTimeframe.map((row) => (
                  <tr key={row.key} className="border-b last:border-0">
                    <td className="py-3 font-medium">{row.label}</td>
                    <td className="tabular-data py-3">{row.followed}</td>
                    <td className="tabular-data py-3">
                      {row.partiallyFollowed}
                    </td>
                    <td className="tabular-data py-3">{row.didNotFollow}</td>
                    <td className="tabular-data py-3">{row.notReviewed}</td>
                    <td className="tabular-data py-3">
                      {row.followedWinRate
                        ? `${Number(row.followedWinRate).toFixed(1)}%`
                        : "—"}
                    </td>
                    <td className="tabular-data py-3">
                      {row.notFollowedWinRate
                        ? `${Number(row.notFollowedWinRate).toFixed(1)}%`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <MetricsGroupsTable
          title="Winning entry criteria"
          description="Entry criteria most often present on winning trades."
          rows={data.winningEntryCriteria}
          currency={currency}
          nameHeader="Entry criteria"
        />
        <MetricsGroupsTable
          title="Losing entry criteria"
          description="Entry criteria most often present on losing trades."
          rows={data.losingEntryCriteria}
          currency={currency}
          nameHeader="Entry criteria"
        />
        <MetricsGroupsTable
          title="Winning strategies"
          description="Strategies tagged on trades that closed green."
          rows={data.winningStrategies}
          currency={currency}
          nameHeader="Strategy"
        />
        <MetricsGroupsTable
          title="Losing strategies"
          description="Strategies tagged on trades that closed red."
          rows={data.losingStrategies}
          currency={currency}
          nameHeader="Strategy"
        />
      </div>

      <MetricsGroupsTable
        title="Mistakes on losing trades"
        description="Mistakes you tagged when trades closed negative."
        rows={data.losingMistakes}
        currency={currency}
        nameHeader="Mistake"
      />
    </div>
  );
}
