export const LANDING_NAV_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "Analytics", href: "#analytics" },
  { label: "AI Coach", href: "#ai-coach" },
  { label: "Risk Management", href: "#risk-management" },
  { label: "MT5", href: "#mt5" },
] as const;

export const LANDING_HERO = {
  eyebrow: "Personal Trading Journal",
  headline: "Turn Your Trading History Into Your Greatest Advantage.",
  description:
    "Nisarg's TradeLab helps traders analyze every decision, discover repeatable patterns, manage risk, and improve their trading process using real performance data.",
  primaryCta: "Start Trading Journal",
  secondaryCta: "Sign In",
} as const;

export const LANDING_HERO_HIGHLIGHTS = [
  "Advanced Analytics",
  "AI Trading Coach",
  "Risk Calculator",
  "MT5 Integration",
  "No Trading Signals",
] as const;

export const LANDING_FEATURES_SECTION = {
  title: "Everything You Need To Improve Your Trading",
  description:
    "TradeLab combines journaling, analytics, risk management, MT5 synchronization, and AI-assisted performance review in one place.",
} as const;

export const LANDING_FEATURES = [
  {
    title: "Trading Journal",
    description:
      "Record every trade including entry, exit, reasoning, emotions, mistakes, and execution quality.",
    icon: "BookOpen" as const,
    accent: "primary" as const,
  },
  {
    title: "Advanced Analytics",
    description:
      "Discover your best instruments, sessions, strategies, and trading patterns.",
    icon: "BarChart3" as const,
    accent: "profit" as const,
  },
  {
    title: "AI Trading Coach",
    description:
      "Receive personalized insights based on your own trading history.",
    icon: "Bot" as const,
    accent: "ai" as const,
  },
  {
    title: "Risk Calculator",
    description:
      "Calculate position size, risk percentage, potential loss, and R:R before entering.",
    icon: "Calculator" as const,
    accent: "loss" as const,
  },
  {
    title: "MT5 Integration",
    description:
      "Import your trading history and keep your journal synchronized via the Expert Advisor.",
    icon: "Zap" as const,
    accent: "success" as const,
  },
  {
    title: "Psychology Tracking",
    description:
      "Track emotions, confidence, discipline, market bias, and mistakes alongside performance.",
    icon: "LineChart" as const,
    accent: "primary" as const,
  },
] as const;

export const LANDING_HOW_IT_WORKS = [
  {
    step: 1,
    title: "Connect Your Trades",
    description: "Import trades from MT5 or add them manually.",
  },
  {
    step: 2,
    title: "Analyze Your Performance",
    description:
      "Understand your strengths, weaknesses, and recurring patterns.",
  },
  {
    step: 3,
    title: "Improve Your Process",
    description:
      "Use analytics and AI coaching to build better trading habits.",
  },
] as const;

export const LANDING_ANALYTICS_SECTION = {
  title: "Discover Your Trading Edge",
  description:
    "TradeLab breaks your performance down across the dimensions that matter so you can distinguish repeatable behavior from noise.",
} as const;

export const LANDING_ANALYTICS_CATEGORIES = [
  "Instrument performance",
  "Long vs Short",
  "Session performance",
  "Best trading hours",
  "Strategy performance",
  "Setup performance",
  "Risk behavior",
  "Planned vs Realized R",
  "Plan compliance",
  "Mistakes",
  "Drawdown",
  "Profit/Loss concentration",
] as const;

export const LANDING_PSYCHOLOGY_SECTION = {
  title: "Track More Than Profit And Loss",
  description:
    "Trading performance depends on decisions, behavior, and execution quality. TradeLab helps you record the context around your decisions.",
  disclaimer:
    "TradeLab surfaces patterns in your journal data. It does not claim causation — only historical associations in your own history.",
} as const;

export const LANDING_PSYCHOLOGY_ITEMS = [
  "Confidence",
  "Market Bias",
  "Plan Compliance",
  "Mistakes",
  "Emotions",
  "Pre-Trade Plan",
  "Post Trade Review",
  "Behavioral Patterns",
] as const;

export const LANDING_NO_SIGNALS = {
  title:
    "TradeLab Does Not Tell You What To Trade. It Helps You Understand How You Trade.",
  description:
    "TradeLab focuses on your journal, your metrics, your execution, your behavior, and your process.",
  items: [
    "No buy/sell signals",
    "No guaranteed profit claims",
    "No AI price predictions",
    "Only your data and your improvement process",
  ],
} as const;

export const LANDING_PRODUCT_TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "analytics", label: "Analytics" },
  { id: "ai-coach", label: "AI Coach" },
  { id: "trade", label: "Trade Detail" },
] as const;
