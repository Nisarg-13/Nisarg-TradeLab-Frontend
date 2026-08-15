import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TradeStatusBadge } from "@/components/trades/trade-status-badge";
import { FormattedDateTime } from "@/components/formatting/formatted-datetime";
import { formatMoney } from "@/lib/formatting/currency";
import { formatTradeHoldingDuration } from "@/lib/formatting/datetime";
import { formatTradePrice } from "@/lib/formatting/trade-price";
import { pnlTextClass } from "@/lib/formatting/pnl-tone";
import { cn } from "@/lib/utils";
import type { Trade } from "@/types/trade";

import type { ReactNode } from "react";

function DetailItem({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-xs tracking-wide uppercase">
        {label}
      </p>
      <p className={cn("tabular-data font-medium", valueClassName)}>{value}</p>
    </div>
  );
}

export function TradeSummaryCard({ trade }: { trade: Trade }) {
  const currency = trade.tradingAccount.currency;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle>
            {trade.symbol} · {trade.direction}
          </CardTitle>
          <TradeStatusBadge status={trade.status} />
        </div>
        <CardDescription>
          {trade.tradingAccount.name} · {trade.assetClass}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DetailItem
          label="Opened"
          value={<FormattedDateTime value={trade.openedAt} />}
        />
        <DetailItem
          label="Closed"
          value={<FormattedDateTime value={trade.closedAt} />}
        />
        <DetailItem
          label="Hold time"
          value={formatTradeHoldingDuration(
            trade.openedAt,
            trade.closedAt,
            trade.status,
          )}
        />
        <DetailItem
          label="Avg entry"
          value={formatTradePrice(trade.averageEntryPrice)}
        />
        <DetailItem
          label="Avg exit"
          value={formatTradePrice(trade.averageExitPrice)}
        />
        <DetailItem
          label="Volume"
          value={
            trade.status === "CLOSED"
              ? trade.initialVolume
              : trade.currentVolume
          }
        />
        <DetailItem
          label="Stop loss"
          value={formatTradePrice(trade.currentStopLoss)}
        />
        <DetailItem
          label="Take profit"
          value={formatTradePrice(trade.currentTakeProfit)}
        />
        <DetailItem
          label="Initial risk"
          value={
            trade.initialRiskAmount
              ? formatMoney(trade.initialRiskAmount, currency)
              : "—"
          }
        />
        <DetailItem
          label="Planned R:R"
          value={trade.plannedRR ? Number(trade.plannedRR).toFixed(2) : "—"}
        />
        <DetailItem
          label="Gross PnL"
          value={formatMoney(trade.grossPnl, currency)}
          valueClassName={pnlTextClass(trade.grossPnl)}
        />
        <DetailItem
          label="Commission"
          value={formatMoney(trade.commission, currency)}
        />
        <DetailItem label="Swap" value={formatMoney(trade.swap, currency)} />
        <DetailItem label="Fees" value={formatMoney(trade.fees, currency)} />
        <DetailItem
          label="Net PnL"
          value={formatMoney(trade.netPnl, currency)}
          valueClassName={pnlTextClass(trade.netPnl)}
        />
        <DetailItem
          label="Realized R"
          value={
            trade.realizedR ? `${Number(trade.realizedR).toFixed(2)}R` : "—"
          }
        />
        {trade.strategy ? (
          <DetailItem label="Strategy" value={trade.strategy.name} />
        ) : null}
      </CardContent>
    </Card>
  );
}
