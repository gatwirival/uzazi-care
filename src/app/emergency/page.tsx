"use client";

import { useMemo, useState } from "react";
import { AppNav } from "@/components/app-nav";
import { assessEmergencyRisk } from "@/lib/health-advisor";

const emergencySymptomOptions = [
  "Excessive bleeding",
  "Severe abdominal pain",
  "Fainting",
  "Chest pain",
  "High fever",
  "Seizure",
  "Thoughts of self-harm",
];

export default function EmergencyPage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const assessment = useMemo(() => assessEmergencyRisk(selectedSymptoms), [selectedSymptoms]);

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
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white shadow-sm">
          <p className="text-3xl">🚨</p>
          <h1 className="mt-2 text-2xl font-bold">Emergency Warning System</h1>
          <p className="mt-1 text-sm text-red-100">
            Select symptoms to detect high-risk warning signs and receive immediate recommendations.
          </p>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <p className="mb-4 text-sm font-semibold text-zinc-700">Which symptoms are you experiencing?</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {emergencySymptomOptions.map((symptom) => (
              <label
                key={symptom}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                  selectedSymptoms.includes(symptom)
                    ? "border-red-300 bg-red-50 text-red-900"
                    : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-red-200 hover:bg-red-50"
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

          <div
            className={`mt-5 rounded-xl border p-4 text-sm ${
              assessment.risk === "high"
                ? "border-red-300 bg-red-50 text-red-800"
                : "border-emerald-300 bg-emerald-50 text-emerald-800"
            }`}
          >
            <p className="text-base font-bold">
              {assessment.risk === "high" ? "🚨 HIGH RISK" : "✅ LOW RISK"}
            </p>
            <p className="mt-1">{assessment.recommendation}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
