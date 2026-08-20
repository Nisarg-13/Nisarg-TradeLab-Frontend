import { DailyJournalManager } from "@/components/daily-journal/daily-journal-manager";
import { listDailyJournalEntries } from "@/lib/api/journal";
import { getServerAuthToken } from "@/lib/auth/server";
import { getServerAppContext } from "@/lib/server/app-context";
import type { DailyJournal } from "@/types/journal";

export default async function DailyJournalPage() {
  const { accounts, selectedAccountId } = await getServerAppContext();
  const accountId = selectedAccountId ?? accounts[0]?.id;

  const entries = await listDailyJournalEntries(getServerAuthToken, {
    tradingAccountId: accountId,
  })
    .then((response) => response.data)
    .catch(() => [] as DailyJournal[]);

  return <DailyJournalManager accounts={accounts} initialEntries={entries} />;
}
