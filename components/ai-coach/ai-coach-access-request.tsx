import { Sparkles } from "lucide-react";

import { MockAiInsightCard } from "@/components/landing/mock-ai-insight-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const INSIGHT_POINTS = [
  "What you do best",
  "Where losses concentrate",
  "Recurring mistakes",
  "Risk-discipline problems",
  "Promising historical patterns",
  "Process experiments for your next trades",
] as const;

const AI_COACH_CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_AI_COACH_CONTACT_EMAIL?.trim() ?? "";

export function AiCoachAccessRequest() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Coach"
        description="Evidence-based coaching from your trading journal metrics — not market predictions."
      />

      <Card className="border-ai/30">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-base">Access required</CardTitle>
            <Badge className="border-ai/30 bg-ai/10 text-ai">
              Early access
            </Badge>
          </div>
          <CardDescription>
            You do not currently have access to the AI Coach tool.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            AI Coach is rolling out gradually. It analyzes your pre-calculated
            journal metrics to surface strengths, weaknesses, behavioral
            patterns, and process experiments — without buy/sell signals or
            price predictions.
          </p>
          <p className="text-sm leading-relaxed">
            {AI_COACH_CONTACT_EMAIL ? (
              <>
                To request access, email{" "}
                <a
                  href={`mailto:${AI_COACH_CONTACT_EMAIL}?subject=TradeLab%20AI%20Coach%20Access%20Request`}
                  className="text-primary font-medium hover:underline"
                >
                  {AI_COACH_CONTACT_EMAIL}
                </a>{" "}
                from the address linked to your TradeLab account.
              </>
            ) : (
              <>
                To request access, contact the TradeLab administrator from the
                email address linked to your account.
              </>
            )}
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Preview of what AI Coach provides once access is enabled:
        </p>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
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
        <MockAiInsightCard />
      </div>
    </div>
  );
}
