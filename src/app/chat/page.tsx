"use client";

import { useState, useRef, useEffect } from "react";
import { AppNav } from "@/components/app-nav";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { LifeStage } from "@/lib/health-advisor";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STAGE_LABELS: Record<LifeStage, string> = {
  menstrual: "🌸 Menstrual",
  pregnancy: "🤰 Pregnancy",
  postpartum: "👶 Postpartum",
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState<LifeStage>("menstrual");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const starterQuestions: Record<LifeStage, string[]> = {
    menstrual: [
      "Why is my period late this month?",
      "What helps with strong menstrual cramps?",
      "When should I worry about heavy bleeding during my period?",
      "What cycle symptoms are normal before my period starts?",
    ],
    pregnancy: [
      "What can help with morning sickness safely?",
      "Which pregnancy symptoms need urgent medical care?",
      "What foods are best for healthy pregnancy nutrition?",
      "How can I tell if reduced baby movement is concerning?",
    ],
    postpartum: [
      "What recovery symptoms are normal after childbirth?",
      "How can I care for myself while breastfeeding?",
      "When should postpartum bleeding or pain be checked urgently?",
      "What are signs of postpartum depression that need support?",
    ],
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMessage: Message = { role: "user", content: text };
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInput("");
    setIsStreaming(true);

    // Add empty assistant placeholder to stream into
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/health-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage,
          history: updatedHistory.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok) {
        let message = `Request failed (${res.status})`;
        try {
          const errorData = await res.json();
          message = errorData?.error ?? errorData?.response ?? message;
        } catch {
          // ignore json parse error
        }

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: message };
          return updated;
        });
        setIsStreaming(false);
        return;
      }

      // JSON fallback (emergency fast-path or no API key)
      if (res.headers.get("content-type")?.includes("application/json")) {
        const data = await res.json();
        const reply = data.response ?? data.error ?? "No response.";
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: reply };
          return updated;
        });
        setIsStreaming(false);
        return;
      }

      // Stream SSE chunks from the AI provider
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;

          const jsonStr = trimmed.replace(/^data:\s*/, "");
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content ?? "";
            accumulated += delta;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: "assistant", content: accumulated };
              return updated;
            });
          } catch {
            // skip malformed chunks
          }
        }
      }

      if (buffer.trim().startsWith("data:")) {
        const jsonStr = buffer.trim().replace(/^data:\s*/, "");
        if (jsonStr && jsonStr !== "[DONE]") {
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content ?? "";
            if (delta) {
              accumulated += delta;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: accumulated };
                return updated;
              });
            }
          } catch {
            // skip malformed trailing chunk
          }
        }
      }

      if (!accumulated.trim()) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "No response from AI service. Check server logs and environment variables.",
          };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Network error. Please try again.",
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function chooseQuestion(question: string) {
    setInput(question);
    inputRef.current?.focus();
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--background)" }}>
      <AppNav />

      {/* Header */}
      <section
        className="mx-4 mt-4 overflow-hidden rounded-2xl p-5 text-white shadow-sm sm:mx-8"
        style={{ background: "linear-gradient(135deg, var(--brand-dark), var(--brand))" }}
      >
        <p className="text-2xl">💬</p>
        <h1 className="mt-1 text-xl font-bold">AI Chat Health Companion</h1>
        <p className="mt-0.5 text-xs text-pink-100">
          Powered by AI guidance · Educational support only — emergencies need urgent care
        </p>

        {/* Stage selector */}
        <div className="mt-3 flex flex-wrap gap-2">
          {(Object.keys(STAGE_LABELS) as LifeStage[]).map((s) => (
            <button
              key={s}
              onClick={() => setStage(s)}
              className="rounded-full px-3 py-1 text-xs font-semibold transition-all"
              style={{
                background: stage === s ? "white" : "rgba(255,255,255,0.2)",
                color: stage === s ? "var(--brand)" : "white",
              }}
            >
              {STAGE_LABELS[s]}
            </button>
          ))}
        </div>
      </section>

      {/* Message list */}
      <main className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-4 py-4 sm:px-8">
        {messages.length === 0 && (
          <div className="mt-12 rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-pink-50 p-6 text-sm shadow-sm">
            <div className="text-center text-zinc-400">
              <p className="text-4xl">🌸</p>
              <p className="mt-2 font-medium text-zinc-600">Choose a question or type your own</p>
              <p className="mt-1 text-xs text-zinc-500">
                Pick a starter below, edit it if you want, or ask a custom health question.
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {starterQuestions[stage].map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => chooseQuestion(question)}
                  className="rounded-2xl border border-rose-100 bg-white px-4 py-3 text-left text-sm text-zinc-700 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-50"
                >
                  <span className="block font-medium text-zinc-800">{question}</span>
                  <span className="mt-1 block text-xs text-rose-700">Tap to use this question</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "rounded-br-none bg-rose-500 text-white"
                    : "rounded-bl-none border border-zinc-200 bg-white text-zinc-800"
                }`}
              >
                {msg.role === "assistant" ? (
                  <>
                    {msg.content.includes("\u26a0\ufe0f") && (
                      <div className="mb-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                        🚨 Emergency Warning
                      </div>
                    )}
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-1">{children}</ol>,
                        strong: ({ children }) => <strong className="font-semibold text-zinc-900">{children}</strong>,
                        code: ({ children }) => <code className="rounded bg-zinc-100 px-1 text-xs">{children}</code>,
                      }}
                    >
                      {msg.content || "▋"}
                    </ReactMarkdown>
                  </>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
        </div>
        <div ref={bottomRef} />
      </main>

      {/* Input bar */}
      <div
        className="sticky bottom-0 border-t bg-white/90 px-4 py-3 backdrop-blur sm:px-8"
        style={{ borderColor: "rgba(107,39,55,0.1)" }}
      >
        <div className="mx-auto max-w-3xl">
          <div className="mb-3 flex flex-wrap gap-2">
            {starterQuestions[stage].map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => chooseQuestion(question)}
                disabled={isStreaming}
                className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {question}
              </button>
            ))}
          </div>

          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Choose a starter above or type your own question… (Enter to send, Shift+Enter for new line)"
              disabled={isStreaming}
              className="flex-1 resize-none rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:opacity-60"
            />
            <button
              onClick={sendMessage}
              disabled={isStreaming || !input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm transition-opacity disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, var(--brand-dark), var(--brand))" }}
              aria-label="Send"
            >
              {isStreaming ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path d="M3.105 2.289a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.896 28.896 0 0 0 15.293-7.154.75.75 0 0 0 0-1.115A28.897 28.897 0 0 0 3.105 2.289Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <p className="mt-1 text-center text-xs text-zinc-400">
          Educational guidance only · Not a substitute for professional medical advice
        </p>
      </div>
    </div>
  );
}


