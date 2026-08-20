import {
  BarChart3,
  BookOpen,
  Bot,
  Calculator,
  LineChart,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { LandingSection } from "@/components/landing/landing-section";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LANDING_FEATURES,
  LANDING_FEATURES_SECTION,
} from "@/lib/constants/landing";
import { cn } from "@/lib/utils";

const ICONS: Record<(typeof LANDING_FEATURES)[number]["icon"], LucideIcon> = {
  BookOpen,
  BarChart3,
  Bot,
  Calculator,
  Zap,
  LineChart,
};

const ACCENT_CLASSES = {
  primary: "border-primary/30 bg-primary/10 text-primary",
  profit: "border-profit/30 bg-profit/10 text-profit",
  ai: "border-ai/30 bg-ai/10 text-ai",
  loss: "border-loss/30 bg-loss/10 text-loss",
  success: "border-success/30 bg-success/10 text-success",
} as const;

export function FeatureGrid() {
  return (
    <LandingSection
      id="features"
      title={LANDING_FEATURES_SECTION.title}
      description={LANDING_FEATURES_SECTION.description}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {LANDING_FEATURES.map((feature) => {
          const Icon = ICONS[feature.icon];
          return (
            <Card
              key={feature.title}
              className="hover:bg-card-hover bg-card/80 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
            >
              <CardHeader>
                <div
                  className={cn(
                    "mb-3 inline-flex size-10 items-center justify-center rounded-lg border",
                    ACCENT_CLASSES[feature.accent],
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          );
        })}
      </div>
    </LandingSection>
  );
}
