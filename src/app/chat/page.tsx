"use client";

import { useState } from "react";
import { AppNav } from "@/components/app-nav";
import type { LifeStage } from "@/lib/health-advisor";

export default function ChatPage() {
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatStage, setChatStage] = useState<LifeStage>("menstrual");
  const [chatReply, setChatReply] = useState("");
  const [chatRisk, setChatRisk] = useState<"low" | "high">("low");
  const [isAsking, setIsAsking] = useState(false);

  async function askHealthCompanion() {
    if (!chatQuestion.trim()) return;
    setIsAsking(true);
    try {
      const res = await fetch("/api/health-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: chatQuestion, stage: chatStage }),
      });
      const data = await res.json();
      setChatReply(data.response ?? data.error ?? "I could not process your question right now.");
      setChatRisk(data.risk ?? "low");
    } catch {
      setChatReply("Network issue. Please try again.");
      setChatRisk("low");
    } finally {
      setIsAsking(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <AppNav />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white shadow-sm">
          <p className="text-3xl">💬</p>
          <h1 className="mt-2 text-2xl font-bold">AI Chat Health Companion</h1>
          <p className="mt-1 text-sm text-blue-100">
            Ask questions like &ldquo;Why is my period late?&rdquo; or &ldquo;How do I breastfeed properly?&rdquo;
          </p>
          <p className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs">
            Educational support only — emergency symptoms need urgent care.
          </p>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="grid gap-4">
            <label className="text-sm font-medium text-zinc-700">
              Health stage
              <select
                value={chatStage}
                onChange={(e) => setChatStage(e.target.value as LifeStage)}
                className="mt-1 w-full rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="menstrual">Menstrual</option>
                <option value="pregnancy">Pregnancy</option>
                <option value="postpartum">Postpartum</option>
              </select>
            </label>

            <label className="text-sm font-medium text-zinc-700">
              Ask a health question
              <textarea
                rows={4}
                value={chatQuestion}
                onChange={(e) => setChatQuestion(e.target.value)}
                placeholder="Example: Is this pain normal during pregnancy?"
                className="mt-1 w-full rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>

            <button
              type="button"
              onClick={askHealthCompanion}
              disabled={isAsking}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity disabled:opacity-60"
              style={{ background: "linear-gradient(90deg, #3b82f6, #6366f1)" }}
            >
              {isAsking ? "Analyzing..." : "Ask AI Companion"}
            </button>

            {chatReply && (
              <div
                className={`rounded-xl border p-4 text-sm leading-relaxed ${
                  chatRisk === "high"
                    ? "border-rose-200 bg-rose-50 text-rose-800"
                    : "border-blue-200 bg-blue-50 text-blue-900"
                }`}
              >
                <p className="mb-1 font-semibold">
                  {chatRisk === "high" ? "Urgent" : "AI Response"}
                </p>
                {chatReply}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
