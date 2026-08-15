"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { APP_NAV_ITEMS } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-card hidden w-64 shrink-0 border-r md:flex md:flex-col">
      <div className="flex h-[4.5rem] shrink-0 items-center border-b px-6">
        <Link href="/dashboard" className="flex flex-col gap-0.5 leading-tight">
          <span className="text-lg font-semibold tracking-tight">
            Nisarg&apos;s TradeLab
          </span>
          <span className="text-muted-foreground text-sm">
            Track. Analyze. Improve.
          </span>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {APP_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
