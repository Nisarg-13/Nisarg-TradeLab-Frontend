"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { InstrumentSearch } from "@/components/risk/instrument-search";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RangeInput } from "@/components/ui/range-input";
import { Textarea } from "@/components/ui/textarea";
import { createTrade, updateTrade } from "@/lib/api/trades";
import { useClientAuthToken } from "@/lib/auth/client";
import { MARKET_BIAS_SELECT_OPTIONS } from "@/lib/constants/market-bias";
import { PLAN_COMPLIANCE_OPTIONS } from "@/lib/constants/plan-compliance";
import { formatPriceInput, parseOptionalPrice } from "@/lib/trades/price-input";
import type { TradingAccount } from "@/types/account";
import type { MarketBias } from "@/types/journal";
import type { TradeDirection } from "@/types/risk";
import type { Mistake, Strategy, Tag } from "@/types/strategy";
import type { PlanComplianceStatus, Trade, TradeEmotion } from "@/types/trade";

const DIRECTION_OPTIONS = [
  { value: "LONG", label: "Long" },
  { value: "SHORT", label: "Short" },
];

const EMOTION_OPTIONS = [
  { value: "", label: "Not set" },
  { value: "CALM", label: "Calm" },
  { value: "CONFIDENT", label: "Confident" },
  { value: "FEAR", label: "Fear" },
  { value: "FOMO", label: "FOMO" },
  { value: "GREED", label: "Greed" },
  { value: "IMPATIENT", label: "Impatient" },
  { value: "REVENGE", label: "Revenge" },
  { value: "OTHER", label: "Other" },
];

export type TradeFormPrefill = {
  tradingAccountId?: string;
  symbol?: string;
  direction?: TradeDirection;
  entryPrice?: string;
  stopLoss?: string;
  takeProfit?: string;
  volume?: string;
  accountBalanceAtEntry?: string;
  initialRiskAmount?: string;
  initialRiskPercentage?: string;
  plannedRR?: string;
};

type TradeFormProps = {
  mode: "create" | "edit";
  accounts: TradingAccount[];
  strategies: Strategy[];
  tags: Tag[];
  mistakes: Mistake[];
  trade?: Trade;
  prefill?: TradeFormPrefill;
};

