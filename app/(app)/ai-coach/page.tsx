import { AiCoachAccessRequest } from "@/components/ai-coach/ai-coach-access-request";
import { AiCoachManager } from "@/components/ai-coach/ai-coach-manager";
import { listAiAnalyses, listAiChatHistory } from "@/lib/api/ai";
import { getServerAuthToken } from "@/lib/auth/server";
import { getServerAppContext } from "@/lib/server/app-context";
import type { AiAnalysis, AiChatMessage } from "@/types/ai";

export default async function AiCoachPage() {
  const { accounts, user, selectedAccountId } = await getServerAppContext();

  if (!user?.features.aiCoach) {
    return <AiCoachAccessRequest />;
  }

  const [analysesResult, chatHistory] = await Promise.all([
    listAiAnalyses(getServerAuthToken)
      .then((response) => response.data)
      .catch(() => [] as AiAnalysis[]),
    listAiChatHistory(getServerAuthToken)
      .then((response) => response.data)
      .catch(() => [] as AiChatMessage[]),
  ]);

  const analyses = selectedAccountId
    ? analysesResult.filter(
        (analysis) => analysis.tradingAccountId === selectedAccountId,
      )
    : analysesResult;

  return (
    <AiCoachManager
      accounts={accounts}
      initialAnalyses={analyses}
      initialChatHistory={chatHistory}
    />
  );
}
