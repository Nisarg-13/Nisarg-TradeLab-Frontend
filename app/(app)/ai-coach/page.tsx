import { AiCoachManager } from "@/components/ai-coach/ai-coach-manager";
import { PlaceholderPage } from "@/components/layout/placeholder-page";
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
    return (
      <PlaceholderPage
        title="AI Coach"
        description="Personalized coaching from your trading journal is coming soon. Stay tuned — we're rolling this out gradually."
        cardTitle="Feature coming soon"
        cardDescription="AI Coach will analyze your trades, patterns, and journal entries to give you structured feedback."
        cardBody="You'll be able to run performance analyses, ask questions about your journal, and get evidence-backed recommendations. We will enable access in upcoming releases."
      />
    );
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
