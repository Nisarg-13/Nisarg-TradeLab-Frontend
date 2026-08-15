"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  askAiJournal,
  generateAiAnalysis,
  listAiAnalyses,
  listAiChatHistory,
} from "@/lib/api/ai";
import { useClientAuthToken } from "@/lib/auth/client";
import { usePersistedAccountId } from "@/lib/hooks/use-persisted-account-id";
import { cn } from "@/lib/utils";
import type { TradingAccount } from "@/types/account";
import type { AiAnalysis, AiChatMessage, SampleConfidence } from "@/types/ai";

const TABS = [
  { id: "analysis", label: "Analysis" },
  { id: "chat", label: "Ask My Journal" },
  { id: "history", label: "History" },
] as const;

type CoachTab = (typeof TABS)[number]["id"];

function confidenceTone(confidence: SampleConfidence) {
  switch (confidence) {
    case "HIGH":
      return "border-profit/30 bg-profit/10 text-profit";
    case "MODERATE":
      return "border-primary/30 bg-primary/10 text-primary";
    case "LOW":
      return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    default:
      return "border-loss/30 bg-loss/10 text-loss";
  }
}

function BulletSection({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold tracking-wide uppercase">{title}</h3>
      <ul className="text-muted-foreground space-y-2 text-sm">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-primary mt-1">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AiCoachManager({
  accounts,
  initialAnalyses,
  initialChatHistory,
}: {
  accounts: TradingAccount[];
  initialAnalyses: AiAnalysis[];
  initialChatHistory: AiChatMessage[];
}) {
  const getAuthToken = useClientAuthToken();
  const { accountId: selectedAccountId, setAccountId: setSelectedAccountId } =
    usePersistedAccountId(accounts);
  const [tab, setTab] = useState<CoachTab>("analysis");
  const [analyses, setAnalyses] = useState(initialAnalyses);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState(
    initialAnalyses[0]?.id ?? "",
  );
  const [chatHistory, setChatHistory] = useState(initialChatHistory);
  const [question, setQuestion] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAsking, setIsAsking] = useState(false);

  const accountOptions = useMemo(
    () => [
      { value: "", label: "All accounts" },
      ...accounts.map((account) => ({
        value: account.id,
        label: account.name,
      })),
    ],
    [accounts],
  );

  const selectedAnalysis =
    analyses.find((analysis) => analysis.id === selectedAnalysisId) ??
    analyses[0] ??
    null;

  async function handleGenerateAnalysis() {
    setIsGenerating(true);

    try {
      const response = await generateAiAnalysis(getAuthToken, {
        tradingAccountId: selectedAccountId || undefined,
      });
      const history = await listAiAnalyses(getAuthToken);
      setAnalyses(history.data);
      setSelectedAnalysisId(response.data.id);
      setTab("analysis");
      toast.success("AI analysis generated.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to generate analysis.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleAskQuestion() {
    if (!question.trim()) {
      toast.error("Enter a question first.");
      return;
    }

    setIsAsking(true);

    try {
      const response = await askAiJournal(getAuthToken, {
        question: question.trim(),
        tradingAccountId: selectedAccountId || undefined,
      });
      const history = await listAiChatHistory(getAuthToken);
      setChatHistory(history.data);
      setQuestion("");
      setTab("chat");
      toast.success("Answer ready.");
      void response;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to ask your journal.",
      );
    } finally {
      setIsAsking(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Coach"
        description="Review structured coaching insights and ask questions about your journal data."
      >
        <Button
          type="button"
          disabled={isGenerating}
          onClick={handleGenerateAnalysis}
        >
          {isGenerating ? "Generating..." : "Run analysis"}
        </Button>
      </PageHeader>

      <Card>
        <CardHeader className="gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle>Scope</CardTitle>
            <CardDescription>
              Filter coaching to a specific trading account or use all accounts.
            </CardDescription>
          </div>
          <div className="w-full max-w-xs space-y-2">
            <Label htmlFor="coach-account">Trading account</Label>
            <DropdownSelect
              id="coach-account"
              name="coach-account"
              value={selectedAccountId}
              onValueChange={setSelectedAccountId}
              options={accountOptions}
            />
          </div>
        </CardHeader>
      </Card>

      <div className="flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              tab === item.id
                ? "border-primary bg-primary/10 text-primary"
                : "hover:bg-muted/50",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "analysis" ? (
        <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Analysis History</CardTitle>
              <CardDescription>
                {analyses.length} saved report
                {analyses.length === 1 ? "" : "s"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {analyses.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No analyses yet. Run your first coaching report.
                </p>
              ) : (
                analyses.map((analysis) => (
                  <button
                    key={analysis.id}
                    type="button"
                    onClick={() => setSelectedAnalysisId(analysis.id)}
                    className={cn(
                      "w-full rounded-lg border px-4 py-3 text-left transition-colors",
                      selectedAnalysis?.id === analysis.id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50",
                    )}
                  >
                    <p className="font-medium">
                      {new Date(analysis.createdAt).toLocaleString()}
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {analysis.sampleSize} trades · {analysis.sampleConfidence}
                    </p>
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          {selectedAnalysis ? (
            <Card>
              <CardHeader className="gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <CardTitle>Performance Analysis</CardTitle>
                  <Badge
                    className={confidenceTone(
                      selectedAnalysis.sampleConfidence,
                    )}
                  >
                    {selectedAnalysis.sampleConfidence} confidence
                  </Badge>
                  <Badge variant="outline">
                    {selectedAnalysis.sampleSize} closed trades
                  </Badge>
                </div>
                <CardDescription>{selectedAnalysis.summary}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <BulletSection
                  title="Strengths"
                  items={selectedAnalysis.strengths}
                />
                <BulletSection
                  title="Weaknesses"
                  items={selectedAnalysis.weaknesses}
                />
                <BulletSection
                  title="Patterns"
                  items={selectedAnalysis.patterns}
                />
                <BulletSection
                  title="Recommendations"
                  items={selectedAnalysis.recommendations}
                />
                <BulletSection
                  title="Rules for next trades"
                  items={selectedAnalysis.rulesForNextTrades}
                />
                <BulletSection
                  title="Data limitations"
                  items={selectedAnalysis.dataLimitations}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-muted-foreground py-10 text-sm">
                Generate an analysis to see structured coaching output here.
              </CardContent>
            </Card>
          )}
        </div>
      ) : null}

      {tab === "chat" ? (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ask My Journal</CardTitle>
              <CardDescription>
                Ask about best instruments, timing, strategy performance, plan
                compliance, mistakes, or recent changes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="coach-question">Question</Label>
                <Textarea
                  id="coach-question"
                  rows={3}
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="What is my best performing instrument this month?"
                />
              </div>
              <Button
                type="button"
                disabled={isAsking}
                onClick={handleAskQuestion}
              >
                {isAsking ? "Thinking..." : "Ask"}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {chatHistory.length === 0 ? (
              <Card>
                <CardContent className="text-muted-foreground py-8 text-sm">
                  Your Q&A history will appear here.
                </CardContent>
              </Card>
            ) : (
              chatHistory.map((message) => (
                <Card key={message.id}>
                  <CardHeader className="gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-base">
                        {message.question}
                      </CardTitle>
                      <Badge variant="outline">{message.answer.intent}</Badge>
                      <Badge
                        className={confidenceTone(message.answer.confidence)}
                      >
                        {message.answer.confidence}
                      </Badge>
                    </div>
                    <CardDescription>
                      {new Date(message.createdAt).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>{message.answer.summary}</p>
                    <BulletSection
                      title="Evidence"
                      items={message.answer.evidence}
                    />
                    <BulletSection
                      title="Limitations"
                      items={message.answer.limitations}
                    />
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      ) : null}

      {tab === "history" ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Reports</CardTitle>
              <CardDescription>Saved coaching analyses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {analyses.length === 0 ? (
                <p className="text-muted-foreground text-sm">No reports yet.</p>
              ) : (
                analyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className="rounded-lg border px-4 py-3"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">
                        {new Date(analysis.createdAt).toLocaleString()}
                      </p>
                      <Badge
                        className={confidenceTone(analysis.sampleConfidence)}
                      >
                        {analysis.sampleConfidence}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-2 text-sm">
                      {analysis.summary}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chat History</CardTitle>
              <CardDescription>
                Previous Ask My Journal questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {chatHistory.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No questions yet.
                </p>
              ) : (
                chatHistory.map((message) => (
                  <div key={message.id} className="rounded-lg border px-4 py-3">
                    <p className="font-medium">{message.question}</p>
                    <p className="text-muted-foreground mt-2 text-sm">
                      {message.answer.summary}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
