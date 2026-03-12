"use client";

import { useMemo, useState } from "react";
import { AppNav } from "@/components/app-nav";
import { getMenstrualAdvice, predictNextCycle } from "@/lib/health-advisor";

const menstrualSymptoms = ["severe cramps", "mood swings", "fatigue", "heavy bleeding"];

export default function MenstrualPage() {
  const [lastPeriod, setLastPeriod] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [painLevel, setPainLevel] = useState(4);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const nextCycle = useMemo(() => predictNextCycle(lastPeriod, cycleLength), [lastPeriod, cycleLength]);
  const advice = useMemo(() => getMenstrualAdvice(selectedSymptoms, painLevel), [selectedSymptoms, painLevel]);

  function toggleSymptom(symptom: string) {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((entry) => entry !== symptom));
      return;
    }
    setSelectedSymptoms([...selectedSymptoms, symptom]);
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <AppNav />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 to-pink-500 p-6 text-white shadow-sm">
          <p className="text-3xl">🩸</p>
          <h1 className="mt-2 text-2xl font-bold">AI Menstrual Assistant</h1>
          <p className="mt-1 text-sm text-pink-100">Track your cycle, symptoms, and get personalized guidance.</p>
          <p className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs">
            ⚕️ Educational support only. Seek urgent care for severe symptoms.
          </p>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="grid gap-4">
            <label className="text-sm font-medium text-zinc-700">
              Last period date
              <input
                type="date"
                value={lastPeriod}
                onChange={(e) => setLastPeriod(e.target.value)}
                className="mt-1 w-full rounded-xl border border-pink-200 bg-pink-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </label>

            <label className="text-sm font-medium text-zinc-700">
              Cycle length (days)
              <input
                type="number"
                min={21}
                max={40}
                value={cycleLength}
                onChange={(e) => setCycleLength(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-pink-200 bg-pink-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </label>

            <label className="text-sm font-medium text-zinc-700">
              Pain level (1–10)
              <input
                type="range"
                min={1}
                max={10}
                value={painLevel}
                onChange={(e) => setPainLevel(Number(e.target.value))}
                className="mt-1 w-full"
              />
              <div className="mt-1 flex justify-between text-xs text-zinc-400">
                <span>Mild</span>
                <span className="font-medium text-rose-600">{painLevel} / 10</span>
                <span>Severe</span>
              </div>
            </label>

            <div>
              <p className="text-sm font-medium text-zinc-700">Symptoms</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {menstrualSymptoms.map((symptom) => (
                  <label
                    key={symptom}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-all ${
                      selectedSymptoms.includes(symptom)
                        ? "border-rose-300 bg-rose-50 text-rose-900"
                        : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-rose-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSymptoms.includes(symptom)}
                      onChange={() => toggleSymptom(symptom)}
                    />
                    {symptom}
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-pink-200 bg-pink-50 p-4 text-sm text-pink-900">
              <p>
                <span className="font-semibold">📅 Predicted next cycle:</span>{" "}
                {nextCycle ?? "Add a last period date above"}
              </p>
            </div>

            <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
              <p className="text-sm font-semibold text-rose-900">💡 AI Advice</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-rose-800">
                {advice.advice.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-pink-100 bg-pink-50 p-4">
              <p className="text-sm font-semibold text-pink-900">🥦 Nutrition Recommendations</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-pink-800">
                {advice.nutrition.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>

            {advice.seekCare.length > 0 && (
              <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
                <p className="font-semibold">🚨 When to see a doctor</p>
                <ul className="mt-1 list-disc pl-5">
                  {advice.seekCare.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
