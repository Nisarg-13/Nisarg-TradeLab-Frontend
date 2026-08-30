"use client";

import { useEffect, useState } from "react";

export function TypewriterText({
  text,
  enabled = true,
  className,
  onComplete,
  speedMs = 16,
  charsPerTick = 1,
}: {
  text: string;
  enabled?: boolean;
  className?: string;
  onComplete?: () => void;
  speedMs?: number;
  charsPerTick?: number;
}) {
  const [displayed, setDisplayed] = useState(enabled ? "" : text);
  const [isComplete, setIsComplete] = useState(!enabled || text.length === 0);

  useEffect(() => {
    if (!enabled || !text) {
      return;
    }

    let index = 0;
    const intervalId = window.setInterval(() => {
      index = Math.min(index + charsPerTick, text.length);
      setDisplayed(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(intervalId);
        setIsComplete(true);
      }
    }, speedMs);

    return () => window.clearInterval(intervalId);
  }, [charsPerTick, enabled, speedMs, text]);

  useEffect(() => {
    if (isComplete) {
      onComplete?.();
    }
  }, [isComplete, onComplete]);

  const visibleText = enabled ? displayed : text;
  const complete = !enabled || isComplete;

  return (
    <span className={className}>
      {visibleText}
      {!complete ? (
        <span className="ml-0.5 inline-block h-[1.1em] w-0.5 animate-pulse bg-current align-middle" />
      ) : null}
    </span>
  );
}
