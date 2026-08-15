"use client";

import { useState } from "react";
import { toast } from "sonner";

import { JournalFields } from "@/components/journal/journal-fields";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateTradeReview } from "@/lib/api/trades";
import { useClientAuthToken } from "@/lib/auth/client";
import type { JournalFieldValues } from "@/types/journal";
import type { MarketBias } from "@/types/journal";
import type { Trade, TradeReviewInput } from "@/types/trade";

function toJournalValues(review: Trade["review"]): JournalFieldValues {
  return {
    marketBias: review?.marketBias ?? "",
    preTradePlan: review?.preTradePlan ?? "",
    postTradePlan: review?.postTradePlan ?? "",
    confidenceScore: review?.confidenceScore ?? 7,
    whatWentWell: review?.whatWentWell ?? "",
    whatWentWrong: review?.whatWentWrong ?? "",
  };
}

function buildJournalPayload(values: JournalFieldValues): TradeReviewInput {
  return {
    marketBias: values.marketBias
      ? (values.marketBias as MarketBias)
      : undefined,
    preTradePlan: values.preTradePlan || undefined,
    postTradePlan: values.postTradePlan || undefined,
    confidenceScore: values.confidenceScore,
    whatWentWell: values.whatWentWell || undefined,
    whatWentWrong: values.whatWentWrong || undefined,
  };
}

export function TradeJournalCard({
  trade,
  onUpdated,
}: {
  trade: Trade;
  onUpdated: (trade: Trade) => void;
}) {
  const getAuthToken = useClientAuthToken();
  const [isSaving, setIsSaving] = useState(false);
  const [values, setValues] = useState(() => toJournalValues(trade.review));

  async function handleSave() {
    setIsSaving(true);

    try {
      const response = await updateTradeReview(
        getAuthToken,
        trade.id,
        buildJournalPayload(values),
      );

      toast.success("Trade journal saved.");
      onUpdated({ ...trade, review: response.data });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save trade journal.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Trade journal</CardTitle>
          <CardDescription>
            Capture your market read, plan, confidence, and review for this
            trade.
          </CardDescription>
        </div>
        <Button
          type="button"
          disabled={isSaving}
          onClick={() => void handleSave()}
        >
          {isSaving ? "Saving..." : "Save journal"}
        </Button>
      </CardHeader>
      <CardContent>
        <JournalFields idPrefix="trade" values={values} onChange={setValues} />
      </CardContent>
    </Card>
  );
}
