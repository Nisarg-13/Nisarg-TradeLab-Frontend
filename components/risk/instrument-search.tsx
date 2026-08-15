"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  filterInstruments,
  formatInstrumentDisplay,
  RISK_INSTRUMENTS,
} from "@/lib/constants/risk-instruments";
import { cn } from "@/lib/utils";

type InstrumentSearchProps = {
  id?: string;
  value: string;
  onValueChange: (symbol: string) => void;
};

export function InstrumentSearch({
  id = "risk-instrument",
  value,
  onValueChange,
}: InstrumentSearchProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    const selected = RISK_INSTRUMENTS.find(
      (instrument) => instrument.symbol === value,
    );

    return selected ? formatInstrumentDisplay(selected.symbol) : "";
  }, [value]);

  const results = useMemo(() => filterInstruments(query), [query]);
  const showResults = open && query.trim().length > 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(symbol: string) {
    onValueChange(symbol);
    setQuery("");
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="space-y-2">
      <Label htmlFor={id}>Instrument</Label>
      <Input
        id={id}
        type="search"
        placeholder="Search e.g. EUR/USD, XAU, BTC"
        value={open ? query : selectedLabel}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setOpen(true);
          if (selectedLabel) {
            setQuery(selectedLabel);
          }
        }}
        autoComplete="off"
      />
      {showResults ? (
        <ul className="bg-popover text-popover-foreground max-h-48 overflow-y-auto rounded-lg border p-1 shadow-sm">
          {results.length === 0 ? (
            <li className="text-muted-foreground px-3 py-2 text-sm">
              No instruments found
            </li>
          ) : (
            results.map((instrument) => {
              const isSelected = instrument.symbol === value;

              return (
                <li key={instrument.symbol}>
                  <button
                    type="button"
                    onClick={() => handleSelect(instrument.symbol)}
                    className={cn(
                      "hover:bg-muted/70 flex w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
                      isSelected && "bg-muted font-medium",
                    )}
                  >
                    {formatInstrumentDisplay(instrument.symbol)}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}
