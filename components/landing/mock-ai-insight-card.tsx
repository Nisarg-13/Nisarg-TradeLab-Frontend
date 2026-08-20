import { Bot } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
              <CardTitle className="text-base">AI Insight</CardTitle>
              <CardDescription>Sample coaching output</CardDescription>
            </div>
          </div>
          <Badge className="border-ai/30 bg-ai/10 text-ai">Coach</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed">
          New York-session performance is stronger than London-session
          performance in the supplied sample.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground text-xs">Confidence</p>
            <p className="font-medium">Moderate</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-muted-foreground text-xs">Sample</p>
            <p className="font-medium">34 trades</p>
          </div>
        </div>
        <div className="bg-ai/10 border-ai/20 rounded-lg border p-4">
          <p className="text-ai mb-1 text-xs font-medium tracking-wide uppercase">
            Suggested experiment
          </p>
          <p className="text-sm leading-relaxed">
            For the next 20 trades, avoid the historically weak setup during
            London and compare expectancy afterward.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
