"use client";

import { useState } from "react";

import {
  MockAiCoachPanel,
  MockAnalyticsPanel,
  MockDashboardPanel,
  MockTradeDetailPanel,
} from "@/components/landing/mock-panels";
import { LANDING_PRODUCT_TABS } from "@/lib/constants/landing";
import { cn } from "@/lib/utils";

type ProductTab = (typeof LANDING_PRODUCT_TABS)[number]["id"];

const PANELS: Record<ProductTab, React.ReactNode> = {
  dashboard: <MockDashboardPanel />,
  analytics: <MockAnalyticsPanel />,
  "ai-coach": <MockAiCoachPanel />,
  trade: <MockTradeDetailPanel />,
};

export function ProductPreviewTabs() {
  const [activeTab, setActiveTab] = useState<ProductTab>("dashboard");

  return (
    <div>
      <div
        className="mb-4 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Product preview views"
      >
        {LANDING_PRODUCT_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`preview-panel-${tab.id}`}
            id={`preview-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm transition-colors",
              activeTab === tab.id
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-card/60",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`preview-panel-${activeTab}`}
        aria-labelledby={`preview-tab-${activeTab}`}
      >
        {PANELS[activeTab]}
      </div>
    </div>
  );
}
