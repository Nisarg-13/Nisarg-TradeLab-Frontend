"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type DropdownSelectOption = {
  value: string;
  label: string;
};

type DropdownSelectProps = {
  name: string;
  id?: string;
  options: DropdownSelectOption[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
  className?: string;
};

export function DropdownSelect({
  name,
  id,
  options,
  defaultValue,
  value,
  onValueChange,
  required,
  className,
}: DropdownSelectProps) {
  const [open, setOpen] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? options[0]?.value ?? "",
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : uncontrolledValue;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected =
    options.find((option) => option.value === selectedValue) ?? options[0];

  function updateValue(nextValue: string) {
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <input
        type="hidden"
        name={name}
        value={selectedValue}
        required={required}
      />
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="border-input bg-background hover:bg-muted/50 flex h-9 w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors"
      >
        <span>{selected?.label ?? "Select..."}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 opacity-50 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <ul
          role="listbox"
          className="bg-popover text-popover-foreground absolute top-[calc(100%+0.25rem)] z-50 max-h-60 w-full overflow-auto rounded-lg border p-1 shadow-md"
        >
          {options.map((option) => {
            const isSelected = selectedValue === option.value;

            return (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    updateValue(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                    isSelected ? "bg-muted font-medium" : "hover:bg-muted/70",
                  )}
                >
                  <Check
                    className={cn(
                      "size-4 shrink-0",
                      isSelected ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
