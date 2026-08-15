"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export function SidebarUser() {
  const { openUserProfile, signOut } = useClerk();
  const { user, isLoaded } = useUser();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="bg-card-hover border-sidebar-border size-8 shrink-0 animate-pulse rounded-full border" />
        <div className="min-w-0 flex-1 space-y-1">
          <div className="bg-card-hover h-4 w-24 animate-pulse rounded" />
          <div className="bg-card-hover h-3 w-16 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName =
    user.fullName ??
    user.firstName ??
    user.primaryEmailAddress?.emailAddress ??
    "Account";

  return (
    <div
      ref={menuRef}
      className={cn(
        "overflow-hidden rounded-lg",
        open && "border-border bg-card/40 border",
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        className="hover:bg-card-hover flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors"
      >
        {user.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.imageUrl}
            alt=""
            className="border-sidebar-border size-8 shrink-0 rounded-full border object-cover"
          />
        ) : (
          <div className="bg-card-hover border-sidebar-border flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{displayName}</p>
          <p className="text-muted-foreground truncate text-xs">Signed in</p>
        </div>
        <ChevronDown
          className={cn(
            "text-muted-foreground size-4 shrink-0 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div className="border-border/60 border-t px-1 pb-1">
          <button
            type="button"
            onClick={() => {
              openUserProfile();
              setOpen(false);
            }}
            className="hover:bg-card-hover flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors"
          >
            <UserRound className="size-4 shrink-0" />
            Manage profile
          </button>
          <button
            type="button"
            onClick={() => void signOut({ redirectUrl: "/" })}
            className="text-loss hover:bg-card-hover flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors"
          >
            <LogOut className="size-4 shrink-0" />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
