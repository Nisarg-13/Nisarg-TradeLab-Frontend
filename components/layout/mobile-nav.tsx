"use client";

import { Menu, TrendingUp, X } from "lucide-react";
import { useState } from "react";

import {
  APP_NAV_ITEMS,
  APP_SETTINGS_NAV_ITEM,
} from "@/lib/constants/navigation";
import { Button } from "@/components/ui/button";

import { SidebarNavLink } from "./sidebar-nav-link";
import { SidebarUser } from "./sidebar-user";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className="md:hidden">
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-expanded={open}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="size-4" /> : <Menu className="size-4" />}
      </Button>

      {open ? (
        <div className="bg-background/90 fixed inset-0 z-50 backdrop-blur-sm">
          <nav className="bg-sidebar absolute inset-x-0 top-0 flex max-h-[100dvh] flex-col border-b">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary flex size-8 items-center justify-center rounded-lg">
                  <TrendingUp className="text-primary-foreground size-4" />
                </div>
                <div>
                  <p className="font-semibold">Nisarg&apos;s TradeLab</p>
                  <p className="text-muted-foreground text-xs tracking-wide uppercase">
                    Professional Terminal
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Close navigation menu"
                onClick={closeMenu}
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-4 pb-2">
              {APP_NAV_ITEMS.map((item) => (
                <SidebarNavLink key={item.href} {...item} onClick={closeMenu} />
              ))}
            </div>

            <div className="border-sidebar-border shrink-0 space-y-1 border-t p-4">
              <SidebarNavLink {...APP_SETTINGS_NAV_ITEM} onClick={closeMenu} />
              <SidebarUser />
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
