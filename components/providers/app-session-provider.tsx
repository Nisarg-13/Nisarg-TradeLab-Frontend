"use client";

import { createContext, useContext } from "react";

import { seedPersistedAccountId } from "@/lib/hooks/use-persisted-account-id";

type AppSessionContextValue = {
  serverSelectedAccountId: string;
};

const AppSessionContext = createContext<AppSessionContextValue>({
  serverSelectedAccountId: "",
});

export function AppSessionProvider({
  serverSelectedAccountId,
  children,
}: {
  serverSelectedAccountId: string;
  children: React.ReactNode;
}) {
  seedPersistedAccountId(serverSelectedAccountId);

  return (
    <AppSessionContext.Provider value={{ serverSelectedAccountId }}>
      {children}
    </AppSessionContext.Provider>
  );
}

export function useServerSelectedAccountId() {
  return useContext(AppSessionContext).serverSelectedAccountId;
}
