"use client";

import { useClerk, useUser } from "@clerk/nextjs";

export function SidebarUser() {
  const { openUserProfile } = useClerk();
  const { user, isLoaded } = useUser();

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
    <button
      type="button"
      onClick={() => openUserProfile()}
      className="hover:bg-card-hover flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors"
      aria-label="Open profile"
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
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{displayName}</p>
        <p className="text-muted-foreground truncate text-xs">Signed in</p>
      </div>
    </button>
  );
}
