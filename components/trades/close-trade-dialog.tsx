"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { closeTrade } from "@/lib/api/trades";
import { useClientAuthToken } from "@/lib/auth/client";
import type { Trade } from "@/types/trade";

export function CloseTradeDialog({
  trade,
  onClosed,
}: {
  trade: Trade;
  onClosed: (trade: Trade) => void;
}) {
  const getAuthToken = useClientAuthToken();
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleClose() {
    if (!price) {
      toast.error("Enter an exit price.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await closeTrade(getAuthToken, trade.id, {
        price: Number(price),
      });
      onClosed(response.data);
      setOpen(false);
      toast.success("Trade closed.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to close trade.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (!open) {
    return (
      <Button type="button" onClick={() => setOpen(true)}>
        Close trade
      </Button>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <p className="font-medium">Close remaining {trade.currentVolume} lots</p>
      <div className="space-y-2">
        <Label htmlFor="close-price">Exit price</Label>
        <Input
          id="close-price"
          type="number"
          min="0"
          step="any"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          disabled={isSaving}
          onClick={() => void handleClose()}
        >
          {isSaving ? "Closing..." : "Confirm close"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isSaving}
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
