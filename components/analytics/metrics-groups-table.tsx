"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Fragment, useState, type KeyboardEvent } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatSampleConfidenceLabel } from "@/lib/analytics/sample-confidence";
import { TradeCountDisplay } from "@/components/analytics/trade-count-display";
import { formatMoney } from "@/lib/formatting/currency";
import { pnlTextClass } from "@/lib/formatting/pnl-tone";
import { cn } from "@/lib/utils";
import type { TradeMetricsGroup } from "@/types/analytics";

export function MetricsGroupsTable({
  title,
  description,
  rows,
  currency = "USD",
  nameHeader = "Group",
  compact = false,
  showTimeEntries = false,
  showConfidence = true,
  showRColumns = true,
}: {
  title: string;
  description: string;
  rows: TradeMetricsGroup[];
  currency?: string;
  nameHeader?: string;
  compact?: boolean;
  showTimeEntries?: boolean;
  showConfidence?: boolean;
  showRColumns?: boolean;
}) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(
    () => new Set(),
  );
  const showR = !compact && showRColumns;
  const showConf = !compact && showConfidence;
  const columnCount = 5 + (showR ? 2 : 0) + (showConf ? 1 : 0);

  function toggleRow(key: string) {
    setExpandedKeys((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  function handleRowKeyDown(
    event: KeyboardEvent<HTMLTableRowElement>,
    key: string,
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleRow(key);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {rows.length === 0 ? (
          <p className="text-muted-foreground text-sm">No data yet.</p>
        ) : (
          <table
            className={cn(
              "w-full text-sm",
              columnCount <= 5 ? "min-w-[480px]" : "min-w-[760px]",
            )}
          >
            <thead>
              <tr className="text-muted-foreground border-b text-left">
                <th className="pb-2 font-medium">{nameHeader}</th>
                <th className="pb-2 font-medium">Trades</th>
                <th className="pb-2 font-medium">Net PnL</th>
                {showR ? <th className="pb-2 font-medium">Total R</th> : null}
                <th className="pb-2 font-medium">Win rate</th>
                {showR ? <th className="pb-2 font-medium">Avg R</th> : null}
                <th className="pb-2 font-medium">Expectancy</th>
                {showConf ? (
                  <th className="pb-2 font-medium">Confidence</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const hasEntries = showTimeEntries && !!row.entries?.length;
                const isExpanded = expandedKeys.has(row.key);

                return (
                  <Fragment key={row.key}>
                    <tr
                      className={cn(
                        "border-b transition-colors",
                        hasEntries && "hover:bg-muted/30 cursor-pointer",
                        isExpanded && hasEntries && "bg-muted/20 border-b-0",
                        !isExpanded && "last:border-0",
                      )}
                      onClick={
                        hasEntries ? () => toggleRow(row.key) : undefined
                      }
                      onKeyDown={
                        hasEntries
                          ? (event) => handleRowKeyDown(event, row.key)
                          : undefined
                      }
                      tabIndex={hasEntries ? 0 : undefined}
                      aria-expanded={hasEntries ? isExpanded : undefined}
                    >
                      <td className="py-3 font-medium">
                        <div className="flex items-center gap-2">
                          {hasEntries ? (
                            <span
                              className={cn(
                                "text-muted-foreground bg-muted/50 flex size-6 shrink-0 items-center justify-center rounded-md border",
                                isExpanded && "bg-background",
                              )}
                            >
                              <ChevronRight
                                className={cn(
                                  "size-3.5 transition-transform duration-200",
                                  isExpanded && "rotate-90",
                                )}
                              />
                            </span>
                          ) : null}
                          <span>{row.label}</span>
                        </div>
                      </td>
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
                      {showR ? (
                        <td className="tabular-data py-3">
                          {row.totalR ? `${row.totalR}R` : "—"}
                        </td>
                      ) : null}
                      <td className="tabular-data py-3">
                        {row.winRate ? `${row.winRate}%` : "—"}
                      </td>
                      {showR ? (
                        <td className="tabular-data py-3">
                          {row.averageR ? `${row.averageR}R` : "—"}
                        </td>
                      ) : null}
                      <td className="tabular-data py-3">
                        {row.moneyExpectancy
                          ? formatMoney(row.moneyExpectancy, currency)
                          : "—"}
                      </td>
                      {showConf ? (
                        <td className="text-muted-foreground py-3 text-xs">
                          {formatSampleConfidenceLabel(row.sampleConfidence)}
                        </td>
                      ) : null}
                    </tr>
                    {hasEntries && isExpanded ? (
                      <tr className="border-b last:border-0">
                        <td
                          colSpan={columnCount}
                          className="bg-muted/20 px-3 pt-0 pb-3"
                        >
                          <div className="bg-background/80 border-border/60 ml-8 rounded-lg border p-3 shadow-sm">
                            <p className="text-muted-foreground mb-2 text-[11px] font-medium tracking-wide uppercase">
                              Trades in this window
                            </p>
                            <ul className="space-y-1.5">
                              {row.entries!.map((entry) => (
                                <li key={entry.tradeId}>
                                  <div className="bg-muted/30 hover:bg-muted/50 flex flex-wrap items-center justify-between gap-3 rounded-md px-3 py-2 text-xs transition-colors">
                                    <Link
                                      href={`/trades/${entry.tradeId}`}
                                      className="text-foreground font-medium hover:underline"
                                      onClick={(event) =>
                                        event.stopPropagation()
                                      }
                                    >
                                      {entry.symbol}
                                    </Link>
                                    <span className="text-muted-foreground tabular-data">
                                      Opened {entry.openedAtLocal}
                                    </span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
