"use client";

import { Bot, LineChart, Sparkles, Target } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: LineChart,
    title: "Scanning your trades",
    description: "Pulling PnL, win rate, instruments, and session data",
    targetProgress: 34,
  },
  {
    icon: Target,
    title: "Finding profit & loss patterns",
    description: "Comparing strategies, mistakes, timing, and plan compliance",
    targetProgress: 68,
  },
  {
    icon: Sparkles,
    title: "Building your coaching report",
    description: "Turning analytics into actionable recommendations",
    targetProgress: 92,
  },
] as const;

const FINAL_PROGRESS = 96;

export function AiCoachGeneratingOverlay() {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(6);

  useEffect(() => {
    const stepInterval = window.setInterval(() => {
      setActiveStep((current) => Math.min(current + 1, STEPS.length - 1));
    }, 2400);

    return () => window.clearInterval(stepInterval);
  }, []);

  useEffect(() => {
    const stepTarget = STEPS[activeStep]?.targetProgress ?? FINAL_PROGRESS;
    const ceiling =
      activeStep === STEPS.length - 1 ? FINAL_PROGRESS : stepTarget;

    const progressInterval = window.setInterval(() => {
      setProgress((current) => {
        if (current >= ceiling) {
          return current;
        }

        const remaining = ceiling - current;
        const increment = remaining > 18 ? 1.4 : remaining > 6 ? 0.7 : 0.25;

        return Math.min(ceiling, current + increment);
      });
    }, 100);

    return () => window.clearInterval(progressInterval);
  }, [activeStep]);

  return (
    <div className="bg-background/85 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <Card className="border-primary/20 w-full max-w-lg shadow-2xl">
        <CardHeader className="items-center text-center">
          <div className="bg-primary/10 text-primary mb-2 flex size-16 items-center justify-center rounded-full">
            <Bot className="size-8 animate-pulse" />
          </div>
          <CardTitle className="text-2xl">
            Generating your coaching report
          </CardTitle>
          <CardDescription>
            Analyzing your journal to find how you can maximize profits and cut
            losses.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;
            const isComplete = index < activeStep;

            return (
              <div
                key={step.title}
                className={cn(
                  "flex items-start gap-3 rounded-xl border px-4 py-3 transition-all duration-500",
                  isActive
                    ? "border-primary/40 bg-primary/5 shadow-sm"
                    : isComplete
                      ? "border-primary/20 bg-primary/[0.03]"
                      : "border-border/70 bg-card/40",
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-500",
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : isComplete
                        ? "border-primary/30 bg-primary/5 text-primary/80"
                        : "border-border text-muted-foreground",
                  )}
                >
                  <Icon className={cn("size-4", isActive && "animate-pulse")} />
                </div>
                <div className="min-w-0">
                  <p
                    className={cn(
                      "font-medium transition-colors duration-500",
                      isActive || isComplete
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <div className="bg-muted h-2 overflow-hidden rounded-full">
              <div
                className="bg-primary h-full rounded-full transition-[width] duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-muted-foreground mt-3 flex items-center justify-between text-xs">
              <span>{Math.round(progress)}% complete</span>
              <span>Usually 10–30 seconds</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
