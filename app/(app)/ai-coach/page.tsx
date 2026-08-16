import { AiCoachManager } from "@/components/ai-coach/ai-coach-manager";
import { listAccounts } from "@/lib/api/accounts";
import { listAiAnalyses, listAiChatHistory } from "@/lib/api/ai";
import { getServerAuthToken } from "@/lib/auth/server";
import { getServerSelectedAccountId } from "@/lib/preferences/server-selected-account";
import type { TradingAccount } from "@/types/account";
import type { AiAnalysis, AiChatMessage } from "@/types/ai";

export default async function AiCoachPage() {
  let accounts: TradingAccount[] = [];
  let analyses: AiAnalysis[] = [];
  let chatHistory: AiChatMessage[] = [];

  try {
    const accountsResponse = await listAccounts(getServerAuthToken);
    accounts = accountsResponse.data;
  } catch {
    accounts = [];
  }

  const selectedAccountId = await getServerSelectedAccountId(
    getServerAuthToken,
    accounts,
  );

  try {
    const [analysesResponse, chatResponse] = await Promise.all([
      listAiAnalyses(getServerAuthToken),
      listAiChatHistory(getServerAuthToken),
    ]);
    analyses = selectedAccountId
      ? analysesResponse.data.filter(
          (analysis) => analysis.tradingAccountId === selectedAccountId,
        )
      : analysesResponse.data;
    chatHistory = chatResponse.data;
  } catch {
    analyses = [];
    chatHistory = [];
  }

  return (
    <AiCoachManager
      accounts={accounts}
      initialAnalyses={analyses}
      initialChatHistory={chatHistory}
    />
  );
}
