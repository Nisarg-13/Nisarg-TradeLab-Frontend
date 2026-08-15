"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";

import {
  APP_NAV_ITEMS,
  APP_SETTINGS_NAV_ITEM,
} from "@/lib/constants/navigation";

import { SidebarNavLink } from "./sidebar-nav-link";
import { SidebarUser } from "./sidebar-user";

export function AppSidebar() {
  return (
    <aside className="bg-sidebar border-sidebar-border hidden h-full w-64 shrink-0 flex-col border-r md:flex">
      <div className="border-sidebar-border flex h-[4.5rem] shrink-0 items-center gap-3 border-b px-5">
        <div className="bg-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
          <TrendingUp className="text-primary-foreground size-5" />
        </div>
        <Link
          href="/dashboard"
          className="flex min-w-0 flex-col gap-0.5 leading-tight"
        >
          <span className="text-foreground truncate text-base font-semibold tracking-tight">
            Nisarg&apos;s TradeLab
          </span>
          <span className="text-muted-foreground truncate text-xs tracking-wide uppercase">
            Professional Terminal
          </span>
        </Link>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        {APP_NAV_ITEMS.map((item) => (
          <SidebarNavLink key={item.href} {...item} />
        ))}
      </nav>

      <div className="border-sidebar-border shrink-0 space-y-1 border-t p-3">
        <SidebarNavLink {...APP_SETTINGS_NAV_ITEM} />
        <SidebarUser />
      </div>
    </aside>
  );
}
