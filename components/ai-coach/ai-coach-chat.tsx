"use client";

import {
  AlertTriangle,
  ArrowUp,
  Ban,
  BarChart3,
  Bot,
  Clock,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { Badge } from "@/components/ui/badge";
import { TypewriterText } from "@/components/ai-coach/typewriter-text";
import { cn } from "@/lib/utils";
import type { AiChatAnswer, AiChatMessage, SampleConfidence } from "@/types/ai";

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

function ChatSection({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items: string[];
  icon?: typeof TrendingUp;
}) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {Icon ? <Icon className="text-primary size-3.5" /> : null}
        <p className="text-foreground text-sm font-medium">{title}</p>
      </div>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li
            key={item}
            className="text-muted-foreground flex gap-2 leading-relaxed"
          >
            <span className="bg-primary/70 mt-2 size-1 shrink-0 rounded-full" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChatAnswerDetails({
  answer,
  animate = false,
}: {
  answer: AiChatAnswer;
  animate?: boolean;
}) {
  const [showDetails, setShowDetails] = useState(!animate);

  return (
    <div className="space-y-4">
      <p className="text-foreground/90 text-[15px] leading-relaxed">
        <TypewriterText
          key={answer.summary}
          text={answer.summary}
          enabled={animate}
          onComplete={() => setShowDetails(true)}
        />
      </p>

      {showDetails ? (
        <div
          className={cn(
            "space-y-5",
            animate && "animate-in fade-in slide-in-from-bottom-1 duration-300",
          )}
        >
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{answer.intent}</Badge>
            <Badge className={confidenceTone(answer.confidence)}>
              {answer.confidence}
            </Badge>
            {answer.periodLabel ? (
              <Badge variant="outline">{answer.periodLabel}</Badge>
            ) : null}
            {answer.timezone ? (
              <Badge variant="outline" className="gap-1">
                <Clock className="size-3" aria-hidden="true" />
                {answer.timezone}
              </Badge>
            ) : null}
          </div>

          <ChatSection
            title="What you're doing best"
            items={answer.strengths ?? []}
            icon={TrendingUp}
          />
          <ChatSection
            title="What's hurting your results"
            items={answer.weaknesses ?? []}
            icon={TrendingDown}
          />
          <ChatSection
            title="What to avoid"
            items={answer.avoid ?? []}
            icon={Ban}
          />
          <ChatSection
            title="What to focus on"
            items={answer.focus ?? []}
            icon={Target}
          />
          <ChatSection
            title="Instrument insights"
            items={answer.instruments ?? []}
            icon={BarChart3}
          />
          {(answer.evidence ?? []).length > 0 ? (
            <ChatSection
              title="Supporting evidence"
              items={answer.evidence ?? []}
            />
          ) : null}
          {(answer.limitations ?? []).length > 0 ? (
            <ChatSection
              title="Limitations"
              items={answer.limitations ?? []}
              icon={AlertTriangle}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="bg-muted-foreground/70 size-2 animate-bounce rounded-full"
          style={{ animationDelay: `${index * 150}ms` }}
        />
      ))}
    </div>
  );
}

type ChatTurn =
  | {
      id: string;
      role: "user";
      content: string;
    }
  | {
      id: string;
      role: "assistant";
      message: AiChatMessage;
      animate: boolean;
    }
  | {
      id: string;
      role: "loading";
    };

function historyToTurns(messages: AiChatMessage[]): ChatTurn[] {
  const sorted = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const turns: ChatTurn[] = [];

  for (const message of sorted) {
    turns.push({
      id: `${message.id}-user`,
      role: "user",
      content: message.question,
    });
    turns.push({
      id: message.id,
      role: "assistant",
      message,
      animate: false,
    });
  }

  return turns;
}

export function AiCoachChat({
  messages,
  isAsking,
  onAsk,
}: {
  messages: AiChatMessage[];
  isAsking: boolean;
  onAsk: (question: string) => Promise<AiChatMessage | null>;
}) {
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<ChatTurn[]>(() =>
    historyToTurns(messages),
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [turns, isAsking, scrollToBottom]);

  const hasMessages = turns.length > 0;

  async function handleSubmit() {
    const trimmed = input.trim();
    if (!trimmed || isAsking) return;

    const userTurnId = `user-${Date.now()}`;
    const loadingId = `loading-${Date.now()}`;

    setTurns((current) => [
      ...current,
      { id: userTurnId, role: "user", content: trimmed },
      { id: loadingId, role: "loading" },
    ]);
    setInput("");

    const response = await onAsk(trimmed);

    setTurns((current) => {
      const withoutLoading = current.filter((turn) => turn.id !== loadingId);

      if (!response) {
        return withoutLoading;
      }

      return [
        ...withoutLoading,
        {
          id: response.id,
          role: "assistant",
          message: response,
          animate: true,
        },
      ];
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  }

  const placeholder = useMemo(
    () =>
      "Ask about strengths, weaknesses, instruments, timing, or what to focus on…",
    [],
  );

  return (
    <div className="border-border bg-card flex h-[min(72vh,760px)] flex-col overflow-hidden rounded-2xl border shadow-sm">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        {!hasMessages && !isAsking ? (
          <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center text-center">
            <div className="bg-primary/10 text-primary mb-4 flex size-12 items-center justify-center rounded-full">
              <Bot className="size-6" />
            </div>
            <h3 className="text-lg font-medium">Ask My Journal</h3>
            <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">
              Chat with your trading coach. Answers use your selected account,
              time period, timezone, and instrument data.
            </p>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            {turns.map((turn) => {
              if (turn.role === "user") {
                return (
                  <div key={turn.id} className="flex justify-end">
                    <div className="bg-muted max-w-[85%] rounded-3xl px-4 py-3 text-[15px] leading-relaxed sm:max-w-[75%]">
                      {turn.content}
                    </div>
                  </div>
                );
              }

              if (turn.role === "loading") {
                return (
                  <div key={turn.id} className="flex gap-3">
                    <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full">
                      <Bot className="size-4" />
                    </div>
                    <div className="pt-1">
                      <TypingIndicator />
                    </div>
                  </div>
                );
              }

              return (
                <div key={turn.id} className="flex gap-3">
                  <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full">
                    <Bot className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <ChatAnswerDetails
                      answer={turn.message.answer}
                      animate={turn.animate}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-border border-t px-4 py-4 sm:px-6">
        <div className="bg-background mx-auto flex max-w-3xl items-end gap-2 rounded-[28px] border px-3 py-2 shadow-sm">
          <textarea
            rows={1}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isAsking}
            className="placeholder:text-muted-foreground max-h-40 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2.5 text-[15px] leading-relaxed outline-none"
          />
          <button
            type="button"
            disabled={isAsking || !input.trim()}
            onClick={() => void handleSubmit()}
            className={cn(
              "mb-0.5 flex size-9 shrink-0 items-center justify-center rounded-full transition-colors",
              input.trim() && !isAsking
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed",
            )}
            aria-label="Send message"
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
        <p className="text-muted-foreground mx-auto mt-2 max-w-3xl text-center text-xs">
          Enter to send · Shift+Enter for a new line
        </p>
      </div>
    </div>
  );
}
