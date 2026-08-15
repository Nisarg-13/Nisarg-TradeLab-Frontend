import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TradeStatusBadge } from "@/components/trades/trade-status-badge";
import { formatMoney } from "@/lib/formatting/currency";
import type { Trade } from "@/types/trade";

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="font-medium tabular-nums">{value}</p>
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
        <DetailItem label="Avg entry" value={trade.averageEntryPrice} />
        <DetailItem label="Avg exit" value={trade.averageExitPrice ?? "—"} />
        <DetailItem label="Volume" value={trade.currentVolume} />
        <DetailItem label="Stop loss" value={trade.currentStopLoss ?? "—"} />
        <DetailItem
          label="Take profit"
          value={trade.currentTakeProfit ?? "—"}
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
          label="Net PnL"
          value={formatMoney(trade.netPnl, currency)}
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
