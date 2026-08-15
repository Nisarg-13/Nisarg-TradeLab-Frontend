import {
  BarChart3,
  BookOpen,
  Bot,
  Calculator,
  LayoutDashboard,
  LineChart,
  Settings,
  Tags,
  Wallet,
  Zap,
} from "lucide-react";

export const APP_NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/trades", label: "Trades", icon: BookOpen },
  { href: "/live-trades", label: "Live Trades", icon: Zap },
  { href: "/risk-calculator", label: "Risk Calculator", icon: Calculator },
  { href: "/analytics/overview", label: "Analytics", icon: BarChart3 },
  { href: "/strategies", label: "Strategies", icon: Tags },
  { href: "/daily-journal", label: "Daily Journal", icon: LineChart },
  { href: "/ai-coach", label: "AI Coach", icon: Bot },
  { href: "/accounts", label: "Accounts", icon: Wallet },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;
