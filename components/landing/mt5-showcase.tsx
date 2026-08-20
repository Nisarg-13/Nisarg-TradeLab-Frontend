import { ArrowDown, Server, TrendingUp, Zap } from "lucide-react";

import { LandingSection } from "@/components/landing/landing-section";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MT5_FEATURES = [
  "Import historical trades",
  "Track open positions",
  "Synchronize future trades",
  "Preserve execution details",
  "Review imported trades later",
] as const;

export function Mt5Showcase() {
  return (
    <LandingSection
      id="mt5"
      variant="muted"
      title="Bring Your MT5 Trading History Into One Journal"
      description="Connect MetaTrader 5 to TradeLab through the Desktop Expert Advisor — not automatic cloud broker login."
    >
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <Card className="bg-card/90">
          <CardHeader>
            <CardTitle className="text-base">Sync flow</CardTitle>
            <CardDescription>
              EA-based connection with secure connection keys
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 py-4">
            <div className="bg-success/10 text-success border-success/20 flex w-full max-w-xs items-center justify-center gap-2 rounded-xl border px-4 py-4">
              <Server className="size-5" aria-hidden />
              <span className="font-medium">MetaTrader 5</span>
            </div>
            <ArrowDown className="text-muted-foreground size-5" aria-hidden />
            <div className="bg-primary/10 text-primary border-primary/20 flex w-full max-w-xs items-center justify-center gap-2 rounded-xl border px-4 py-4">
              <TrendingUp className="size-5" aria-hidden />
              <span className="font-medium">Nisarg&apos;s TradeLab</span>
            </div>
            <ArrowDown className="text-muted-foreground size-5" aria-hidden />
            <div className="text-muted-foreground flex w-full max-w-xs items-center justify-center gap-2 rounded-xl border px-4 py-4 text-sm">
              <Zap className="text-primary size-5" aria-hidden />
              Trades + Analytics + Reviews + AI
            </div>
          </CardContent>
        </Card>

        <ul className="grid gap-2 sm:grid-cols-2">
          {MT5_FEATURES.map((item) => (
            <li
              key={item}
              className="text-muted-foreground bg-card/70 rounded-lg border px-4 py-3 text-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </LandingSection>
  );
}
