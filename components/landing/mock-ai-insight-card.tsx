import { Bot, TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const INSIGHTS = [
  {
    title: "Session edge",
    body: "New York session trades show stronger historical performance than London session.",
    confidence: "Moderate",
    sample: "34 trades",
  },
  {
    title: "Recurring mistake",
    body: "Losses cluster when entries happen before the 15m structure confirms.",
    confidence: "High",
    sample: "18 trades",
  },
] as const;

const STRENGTHS = [
  { label: "Plan compliance", value: 82, tone: "bg-profit" },
  { label: "Risk discipline", value: 74, tone: "bg-primary" },
  { label: "Setup selection", value: 68, tone: "bg-primary" },
] as const;

const WEAKNESSES = [
  { label: "Early entries", value: 61, tone: "bg-loss" },
  { label: "Overtrading Fri", value: 48, tone: "bg-loss" },
] as const;

function MetricBar({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-data font-medium">{value}%</span>
      </div>
      <div className="bg-muted h-1.5 overflow-hidden rounded-full">
        <div
          className={cn("h-full rounded-full", tone)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function MockAiInsightCard() {
  return (
    <Card className="border-ai/30 bg-card/90">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-ai/15 text-ai flex size-9 items-center justify-center rounded-lg">
              <Bot className="size-5" aria-hidden />
            </div>
            <div>
              <CardTitle className="text-base">AI Coach report</CardTitle>
              <CardDescription>
                Sample analysis from your journal
              </CardDescription>
            </div>
          </div>
          <Badge className="border-ai/30 bg-ai/10 text-ai">Coach</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border p-2.5 text-center">
            <p className="text-muted-foreground text-[10px] uppercase">
              Trades reviewed
            </p>
            <p className="tabular-data text-lg font-semibold">127</p>
          </div>
          <div className="rounded-lg border p-2.5 text-center">
            <p className="text-muted-foreground text-[10px] uppercase">
              Win rate
            </p>
            <p className="tabular-data text-lg font-semibold">58.3%</p>
          </div>
          <div className="rounded-lg border p-2.5 text-center">
            <p className="text-muted-foreground text-[10px] uppercase">Avg R</p>
            <p className="text-profit tabular-data text-lg font-semibold">
              +0.42R
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {INSIGHTS.map((insight) => (
            <div key={insight.title} className="rounded-lg border p-3">
              <p className="text-ai mb-1 text-xs font-medium tracking-wide uppercase">
                {insight.title}
              </p>
              <p className="text-sm leading-relaxed">{insight.body}</p>
              <div className="mt-2 flex gap-3 text-xs">
                <span className="text-muted-foreground">
                  Confidence:{" "}
                  <span className="text-foreground font-medium">
                    {insight.confidence}
                  </span>
                </span>
                <span className="text-muted-foreground">
                  Sample:{" "}
                  <span className="text-foreground font-medium">
                    {insight.sample}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <TrendingUp className="text-profit size-3.5" aria-hidden />
              Strengths
            </div>
            {STRENGTHS.map((item) => (
              <MetricBar key={item.label} {...item} />
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <TrendingDown className="text-loss size-3.5" aria-hidden />
              Focus areas
            </div>
            {WEAKNESSES.map((item) => (
              <MetricBar key={item.label} {...item} />
            ))}
          </div>
        </div>

        <div className="bg-ai/10 border-ai/20 rounded-lg border p-4">
          <p className="text-ai mb-1 text-xs font-medium tracking-wide uppercase">
            Suggested experiment
          </p>
          <p className="text-sm leading-relaxed">
            Review your next 20 trades while maintaining consistent risk rules.
            Track whether NY-session entries improve expectancy vs London open.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
