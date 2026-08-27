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
  disabled?: boolean;
  className?: string;
  menuPlacement?: "top" | "bottom" | "auto";
  /** Prepended to the trigger label only (not menu items). */
  triggerPrefix?: string;
};

function estimateMenuHeight(optionCount: number) {
  return Math.min(optionCount * 36 + 8, 240);
}

export function DropdownSelect({
  name,
  id,
  options,
  defaultValue,
  value,
  onValueChange,
  required,
  disabled = false,
  className,
  menuPlacement = "auto",
  triggerPrefix = "",
}: DropdownSelectProps) {
  const [open, setOpen] = useState(false);
  const [resolvedPlacement, setResolvedPlacement] = useState<"top" | "bottom">(
    "bottom",
  );
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

  function resolvePlacement() {
    if (menuPlacement === "top") {
      return "top" as const;
    }

    if (menuPlacement === "bottom") {
      return "bottom" as const;
    }

    const rect = containerRef.current?.getBoundingClientRect();

    if (!rect) {
      return "bottom" as const;
    }

    const menuHeight = estimateMenuHeight(options.length);
    const spaceBelow = window.innerHeight - rect.bottom - 8;
    const spaceAbove = rect.top - 8;

    if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
      return "top" as const;
    }

    return "bottom" as const;
  }

  function toggleOpen() {
    if (disabled) {
      return;
    }

    setOpen((current) => {
      const nextOpen = !current;

      if (nextOpen) {
        setResolvedPlacement(resolvePlacement());
      }

      return nextOpen;
    });
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
        disabled={disabled}
        onClick={toggleOpen}
        className={cn(
          "border-input bg-background flex h-9 w-full min-w-0 items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
          disabled ? "cursor-not-allowed opacity-50" : "hover:bg-muted/50",
        )}
      >
        <span className="truncate">
          {triggerPrefix}
          {selected?.label ?? "Select..."}
        </span>
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
          className={cn(
            "bg-popover text-popover-foreground absolute z-[200] max-h-60 w-max min-w-full overflow-auto rounded-lg border p-1 shadow-md",
            resolvedPlacement === "top"
              ? "bottom-[calc(100%+0.25rem)]"
              : "top-[calc(100%+0.25rem)]",
          )}
        >
          {options.length === 0 ? (
            <li className="text-muted-foreground px-2 py-2 text-sm">
              No options available
            </li>
          ) : (
            options.map((option) => {
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
                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm whitespace-nowrap transition-colors",
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
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}
