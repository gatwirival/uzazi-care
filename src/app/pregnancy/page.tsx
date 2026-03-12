"use client";

import { useMemo, useState } from "react";
import { AppNav } from "@/components/app-nav";
import { getHospitalChecklist, getPregnancyWarnings, getPregnancyWeekInfo } from "@/lib/health-advisor";

export default function PregnancyPage() {
  const [pregnancyWeek, setPregnancyWeek] = useState(28);

  const pregnancyInfo = useMemo(() => getPregnancyWeekInfo(pregnancyWeek), [pregnancyWeek]);
  const warnings = useMemo(() => getPregnancyWarnings(), []);
  const checklist = useMemo(() => getHospitalChecklist(), []);

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <AppNav />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white shadow-sm">
          <p className="text-3xl">🤰</p>
          <h1 className="mt-2 text-2xl font-bold">Pregnancy & Childbirth Support</h1>
          <p className="mt-1 text-sm text-emerald-100">Weekly tracking, development updates, warning signs, and hospital prep.</p>
          <p className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs">
            ⚕️ Educational support only — contact a clinician for medical diagnosis.
          </p>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="grid gap-4">
            <label className="text-sm font-medium text-zinc-700">
              Current pregnancy week
              <input
                type="number"
                min={1}
                max={40}
                value={pregnancyWeek}
                onChange={(e) => setPregnancyWeek(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </label>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              <p>
                <span className="font-semibold">🌱 Week {pregnancyWeek} update:</span> {pregnancyInfo}
              </p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">⚠️ Warning signs</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-amber-800">
                {warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
              <p className="text-sm font-semibold text-teal-900">🏥 Hospital preparation checklist</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-teal-800">
                {checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
