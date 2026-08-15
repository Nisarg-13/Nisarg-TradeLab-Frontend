"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { AppNavItem } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

export function SidebarNavLink({
  href,
  label,
  icon: Icon,
  onClick,
}: AppNavItem & { onClick?: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm transition-colors",
        isActive
          ? "border-sidebar-border bg-card-hover text-primary border-r-primary border-r-2 font-medium"
          : "text-muted-foreground hover:bg-card-hover hover:text-foreground",
      )}
    >
      <Icon className="size-4 shrink-0" />
      {label}
    </Link>
  );
}
