"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAnalytics } from "@/lib/use-analytics";
import { Button } from "@/components/ui/button";
import { Sparkles, Send, MessageSquare, Bot, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { UpgradeModal } from "@/components/upgrade-modal";
import { toast } from "sonner";

interface ChatMessage { role: "user" | "assistant"; content: string; }

const STARTER_QUESTIONS = [
  "Who owes me the most money?",
  "What was my best revenue month?",
  "Which client pays the slowest?",
  "How much have I earned this year?",
  "Are any invoices dangerously overdue?",
];

export default function AIPage() {
  const { track } = useAnalytics();
  const aiUsage           = useQuery(api.users.getAiUsage);
  const checkAndIncrement = useMutation(api.users.checkAndIncrementAiQuery);
  const askQuestion       = useAction(api.ai.askQuestion);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput]       = useState("");
  const [chatLoading, setChatLoading]   = useState(false);
  const [upgradeOpen, setUpgradeOpen]   = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const isPro          = aiUsage?.isPro ?? false;
  const queriesUsed    = aiUsage?.used ?? 0;
  const monthlyLimit   = aiUsage?.limit ?? 10;
  const limitReached   = !isPro && queriesUsed >= monthlyLimit;

  async function handleAsk() {
    const q = chatInput.trim();
    if (!q || chatLoading || limitReached) return;

    const result = await checkAndIncrement({}).catch(() => null);
    if (result && !result.allowed) {
      toast.error(`You've used all ${monthlyLimit} free AI queries this month. Upgrade to Pro for unlimited access.`);
      return;
    }

    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: q }]);
    setChatLoading(true);
    try {
      const answer = await askQuestion({ question: q }) as string;
      track("ai_query", { question_length: q.length, isPro });
      setChatMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't answer that right now. Please try again." },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col" style={{ height: "calc(100vh - 100px)" }}>

      {/* Header */}
      <div className="flex items-start justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-500" />
            AI Assistant
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Ask anything about your invoices, clients, and revenue
          </p>
        </div>
        {aiUsage === undefined ? (
          <div className="h-7 w-36 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ) : !isPro ? (
          <div className={`text-xs font-medium px-3 py-1.5 rounded-full border ${
            limitReached
              ? "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800"
              : "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800"
          }`}>
            {limitReached ? `${monthlyLimit}/${monthlyLimit} queries used this month` : `${queriesUsed}/${monthlyLimit} queries this month`}
          </div>
        ) : (
          <div className="text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Unlimited queries
          </div>
        )}
      </div>

      {/* Chat window */}
      <div className="flex flex-col flex-1 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/60 shrink-0">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-violet-500" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Invoiceser AI</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          {chatMessages.length > 0 && (
            <button
              onClick={() => setChatMessages([])}
              className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />New chat
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {aiUsage === undefined ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <Skeleton className="h-16 w-16 rounded-2xl" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-72" />
              <div className="grid grid-cols-1 gap-2 w-full max-w-md mt-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-11 w-full rounded-xl" />)}
              </div>
            </div>
          ) : chatMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800 flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-violet-400" />
              </div>
              <p className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">
                Ask me anything about your business
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
                I have access to all your invoice and client data. Try one of these:
              </p>
              <div className="grid grid-cols-1 gap-2 w-full max-w-md">
                {STARTER_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => setChatInput(q)}
                    className="text-left text-sm text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-xl px-4 py-2.5 transition-colors font-medium"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0 mr-2 mt-0.5 border border-violet-200 dark:border-violet-700">
                      <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gray-900 dark:bg-blue-600 text-white rounded-br-sm"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0 mr-2 mt-0.5 border border-violet-200 dark:border-violet-700">
                    <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900 shrink-0">
          {limitReached && !isPro ? (
            <div className="flex items-center justify-between bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800 rounded-xl px-4 py-3">
              <div>
                <p className="text-sm text-violet-700 dark:text-violet-400 font-medium">
                  Monthly limit reached ({monthlyLimit} queries/month on free plan)
                </p>
                <p className="text-xs text-violet-500 dark:text-violet-500 mt-0.5">Limit resets at the start of next month</p>
              </div>
              <Button size="sm" className="bg-violet-600 hover:bg-violet-700 gap-1.5 h-8 text-xs ml-4 shrink-0" onClick={() => setUpgradeOpen(true)}>
                <Sparkles className="w-3 h-3" />Upgrade to Pro
              </Button>
              <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
            </div>
          ) : (
            <form className="flex items-center gap-3" onSubmit={(e) => { e.preventDefault(); handleAsk(); }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about your invoices, clients, or revenue…"
                disabled={chatLoading}
                className="flex-1 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-800 focus:border-violet-300 dark:focus:border-violet-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-50 transition"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || chatLoading}
                className="p-2.5 rounded-xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
