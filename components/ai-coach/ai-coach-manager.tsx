"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Bot,
  Lightbulb,
  Shield,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import { AiCoachGeneratingOverlay } from "@/components/ai-coach/ai-coach-generating-overlay";
import { FormattedDateTime } from "@/components/formatting/formatted-datetime";
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

function BulletSection({
  title,
  description,
  items,
  icon: Icon,
  tone = "default",
}: {
  title: string;
  description?: string;
  items: string[];
  icon?: typeof TrendingUp;
  tone?: "default" | "positive" | "negative" | "warning" | "accent";
}) {
  if (items.length === 0) return null;

  const toneClass =
    tone === "positive"
      ? "border-emerald-500/20 bg-emerald-500/5"
      : tone === "negative"
        ? "border-red-500/20 bg-red-500/5"
        : tone === "warning"
          ? "border-amber-500/20 bg-amber-500/5"
          : tone === "accent"
            ? "border-primary/20 bg-primary/5"
            : "border-border bg-card/40";

  return (
    <Card className={toneClass}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {Icon ? <Icon className="text-primary size-4" /> : null}
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm">
          {items.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="bg-primary/80 mt-2 size-1.5 shrink-0 rounded-full" />
              <span className="text-muted-foreground leading-relaxed">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
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

  const filteredAnalyses = useMemo(
    () =>
      selectedAccountId
        ? analyses.filter(
            (analysis) => analysis.tradingAccountId === selectedAccountId,
          )
        : analyses,
    [analyses, selectedAccountId],
  );

  const selectedAnalysis =
    filteredAnalyses.find((analysis) => analysis.id === selectedAnalysisId) ??
    filteredAnalyses[0] ??
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
      {isGenerating ? <AiCoachGeneratingOverlay /> : null}

      <PageHeader
        title="AI Coach"
        description="Personalized coaching to maximize profits, minimize losses, and improve your trading process."
      >
        <Button
          type="button"
          disabled={isGenerating}
          onClick={handleGenerateAnalysis}
          className="min-w-36"
        >
          {isGenerating ? (
            <span className="inline-flex items-center gap-2">
              <Sparkles className="size-4 animate-pulse" />
              Analyzing...
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <Bot className="size-4" />
              Run analysis
            </span>
          )}
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
              onValueChange={(value) => {
                setSelectedAccountId(value);
                setSelectedAnalysisId("");
              }}
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
        <div className="space-y-6">
          {selectedAnalysis ? (
            <>
              <Card className="border-primary/20 from-primary/10 bg-gradient-to-br to-transparent">
                <CardHeader className="gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <BarChart3 className="text-primary size-5" />
                      Executive summary
                    </CardTitle>
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
                    <Badge
                      variant={
                        selectedAnalysis.source === "openai" ||
                        selectedAnalysis.source === "gemini"
                          ? "default"
                          : "outline"
                      }
                    >
                      {selectedAnalysis.source === "openai"
                        ? "OpenAI report"
                        : selectedAnalysis.source === "gemini"
                          ? "Gemini report"
                          : "Analytics-based report"}
                    </Badge>
                  </div>
                  <CardDescription className="text-foreground/90 text-base leading-relaxed">
                    {selectedAnalysis.summary}
                  </CardDescription>
                  {selectedAnalysis.fallbackReason ? (
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      OpenAI was not used for this report:{" "}
                      {selectedAnalysis.fallbackReason}
                    </p>
                  ) : null}
                </CardHeader>
              </Card>

              <div className="grid gap-6 xl:grid-cols-2">
                <BulletSection
                  title="What you're doing best"
                  description="Strengths to protect and scale."
                  items={selectedAnalysis.strengths}
                  icon={TrendingUp}
                  tone="positive"
                />
                <BulletSection
                  title="What's hurting your results"
                  description="Leaks that are costing you money."
                  items={selectedAnalysis.weaknesses}
                  icon={TrendingDown}
                  tone="negative"
                />
                <BulletSection
                  title="Patterns in your trading"
                  description="Timing, instruments, direction, and behavior trends."
                  items={selectedAnalysis.patterns}
                  icon={BarChart3}
                />
                <BulletSection
                  title="How to maximize profits & improve"
                  description="Prioritized actions based on your data."
                  items={selectedAnalysis.recommendations}
                  icon={Lightbulb}
                  tone="accent"
                />
                <BulletSection
                  title="Rules to minimize losses"
                  description="Guardrails for your next trades."
                  items={selectedAnalysis.rulesForNextTrades}
                  icon={Shield}
                  tone="warning"
                />
                <BulletSection
                  title="Data to log for better analysis"
                  description="Fill these gaps in your journal for deeper coaching."
                  items={selectedAnalysis.dataLimitations}
                  icon={AlertTriangle}
                />
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="text-muted-foreground py-10 text-sm">
                Generate an analysis to see personalized coaching on profits,
                losses, patterns, and journal gaps.
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
                      <FormattedDateTime value={message.createdAt} />
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
              <CardDescription>
                {filteredAnalyses.length} saved report
                {filteredAnalyses.length === 1 ? "" : "s"} — click to open
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredAnalyses.length === 0 ? (
                <p className="text-muted-foreground text-sm">No reports yet.</p>
              ) : (
                filteredAnalyses.map((analysis) => (
                  <button
                    key={analysis.id}
                    type="button"
                    onClick={() => {
                      setSelectedAnalysisId(analysis.id);
                      setTab("analysis");
                    }}
                    className={cn(
                      "hover:bg-muted/50 w-full rounded-lg border px-4 py-3 text-left transition-colors",
                      selectedAnalysisId === analysis.id &&
                        "border-primary bg-primary/5",
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">
                        <FormattedDateTime value={analysis.createdAt} />
                      </p>
                      <Badge
                        className={confidenceTone(analysis.sampleConfidence)}
                      >
                        {analysis.sampleConfidence}
                      </Badge>
                      <Badge variant="outline">
                        {analysis.sampleSize} trades
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                      {analysis.summary}
                    </p>
                  </button>
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
