"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TRADING_SESSION_BANDS } from "@/lib/constants/trading-sessions";
import { TradeCountPhrase } from "@/components/analytics/trade-count-display";
import { formatMoney } from "@/lib/formatting/currency";
import { pnlTextClass } from "@/lib/formatting/pnl-tone";
import type { SessionPerformance } from "@/types/analytics";

const SESSION_SHORT_LABELS = Object.fromEntries(
  TRADING_SESSION_BANDS.map((band) => [band.id, band.shortLabel]),
) as Record<string, string>;

const CHART_AXIS_TICK = {
  fontSize: 12,
  fill: "var(--muted-foreground)",
};

const CHART_GRID_STROKE = "var(--border)";

const CHART_TOOLTIP_PROPS = {
  contentStyle: {
    backgroundColor: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    color: "var(--popover-foreground)",
  },
  labelStyle: {
    color: "var(--popover-foreground)",
    fontWeight: 600,
    marginBottom: 4,
  },
  itemStyle: {
    color: "var(--popover-foreground)",
  },
  cursor: {
    fill: "var(--muted)",
    opacity: 0.35,
  },
};

const CHART_LEGEND_PROPS = {
  wrapperStyle: {
    color: "var(--foreground)",
    paddingTop: 12,
  },
};

function sessionShortLabel(sessionId: string, fallback: string) {
  return SESSION_SHORT_LABELS[sessionId] ?? fallback;
}

export function SessionBarChart({
  sessions,
  currency,
}: {
  sessions: SessionPerformance[];
  currency: string;
}) {
  const chartData = sessions
    .filter((session) => session.tradeCount > 0)
    .map((session) => ({
      label: sessionShortLabel(session.session, session.sessionLabel),
      fullLabel: session.sessionLabel,
      netPnl: Number(session.netPnl),
      winRate: session.winRate ? Number(session.winRate) : 0,
      tradeCount: session.tradeCount,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session performance bar chart</CardTitle>
        <CardDescription>
          Net PnL by trading session for closed trades in your profile timezone.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {chartData.length === 0 ? (
          <p className="text-muted-foreground text-sm">No session data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={CHART_GRID_STROKE}
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={CHART_AXIS_TICK}
                axisLine={{ stroke: CHART_GRID_STROKE }}
                tickLine={{ stroke: CHART_GRID_STROKE }}
              />
              <YAxis
                tick={CHART_AXIS_TICK}
                axisLine={{ stroke: CHART_GRID_STROKE }}
                tickLine={{ stroke: CHART_GRID_STROKE }}
              />
              <Tooltip
                {...CHART_TOOLTIP_PROPS}
                formatter={(value) => [
                  formatMoney(String(value), currency),
                  "Net PnL",
                ]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullLabel ?? "Session"
                }
              />
              <Bar dataKey="netPnl" radius={[6, 6, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell
                    key={entry.fullLabel}
                    fill={entry.netPnl >= 0 ? "var(--profit)" : "var(--loss)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function SessionContributionChart({
  rows,
}: {
  rows: Array<{
    session: string;
    label: string;
    tradeShare: number;
    profitShare: number;
    netPnl: number;
  }>;
}) {
  const chartData = rows.map((row) => ({
    ...row,
    shortLabel: sessionShortLabel(row.session, row.label),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit vs trade contribution</CardTitle>
        <CardDescription>
          Share of closed trades versus share of absolute net PnL by session.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {chartData.length === 0 ? (
          <p className="text-muted-foreground text-sm">No session data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={CHART_GRID_STROKE}
                vertical={false}
              />
              <XAxis
                dataKey="shortLabel"
                tick={{ ...CHART_AXIS_TICK, fontSize: 11 }}
                interval={0}
                angle={-18}
                textAnchor="end"
                height={56}
                axisLine={{ stroke: CHART_GRID_STROKE }}
                tickLine={{ stroke: CHART_GRID_STROKE }}
              />
              <YAxis
                tickFormatter={(value) => `${value}%`}
                tick={CHART_AXIS_TICK}
                axisLine={{ stroke: CHART_GRID_STROKE }}
                tickLine={{ stroke: CHART_GRID_STROKE }}
              />
              <Tooltip
                {...CHART_TOOLTIP_PROPS}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.label ?? "Session"
                }
                formatter={(value, name) => [
                  `${Number(value).toFixed(1)}%`,
                  name === "tradeShare"
                    ? "Trade contribution"
                    : "Profit contribution",
                ]}
              />
              <Legend {...CHART_LEGEND_PROPS} />
              <Bar
                dataKey="tradeShare"
                name="Trade contribution"
                fill="var(--chart-1)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="profitShare"
                name="Profit contribution"
                fill="var(--chart-2)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function SessionKpiCards({
  sessions,
  currency,
}: {
  sessions: SessionPerformance[];
  currency: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {sessions.map((session) => (
        <Card key={session.session} className="overflow-hidden">
          <CardContent className="space-y-3 p-4">
            <div>
              <p className="text-sm font-medium">{session.sessionLabel}</p>
              <p className="text-muted-foreground text-xs">
                <TradeCountPhrase
                  tradeCount={session.tradeCount}
                  winCount={session.winCount}
                  lossCount={session.lossCount}
                />
              </p>
            </div>
            <div className="space-y-1">
              <p
                className={`tabular-data text-lg font-semibold ${pnlTextClass(session.netPnl)}`}
              >
                {session.tradeCount > 0
                  ? formatMoney(session.netPnl, currency)
                  : "—"}
              </p>
              <p className="text-muted-foreground text-xs">
                {session.winRate
                  ? `${Number(session.winRate).toFixed(1)}% win rate`
                  : "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
