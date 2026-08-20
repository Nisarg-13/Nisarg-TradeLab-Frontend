import { AiCoachAccessRequest } from "@/components/ai-coach/ai-coach-access-request";
import { AiCoachManager } from "@/components/ai-coach/ai-coach-manager";
import { listAccounts } from "@/lib/api/accounts";
import { listAiAnalyses, listAiChatHistory } from "@/lib/api/ai";
import { getCurrentUser } from "@/lib/api/users";
import { getServerAuthToken } from "@/lib/auth/server";
import { getServerSelectedAccountId } from "@/lib/preferences/server-selected-account";
import type { TradingAccount } from "@/types/account";
import type { AiAnalysis, AiChatMessage } from "@/types/ai";

export default async function AiCoachPage() {
  let aiCoachEnabled = false;

  try {
    const userResponse = await getCurrentUser(getServerAuthToken);
    aiCoachEnabled = userResponse.data.features.aiCoach;
  } catch {
    aiCoachEnabled = false;
  }

  if (!aiCoachEnabled) {
    return <AiCoachAccessRequest />;
  }

  let accounts: TradingAccount[] = [];
  let analyses: AiAnalysis[] = [];
  let chatHistory: AiChatMessage[] = [];

  try {
    const accountsResponse = await listAccounts(getServerAuthToken);
    accounts = accountsResponse.data;
  } catch {
    accounts = [];
  }

  const selectedAccountId = await getServerSelectedAccountId(accounts);

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
