"use client";

import { useMemo, useState } from "react";
import { AppNav } from "@/components/app-nav";
import { getPostpartumTips } from "@/lib/health-advisor";

export default function PostpartumPage() {
  const [postpartumWeeks, setPostpartumWeeks] = useState(3);
  const [moodScore, setMoodScore] = useState(6);
  const [breastfeeding, setBreastfeeding] = useState(true);

  const tips = useMemo(
    () => getPostpartumTips(postpartumWeeks, moodScore, breastfeeding),
    [postpartumWeeks, moodScore, breastfeeding],
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <AppNav />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
        <section className="overflow-hidden rounded-3xl p-6 text-white shadow-sm" style={{ background: "linear-gradient(135deg, var(--brand-dark), var(--brand))" }}>
          <p className="text-3xl">👶</p>
          <h1 className="mt-2 text-2xl font-bold">Postpartum Care Assistant</h1>
          <p className="mt-1 text-sm text-pink-100">Recovery, mental health, breastfeeding, sleep, and nutrition guidance.</p>
          <p className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs">
            ⚕️ Educational support only — reach professional care if symptoms worsen.
          </p>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="grid gap-4">
            <label className="text-sm font-medium text-zinc-700">
              Weeks after childbirth
              <input
                type="number"
                min={0}
                max={52}
                value={postpartumWeeks}
                onChange={(e) => setPostpartumWeeks(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </label>

            <label className="text-sm font-medium text-zinc-700">
              Mood score (1 very low — 10 excellent)
              <input
                type="range"
                min={1}
                max={10}
                value={moodScore}
                onChange={(e) => setMoodScore(Number(e.target.value))}
                className="mt-1 w-full"
              />
              <div className="mt-1 flex justify-between text-xs text-zinc-400">
                <span>Very low</span>
                <span className="font-medium text-rose-700">{moodScore} / 10</span>
                <span>Excellent</span>
              </div>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-900">
              <input
                type="checkbox"
                checked={breastfeeding}
                onChange={(e) => setBreastfeeding(e.target.checked)}
              />
              Currently breastfeeding
            </label>

            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-sm font-semibold text-rose-900">💜 Recovery guidance</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-rose-800">
                {tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
