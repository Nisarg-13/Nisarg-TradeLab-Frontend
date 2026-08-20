import {
  ArrowDown,
  CheckCircle2,
  Clock,
  History,
  RefreshCw,
  Server,
  TrendingUp,
  Zap,
} from "lucide-react";

import { LandingSection } from "@/components/landing/landing-section";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MT5_FEATURES = [
  {
    title: "Import historical trades",
    description: "Pull closed trades from MT5 into one searchable journal.",
    icon: History,
  },
  {
    title: "Track open positions",
    description: "See live exposure alongside planned risk and journal notes.",
    icon: TrendingUp,
  },
  {
    title: "Synchronize future trades",
    description: "New executions sync automatically through the EA.",
    icon: RefreshCw,
  },
  {
    title: "Preserve execution details",
    description: "Keep fills, slippage, and ticket data for later review.",
    icon: CheckCircle2,
  },
  {
    title: "Review imported trades later",
    description: "Tag, annotate, and analyze synced history in TradeLab.",
    icon: Clock,
  },
] as const;

const RECENT_SYNC = [
  { time: "2 min ago", event: "3 closed trades imported", count: "+3" },
  { time: "18 min ago", event: "EURUSD position synced", count: "Live" },
  { time: "1 hr ago", event: "Daily sync completed", count: "127 total" },
] as const;

export function Mt5Showcase() {
  return (
    <LandingSection
      id="mt5"
      variant="muted"
      title="Bring Your MT5 Trading History Into One Journal"
      description="Connect MetaTrader 5 to TradeLab through the Desktop Expert Advisor — not automatic cloud broker login."
    >
      <div className="grid items-stretch gap-8 lg:grid-cols-2">
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

        <div className="flex flex-col gap-4">
          <Card className="bg-card/90">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base">Connection status</CardTitle>
                  <CardDescription>Demo account · IC Markets</CardDescription>
                </div>
                <Badge className="bg-success/15 text-success border-success/30">
                  Connected
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-muted-foreground text-xs">Last sync</p>
                  <p className="text-sm font-medium">2 min ago</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-muted-foreground text-xs">Imported</p>
                  <p className="tabular-data text-sm font-semibold">127</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-muted-foreground text-xs">Open</p>
                  <p className="tabular-data text-sm font-semibold">2</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Recent activity
                </p>
                {RECENT_SYNC.map((item) => (
                  <div
                    key={item.event}
                    className="bg-background/60 flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm"
                  >
                    <div>
                      <p className="font-medium">{item.event}</p>
                      <p className="text-muted-foreground text-xs">
                        {item.time}
                      </p>
                    </div>
                    <span className="text-primary tabular-data text-xs font-medium">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-2 sm:grid-cols-2">
            {MT5_FEATURES.map((item) => (
              <div
                key={item.title}
                className="bg-card/70 flex gap-3 rounded-lg border px-3 py-3"
              >
                <item.icon
                  className="text-primary mt-0.5 size-4 shrink-0"
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LandingSection>
  );
}
