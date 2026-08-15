"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InstrumentSearch } from "@/components/risk/instrument-search";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateRisk } from "@/lib/api/risk";
import { useClientAuthToken } from "@/lib/auth/client";
import { formatMoney } from "@/lib/formatting/currency";
import type {
  RiskCalculationResult,
  RiskMode,
  TradeDirection,
} from "@/types/risk";
import { cn } from "@/lib/utils";

const RISK_PRESETS = [0.25, 0.5, 0.75, 1];

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "AUD", "CAD", "JPY", "CHF"];

const DIRECTION_OPTIONS = [
  { value: "LONG", label: "Long" },
  { value: "SHORT", label: "Short" },
];

const RISK_MODE_OPTIONS = [
  { value: "PERCENTAGE", label: "Percentage" },
  { value: "FIXED", label: "Fixed amount" },
];

const CURRENCY_OPTIONS = CURRENCIES.map((currency) => ({
  value: currency,
  label: currency,
}));

function ResultItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="tabular-data font-medium">{value}</p>
    </div>
  );
}

function violationStyles(severity: "warning" | "critical") {
  if (severity === "critical") {
    return "border-destructive/40 bg-destructive/10 text-destructive";
  }

  return "border-primary/40 bg-primary/10 text-primary";
}

export function RiskCalculator() {
  const getAuthToken = useClientAuthToken();
  const [accountBalance, setAccountBalance] = useState("10000");
  const [currency, setCurrency] = useState("USD");
  const [symbol, setSymbol] = useState("");
  const [direction, setDirection] = useState<TradeDirection>("LONG");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [riskMode, setRiskMode] = useState<RiskMode>("PERCENTAGE");
  const [riskPercentage, setRiskPercentage] = useState("1");
  const [fixedRiskAmount, setFixedRiskAmount] = useState("");
  const [result, setResult] = useState<RiskCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  async function handleCalculate() {
    if (!accountBalance || !symbol || !entryPrice || !stopLoss) {
      toast.error(
        "Enter account balance, select an instrument, entry, and stop loss.",
      );
      return;
    }

    if (riskMode === "PERCENTAGE" && !riskPercentage) {
      toast.error("Enter a risk percentage.");
      return;
    }

    if (riskMode === "FIXED" && !fixedRiskAmount) {
      toast.error("Enter a fixed risk amount.");
      return;
    }

    setIsCalculating(true);

    try {
      const response = await calculateRisk(getAuthToken, {
        accountBalance: Number(accountBalance),
        symbol,
        direction,
        entryPrice: Number(entryPrice),
        stopLoss: Number(stopLoss),
        takeProfit: takeProfit ? Number(takeProfit) : undefined,
        riskMode,
        riskPercentage:
          riskMode === "PERCENTAGE" ? Number(riskPercentage) : undefined,
        fixedRiskAmount:
          riskMode === "FIXED" ? Number(fixedRiskAmount) : undefined,
      });

      setResult(response.data);
    } catch (err) {
      setResult(null);
      toast.error(
        err instanceof Error ? err.message : "Failed to calculate risk.",
      );
    } finally {
      setIsCalculating(false);
    }
  }

  function buildCreateTradeHref() {
    if (!result) return "/trades/new";

    const params = new URLSearchParams({
      symbol: result.symbol,
      direction: result.direction,
      entry: result.entryPrice,
      stopLoss: result.stopLoss,
      accountBalance: result.accountBalance,
      riskAmount: result.riskAmount,
      riskPercentage: result.riskPercentage,
      volume: result.recommendedPositionSize,
    });

    if (result.takeProfit) {
      params.set("takeProfit", result.takeProfit);
    }

    if (result.riskReward) {
      params.set("plannedRR", result.riskReward);
    }

    return `/trades/new?${params.toString()}`;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <Card>
        <CardHeader>
          <CardTitle>Trade Setup</CardTitle>
          <CardDescription>
            Enter your account balance and trade details to calculate position
            size.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="risk-balance">Account balance</Label>
            <Input
              id="risk-balance"
              type="number"
              min="0"
              step="0.01"
              value={accountBalance}
              onChange={(event) => setAccountBalance(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="risk-currency">Currency</Label>
            <DropdownSelect
              id="risk-currency"
              name="currency"
              options={CURRENCY_OPTIONS}
              value={currency}
              onValueChange={setCurrency}
            />
          </div>

          <div className="md:col-span-2">
            <InstrumentSearch
              value={symbol}
              onValueChange={(nextSymbol) => {
                setSymbol(nextSymbol);
                setResult(null);
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="risk-direction">Direction</Label>
            <DropdownSelect
              id="risk-direction"
              name="direction"
              options={DIRECTION_OPTIONS}
              value={direction}
              onValueChange={(value) => setDirection(value as TradeDirection)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="risk-mode">Risk mode</Label>
            <DropdownSelect
              id="risk-mode"
              name="riskMode"
              options={RISK_MODE_OPTIONS}
              value={riskMode}
              onValueChange={(value) => setRiskMode(value as RiskMode)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="risk-entry">Entry price</Label>
            <Input
              id="risk-entry"
              type="number"
              min="0"
              step="any"
              value={entryPrice}
              onChange={(event) => setEntryPrice(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="risk-stop">Stop loss</Label>
            <Input
              id="risk-stop"
              type="number"
              min="0"
              step="any"
              value={stopLoss}
              onChange={(event) => setStopLoss(event.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="risk-tp">Take profit (optional)</Label>
            <Input
              id="risk-tp"
              type="number"
              min="0"
              step="any"
              value={takeProfit}
              onChange={(event) => setTakeProfit(event.target.value)}
            />
          </div>

          {riskMode === "PERCENTAGE" ? (
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="risk-percentage">Risk percentage</Label>
              <Input
                id="risk-percentage"
                type="number"
                min="0"
                step="0.01"
                value={riskPercentage}
                onChange={(event) => setRiskPercentage(event.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                {RISK_PRESETS.map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setRiskPercentage(String(preset))}
                  >
                    {preset}%
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="risk-fixed">Fixed risk amount</Label>
              <Input
                id="risk-fixed"
                type="number"
                min="0"
                step="0.01"
                value={fixedRiskAmount}
                onChange={(event) => setFixedRiskAmount(event.target.value)}
              />
            </div>
          )}

          <div className="md:col-span-2">
            <Button
              type="button"
              className="w-full sm:w-auto"
              disabled={isCalculating}
              onClick={() => void handleCalculate()}
            >
              {isCalculating ? "Calculating..." : "Calculate risk"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              Backend-calculated position size and risk metrics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <ResultItem
                  label="Account balance"
                  value={formatMoney(result.accountBalance, currency)}
                />
                <ResultItem
                  label="Risk amount"
                  value={formatMoney(result.riskAmount, currency)}
                />
                <ResultItem
                  label="Risk %"
                  value={`${Number(result.riskPercentage).toFixed(2)}%`}
                />
                <ResultItem label="Stop distance" value={result.stopDistance} />
                <ResultItem
                  label="Position size"
                  value={`${result.recommendedPositionSize} lots`}
                />
                <ResultItem
                  label="Potential loss"
                  value={formatMoney(result.potentialLoss, currency)}
                />
                <ResultItem
                  label="Potential profit"
                  value={
                    result.potentialProfit
                      ? formatMoney(result.potentialProfit, currency)
                      : "—"
                  }
                />
                <ResultItem
                  label="Risk : Reward"
                  value={
                    result.riskReward
                      ? Number(result.riskReward).toFixed(2)
                      : "—"
                  }
                />
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Enter trade details and calculate to see position sizing
                results.
              </p>
            )}
            {result ? (
              <div className="pt-4">
                <Link
                  href={buildCreateTradeHref()}
                  className={cn(buttonVariants(), "w-full sm:w-auto")}
                >
                  Create trade
                </Link>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {result && result.violations.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Risk warnings</CardTitle>
              <CardDescription>
                Review warnings based on standard risk limits.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.violations.map((violation) => (
                <div
                  key={`${violation.code}-${violation.message}`}
                  className={`rounded-lg border px-4 py-3 text-sm ${violationStyles(violation.severity)}`}
                >
                  {violation.message}
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
