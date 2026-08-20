export const LANDING_NAV_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "Analytics", href: "#analytics" },
  { label: "AI Coach", href: "#ai-coach" },
  { label: "Risk Management", href: "#risk-management" },
  { label: "MT5", href: "#mt5" },
] as const;

export const LANDING_HERO_HIGHLIGHTS = [
  "MT5 trade syncing",
  "Advanced analytics",
  "AI performance coach",
  "Risk calculator",
  "No trading signals",
] as const;

export const LANDING_FEATURES = [
  {
    title: "Trading Journal",
    description:
      "Record entries, exits, stop loss, take profit, strategy, mistakes, emotions, notes, and structured trade reviews.",
    icon: "BookOpen" as const,
    accent: "primary" as const,
  },
  {
    title: "Advanced Analytics",
    description:
      "Analyze expectancy, R-multiple, profit factor, drawdown, sessions, instruments, timing, streaks, and more.",
    icon: "BarChart3" as const,
    accent: "profit" as const,
  },
  {
    title: "AI Trading Coach",
    description:
      "Get evidence-based coaching from your own journal metrics — no market predictions or trading signals.",
    icon: "Bot" as const,
    accent: "ai" as const,
  },
  {
    title: "Risk Calculator",
    description:
      "Calculate position size, risk percentage, potential loss, reward, and planned R:R before entering a trade.",
    icon: "Calculator" as const,
    accent: "loss" as const,
  },
  {
    title: "MT5 Integration",
    description:
      "Import historical trades and keep future activity synchronized via the TradeLab MetaTrader 5 Expert Advisor.",
    icon: "Zap" as const,
    accent: "success" as const,
  },
  {
    title: "Daily Journal",
    description:
      "Track market bias, confidence, planned risk context, plan compliance, and post-session reflections.",
    icon: "LineChart" as const,
    accent: "primary" as const,
  },
] as const;

export const LANDING_HOW_IT_WORKS = [
  {
    step: 1,
    title: "Connect or Add Your Trades",
    description: "Import trades from MT5 via the EA or journal them manually.",
  },
  {
    step: 2,
    title: "Review Your Performance",
    description:
      "Analyze instruments, strategies, sessions, risk, mistakes, and execution quality.",
  },
  {
    step: 3,
    title: "Improve Your Process",
    description:
      "Use analytics and AI coaching to identify what to keep, stop, and test next.",
  },
] as const;

export const LANDING_ANALYTICS_CATEGORIES = [
  "Instrument performance",
  "Long vs Short",
  "Session performance",
  "Day and hour performance",
  "Strategy performance",
  "Setup / confluence performance",
  "Risk behavior",
  "Planned vs realized R",
  "Plan compliance",
  "Mistakes",
  "Streak behavior",
  "Drawdown",
  "Execution quality",
  "Profit / loss concentration",
] as const;

export const LANDING_PSYCHOLOGY_ITEMS = [
  "Confidence",
  "Market Bias",
  "Plan Compliance",
  "Mistakes",
  "Emotions",
  "Pre-Trade Plan",
  "Post-Market Review",
  "Behavioral Patterns",
] as const;

export const LANDING_NO_SIGNALS = [
  "No buy/sell signals",
  "No guaranteed-profit claims",
  "No AI price predictions",
] as const;
