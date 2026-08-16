import { DailyJournalManager } from "@/components/daily-journal/daily-journal-manager";
import { listAccounts } from "@/lib/api/accounts";
import { listDailyJournalEntries } from "@/lib/api/journal";
import { getServerAuthToken } from "@/lib/auth/server";
import { getServerSelectedAccountId } from "@/lib/preferences/server-selected-account";
import type { TradingAccount } from "@/types/account";
import type { DailyJournal } from "@/types/journal";

export default async function DailyJournalPage() {
  let accounts: TradingAccount[] = [];
  let entries: DailyJournal[] = [];

  try {
    const accountsResponse = await listAccounts(getServerAuthToken);
    accounts = accountsResponse.data;
  } catch {
    accounts = [];
  }

  const selectedAccountId =
    (await getServerSelectedAccountId(getServerAuthToken, accounts)) ??
    accounts[0]?.id;

  try {
    const entriesResponse = await listDailyJournalEntries(getServerAuthToken, {
      tradingAccountId: selectedAccountId,
    });
    entries = entriesResponse.data;
  } catch {
    entries = [];
  }

  return <DailyJournalManager accounts={accounts} initialEntries={entries} />;
}
