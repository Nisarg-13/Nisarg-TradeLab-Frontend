"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export function LandingReveal({
  children,
  className,
  delay = 0,
  playOnMount = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  playOnMount?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(playOnMount);

  useEffect(() => {
    if (playOnMount) {
      return;
    }

    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [playOnMount]);

  return (
    <div
      ref={ref}
      className={cn(
        "landing-reveal",
        visible && "landing-reveal-visible",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