export function TradeForm({
  mode,
  accounts,
  strategies,
  tags,
  mistakes,
  trade,
  prefill,
}: TradeFormProps) {
  const router = useRouter();
  const getAuthToken = useClientAuthToken();
  const [isSaving, setIsSaving] = useState(false);

  const accountOptions = useMemo(
    () =>
      accounts.map((account) => ({
        value: account.id,
        label: account.name,
      })),
    [accounts],
  );

  const [tradingAccountId, setTradingAccountId] = useState(
    trade?.tradingAccountId ??
      prefill?.tradingAccountId ??
      accounts[0]?.id ??
      "",
  );
  const [symbol, setSymbol] = useState(trade?.symbol ?? prefill?.symbol ?? "");
  const [direction, setDirection] = useState<TradeDirection>(
    trade?.direction ?? prefill?.direction ?? "LONG",
  );
  const [entryPrice, setEntryPrice] = useState(
    trade?.averageEntryPrice ?? prefill?.entryPrice ?? "",
  );
  const [volume, setVolume] = useState(
    trade?.initialVolume ?? prefill?.volume ?? "",
  );
  const [stopLoss, setStopLoss] = useState(
    formatPriceInput(trade?.currentStopLoss ?? prefill?.stopLoss),
  );
  const [takeProfit, setTakeProfit] = useState(
    formatPriceInput(trade?.currentTakeProfit ?? prefill?.takeProfit),
  );
  const [accountBalanceAtEntry, setAccountBalanceAtEntry] = useState(
    trade?.accountBalanceAtEntry ?? prefill?.accountBalanceAtEntry ?? "",
  );
  const [initialRiskAmount, setInitialRiskAmount] = useState(
    trade?.initialRiskAmount ?? prefill?.initialRiskAmount ?? "",
  );
  const [initialRiskPercentage, setInitialRiskPercentage] = useState(
    trade?.initialRiskPercentage ?? prefill?.initialRiskPercentage ?? "",
  );
  const [plannedRR, setPlannedRR] = useState(
    trade?.plannedRR ?? prefill?.plannedRR ?? "",
  );
  const [selectedStrategyIds, setSelectedStrategyIds] = useState<string[]>(
    trade?.strategies.map((strategy) => strategy.id) ?? [],
  );
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    trade?.tags.map((tag) => tag.id) ?? [],
  );
  const [selectedMistakeIds, setSelectedMistakeIds] = useState<string[]>(
    trade?.mistakes.map((mistake) => mistake.id) ?? [],
  );
  const [preTradeEmotion, setPreTradeEmotion] = useState(
    trade?.review?.preTradeEmotion ?? "",
  );
  const [postTradeEmotion, setPostTradeEmotion] = useState(
    trade?.review?.postTradeEmotion ?? "",
  );
  const [marketBias, setMarketBias] = useState(trade?.review?.marketBias ?? "");
  const [preTradePlan, setPreTradePlan] = useState(
    trade?.review?.preTradePlan ?? "",
  );
  const [postTradePlan, setPostTradePlan] = useState(
    trade?.review?.postTradePlan ?? "",
  );
  const [confidenceScore, setConfidenceScore] = useState(
    trade?.review?.confidenceScore ?? 7,
  );
  const [whatWentWell, setWhatWentWell] = useState(
    trade?.review?.whatWentWell ?? "",
  );
  const [whatWentWrong, setWhatWentWrong] = useState(
    trade?.review?.whatWentWrong ?? "",
  );
  const [planCompliance, setPlanCompliance] = useState(
    trade?.review?.planCompliance ?? "",
  );
  const [lesson, setLesson] = useState(trade?.review?.lesson ?? "");
  const isClosedTrade = trade?.status !== "OPEN";

  function toggleSelection(
    current: string[],
    id: string,
    setter: (value: string[]) => void,
  ) {
    setter(
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    let parsedStopLoss: number | null | undefined;
    let parsedTakeProfit: number | null | undefined;

    try {
      parsedStopLoss = parseOptionalPrice(stopLoss);
      parsedTakeProfit = parseOptionalPrice(takeProfit);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Stop loss and take profit must be greater than zero.",
      );
      return;
    }

    if (mode === "create") {
      if (!tradingAccountId || !symbol || !entryPrice || !volume) {
        toast.error("Account, symbol, entry price, and volume are required.");
        return;
      }

      setIsSaving(true);

      try {
        const response = await createTrade(getAuthToken, {
          tradingAccountId,
          symbol,
          direction,
          entryPrice: Number(entryPrice),
          volume: Number(volume),
          stopLoss: parsedStopLoss ?? undefined,
          takeProfit: parsedTakeProfit ?? undefined,
          accountBalanceAtEntry: accountBalanceAtEntry
            ? Number(accountBalanceAtEntry)
            : undefined,
          initialRiskAmount: initialRiskAmount
            ? Number(initialRiskAmount)
            : undefined,
          initialRiskPercentage: initialRiskPercentage
            ? Number(initialRiskPercentage)
            : undefined,
          plannedRR: plannedRR ? Number(plannedRR) : undefined,
          strategyIds: selectedStrategyIds,
          tagIds: selectedTagIds,
          mistakeIds: selectedMistakeIds,
          review: buildReviewPayload(),
        });

        toast.success("Trade created.");
        router.push(`/trades/${response.data.id}`);
        router.refresh();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to create trade.",
        );
      } finally {
        setIsSaving(false);
      }

      return;
    }

    if (!trade) return;

    setIsSaving(true);

    try {
      const response = await updateTrade(getAuthToken, trade.id, {
        ...(isClosedTrade
          ? {}
          : {
              currentStopLoss: parsedStopLoss,
              currentTakeProfit: parsedTakeProfit,
            }),
        strategyIds: selectedStrategyIds,
        tagIds: selectedTagIds,
        mistakeIds: selectedMistakeIds,
        review: buildReviewPayload(),
      });

      toast.success("Trade updated.");
      router.push(`/trades/${response.data.id}`);
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update trade.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function buildReviewPayload() {
    const review = {
      marketBias: marketBias ? (marketBias as MarketBias) : undefined,
      preTradePlan: preTradePlan || undefined,
      postTradePlan: postTradePlan || undefined,
      preTradeEmotion: preTradeEmotion
        ? (preTradeEmotion as TradeEmotion)
        : undefined,
      postTradeEmotion: postTradeEmotion
        ? (postTradeEmotion as TradeEmotion)
        : undefined,
      confidenceScore,
      planCompliance: planCompliance
        ? (planCompliance as PlanComplianceStatus)
        : undefined,
      whatWentWell: whatWentWell || undefined,
      whatWentWrong: whatWentWrong || undefined,
      lesson: lesson || undefined,
    };

    const hasReview = Boolean(
      marketBias ||
      preTradePlan ||
      postTradePlan ||
      preTradeEmotion ||
      postTradeEmotion ||
      planCompliance ||
      whatWentWell ||
      whatWentWrong ||
      lesson ||
      trade?.review?.confidenceScore !== undefined ||
      confidenceScore !== 7,
    );

    return hasReview ? review : undefined;
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Trade setup</CardTitle>
          <CardDescription>
            {mode === "create"
              ? "Record a new manual trade with optional risk snapshot."
              : "Update trade metadata, psychology, and risk levels."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {mode === "create" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="trade-account">Account</Label>
                <DropdownSelect
                  id="trade-account"
                  name="trade-account"
                  options={accountOptions}
                  value={tradingAccountId}
                  onValueChange={setTradingAccountId}
                />
              </div>
              <div className="md:col-span-2">
                <InstrumentSearch
                  id="trade-instrument"
                  value={symbol}
                  onValueChange={setSymbol}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trade-direction">Direction</Label>
                <DropdownSelect
                  id="trade-direction"
                  name="trade-direction"
                  options={DIRECTION_OPTIONS}
                  value={direction}
                  onValueChange={(value) =>
                    setDirection(value as TradeDirection)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trade-entry">Entry price</Label>
                <Input
                  id="trade-entry"
                  type="number"
                  min="0"
                  step="any"
                  value={entryPrice}
                  onChange={(event) => setEntryPrice(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trade-volume">Volume (lots)</Label>
                <Input
                  id="trade-volume"
                  type="number"
                  min="0"
                  step="any"
                  value={volume}
                  onChange={(event) => setVolume(event.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="space-y-1 md:col-span-2">
              <p className="font-medium">
                {trade?.symbol} · {trade?.direction}
              </p>
              <p className="text-muted-foreground text-sm">
                Entry and volume are locked after creation. Use executions to
                scale in or out.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="trade-sl">Stop loss</Label>
            <Input
              id="trade-sl"
              type="number"
              min="0"
              step="any"
              value={stopLoss}
              disabled={isClosedTrade}
              onChange={(event) => setStopLoss(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="trade-tp">Take profit</Label>
            <Input
              id="trade-tp"
              type="number"
              min="0"
              step="any"
              value={takeProfit}
              disabled={isClosedTrade}
              onChange={(event) => setTakeProfit(event.target.value)}
            />
          </div>
          {isClosedTrade ? (
            <p className="text-muted-foreground text-sm md:col-span-2">
              Stop loss and take profit cannot be changed on closed trades.
            </p>
          ) : null}

          {mode === "create" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="trade-balance">Account balance at entry</Label>
                <Input
                  id="trade-balance"
                  type="number"
                  min="0"
                  step="0.01"
                  value={accountBalanceAtEntry}
                  onChange={(event) =>
                    setAccountBalanceAtEntry(event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trade-risk-amount">Initial risk amount</Label>
                <Input
                  id="trade-risk-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={initialRiskAmount}
                  onChange={(event) => setInitialRiskAmount(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trade-risk-pct">Initial risk %</Label>
                <Input
                  id="trade-risk-pct"
                  type="number"
                  min="0"
                  step="0.01"
                  value={initialRiskPercentage}
                  onChange={(event) =>
                    setInitialRiskPercentage(event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trade-planned-rr">Planned R:R</Label>
                <Input
                  id="trade-planned-rr"
                  type="number"
                  min="0"
                  step="0.01"
                  value={plannedRR}
                  onChange={(event) => setPlannedRR(event.target.value)}
                />
              </div>
            </>
          ) : null}

          <div className="space-y-2 md:col-span-2">
            <Label>Strategies</Label>
            <div className="flex flex-wrap gap-2">
              {strategies.map((strategy) => (
                <Button
                  key={strategy.id}
                  type="button"
                  size="sm"
                  variant={
                    selectedStrategyIds.includes(strategy.id)
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    toggleSelection(
                      selectedStrategyIds,
                      strategy.id,
                      setSelectedStrategyIds,
                    )
                  }
                >
                  {strategy.name}
                </Button>
              ))}
              {strategies.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No strategies yet. Create strategies on the Strategies page.
                </p>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Psychology & journal</CardTitle>
          <CardDescription>
            Entry criteria, mistakes, emotions, and per-trade journal fields.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Entry criteria</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Button
                  key={tag.id}
                  type="button"
                  size="sm"
                  variant={
                    selectedTagIds.includes(tag.id) ? "default" : "outline"
                  }
                  onClick={() =>
                    toggleSelection(selectedTagIds, tag.id, setSelectedTagIds)
                  }
                >
                  {tag.name}
                </Button>
              ))}
              {tags.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No entry criteria yet. Create entry criteria on the Strategies
                  page.
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mistakes</Label>
            <div className="flex flex-wrap gap-2">
              {mistakes.map((mistake) => (
                <Button
                  key={mistake.id}
                  type="button"
                  size="sm"
                  variant={
                    selectedMistakeIds.includes(mistake.id)
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    toggleSelection(
                      selectedMistakeIds,
                      mistake.id,
                      setSelectedMistakeIds,
                    )
                  }
                >
                  {mistake.name}
                </Button>
              ))}
              {mistakes.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No mistakes yet. Create mistakes on the Strategies page.
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="market-bias">Market bias</Label>
              <DropdownSelect
                id="market-bias"
                name="market-bias"
                options={MARKET_BIAS_SELECT_OPTIONS}
                value={marketBias}
                onValueChange={setMarketBias}
              />
            </div>
            <RangeInput
              id="confidence"
              label="Confidence while taking trade"
              value={confidenceScore}
              onChange={setConfidenceScore}
            />
            <div className="space-y-2">
              <Label htmlFor="pre-emotion">Pre-trade emotion</Label>
              <DropdownSelect
                id="pre-emotion"
                name="pre-emotion"
                options={EMOTION_OPTIONS}
                value={preTradeEmotion}
                onValueChange={setPreTradeEmotion}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-emotion">Post-trade emotion</Label>
              <DropdownSelect
                id="post-emotion"
                name="post-emotion"
                options={EMOTION_OPTIONS}
                value={postTradeEmotion}
                onValueChange={setPostTradeEmotion}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="plan-compliance">Plan compliance</Label>
              <DropdownSelect
                id="plan-compliance"
                name="plan-compliance"
                options={PLAN_COMPLIANCE_OPTIONS.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
                value={planCompliance}
                onValueChange={setPlanCompliance}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pre-trade-plan">Plan before taking the trade</Label>
            <Textarea
              id="pre-trade-plan"
              rows={4}
              value={preTradePlan}
              onChange={(event) => setPreTradePlan(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="post-trade-plan">Plan after taking the trade</Label>
            <Textarea
              id="post-trade-plan"
              rows={4}
              value={postTradePlan}
              onChange={(event) => setPostTradePlan(event.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="what-went-well">What went well</Label>
              <Textarea
                id="what-went-well"
                rows={4}
                value={whatWentWell}
                onChange={(event) => setWhatWentWell(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="what-went-wrong">What went wrong</Label>
              <Textarea
                id="what-went-wrong"
                rows={4}
                value={whatWentWrong}
                onChange={(event) => setWhatWentWrong(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lesson">Lesson</Label>
            <Textarea
              id="lesson"
              value={lesson}
              onChange={(event) => setLesson(event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSaving}>
          {isSaving
            ? "Saving..."
            : mode === "create"
              ? "Create trade"
              : "Save changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
