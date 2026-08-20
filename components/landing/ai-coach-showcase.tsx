import { Sparkles } from "lucide-react";

import { LandingSection } from "@/components/landing/landing-section";
import { MockAiInsightCard } from "@/components/landing/mock-ai-insight-card";

const INSIGHT_POINTS = [
  "What you do best",
  "Where losses concentrate",
  "Recurring mistakes",
  "Risk-discipline problems",
  "Promising historical patterns",
  "Process experiments for your next trades",
] as const;

export function AiCoachShowcase() {
  return (
    <LandingSection
      id="ai-coach"
      variant="muted"
      eyebrow="AI Trading Coach"
      title="An AI Coach That Uses Your Data, Not Market Predictions"
      description="TradeLab AI analyzes your journal metrics to identify strengths, weaknesses, behavior patterns, and improvement opportunities."
    >
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <ul className="grid gap-2 sm:grid-cols-2">
            {INSIGHT_POINTS.map((item) => (
              <li
                key={item}
                className="text-muted-foreground bg-card/70 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
              >
                <Sparkles className="text-ai size-4 shrink-0" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground text-sm leading-relaxed">
            No buy/sell calls. No price targets. Coaching is grounded in your
            journal, your metrics, and your execution history.
          </p>
        </div>

        <MockAiInsightCard />
      </div>
    </LandingSection>
  );
}
