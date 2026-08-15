"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addExecution } from "@/lib/api/trades";
import { useClientAuthToken } from "@/lib/auth/client";
import type { ExecutionType, Trade } from "@/types/trade";

const TYPE_OPTIONS = [
  { value: "ENTRY", label: "Scale in (entry)" },
  { value: "EXIT", label: "Partial exit" },
];

export function AddExecutionDialog({
  trade,
  onUpdated,
}: {
  trade: Trade;
  onUpdated: (trade: Trade) => void;
}) {
  const getAuthToken = useClientAuthToken();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ExecutionType>("EXIT");
  const [price, setPrice] = useState("");
  const [volume, setVolume] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit() {
    if (!price || !volume) {
      toast.error("Enter price and volume.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await addExecution(getAuthToken, trade.id, {
        type,
        price: Number(price),
        volume: Number(volume),
      });
      onUpdated(response.data);
      setOpen(false);
      setPrice("");
      setVolume("");
      toast.success("Execution added.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to add execution.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (!open) {
    return (
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        Add execution
      </Button>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <p className="font-medium">Add execution</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="execution-type">Type</Label>
          <DropdownSelect
            id="execution-type"
            name="execution-type"
            options={TYPE_OPTIONS}
            value={type}
            onValueChange={(value) => setType(value as ExecutionType)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="execution-volume">Volume</Label>
          <Input
            id="execution-volume"
            type="number"
            min="0"
            step="any"
            value={volume}
            onChange={(event) => setVolume(event.target.value)}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="execution-price">Price</Label>
          <Input
            id="execution-price"
            type="number"
            min="0"
            step="any"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          disabled={isSaving}
          onClick={() => void handleSubmit()}
        >
          {isSaving ? "Saving..." : "Add execution"}
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
