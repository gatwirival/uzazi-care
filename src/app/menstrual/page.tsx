"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { AppNav } from "@/components/app-nav";
import {
  analyzeMenstrualSymptomPatterns,
  buildMenstrualPrediction,
  getMenstrualAdvice,
  type MenstrualSymptomLogEntry,
} from "@/lib/health-advisor";

const menstrualSymptoms = ["severe cramps", "mood swings", "fatigue", "heavy bleeding"];
const trackableSymptoms = [
  "cramps",
  "headaches",
  "bloating",
  "acne",
  "fatigue",
  "mood swings",
  "breast tenderness",
  "nausea",
  "severe cramps",
  "heavy bleeding",
];

const MENSTRUAL_STORAGE_KEY = "afya-menstrual-tracker-v1";

type StoredMenstrualState = {
  periodStartDate?: string;
  periodEndDate?: string;
  cycleLength?: number;
  periodLength?: number;
  reminderDaysBefore?: number;
  painLevel?: number;
  selectedSymptoms?: string[];
  mood?: string;
  energy?: string;
  sexualActivity?: string;
  medication?: string;
  symptomLogDate?: string;
  symptomLogs?: MenstrualSymptomLogEntry[];
};

function readStoredMenstrualState(): StoredMenstrualState | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(MENSTRUAL_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredMenstrualState;
  } catch {
    localStorage.removeItem(MENSTRUAL_STORAGE_KEY);
    return null;
  }
}

function subscribeToClientSnapshot() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

const dayLabel = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function isInRange(dateISO: string, startISO: string, endISO: string): boolean {
  return dateISO >= startISO && dateISO <= endISO;
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getMonthDays(isoDate: string): { dateISO: string; day: number; empty?: boolean }[] {
  const base = new Date(isoDate);
  if (Number.isNaN(base.getTime())) return [];

  const year = base.getFullYear();
  const month = base.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = firstDay.getDay();

  const days: { dateISO: string; day: number; empty?: boolean }[] = [];
  for (let index = 0; index < leadingBlanks; index += 1) {
    days.push({ dateISO: `blank-${index}`, day: 0, empty: true });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    days.push({ dateISO: date.toISOString().slice(0, 10), day });
  }

  return days;
}

export default function MenstrualPage() {
  const isClient = useSyncExternalStore(subscribeToClientSnapshot, getClientSnapshot, getServerSnapshot);
  const todayISO = new Date().toISOString().slice(0, 10);
  const [storedState] = useState<StoredMenstrualState | null>(() => readStoredMenstrualState());

  const [periodStartDate, setPeriodStartDate] = useState(storedState?.periodStartDate ?? "");
  const [periodEndDate, setPeriodEndDate] = useState(storedState?.periodEndDate ?? "");
  const [cycleLength, setCycleLength] = useState(storedState?.cycleLength ?? 28);
  const [periodLength, setPeriodLength] = useState(storedState?.periodLength ?? 5);
  const [reminderDaysBefore, setReminderDaysBefore] = useState(storedState?.reminderDaysBefore ?? 2);
  const [painLevel, setPainLevel] = useState(storedState?.painLevel ?? 4);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(storedState?.selectedSymptoms ?? []);
  const [mood, setMood] = useState(storedState?.mood ?? "stable");
  const [energy, setEnergy] = useState(storedState?.energy ?? "moderate");
  const [sexualActivity, setSexualActivity] = useState(storedState?.sexualActivity ?? "not logged");
  const [medication, setMedication] = useState(storedState?.medication ?? "");
  const [symptomLogDate, setSymptomLogDate] = useState(storedState?.symptomLogDate ?? todayISO);
  const [symptomLogSelection, setSymptomLogSelection] = useState<string[]>([]);
  const [symptomLogs, setSymptomLogs] = useState<MenstrualSymptomLogEntry[]>(storedState?.symptomLogs ?? []);

  const predictions = useMemo(
    () =>
      buildMenstrualPrediction({
        lastPeriodStartISO: periodStartDate,
        cycleLength,
        periodLength,
        reminderDaysBefore,
      }),
    [periodStartDate, cycleLength, periodLength, reminderDaysBefore],
  );

  const advice = useMemo(() => getMenstrualAdvice(selectedSymptoms, painLevel), [selectedSymptoms, painLevel]);
  const calendarDays = useMemo(() => getMonthDays(predictions?.nextPeriodStart ?? ""), [predictions?.nextPeriodStart]);
  const symptomPatternInsights = useMemo(() => analyzeMenstrualSymptomPatterns(symptomLogs), [symptomLogs]);

  useEffect(() => {
    let active = true;

    async function loadSymptomLogsFromDatabase() {
      try {
        const response = await fetch("/api/symptom-logs", { cache: "no-store" });
        if (!response.ok) return;

        const payload = (await response.json()) as { logs?: MenstrualSymptomLogEntry[] };
        if (!active || !Array.isArray(payload.logs)) return;

        setSymptomLogs(payload.logs);
      } catch {}
    }

    loadSymptomLogsFromDatabase();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const payload = {
      periodStartDate,
      periodEndDate,
      cycleLength,
      periodLength,
      reminderDaysBefore,
      painLevel,
      selectedSymptoms,
      mood,
      energy,
      sexualActivity,
      medication,
      symptomLogDate,
      symptomLogs,
    };

    localStorage.setItem(MENSTRUAL_STORAGE_KEY, JSON.stringify(payload));
  }, [
    periodStartDate,
    periodEndDate,
    cycleLength,
    periodLength,
    reminderDaysBefore,
    painLevel,
    selectedSymptoms,
    mood,
    energy,
    sexualActivity,
    medication,
    symptomLogDate,
    symptomLogs,
  ]);

  function toggleSymptom(symptom: string) {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((entry) => entry !== symptom));
      return;
    }
    setSelectedSymptoms([...selectedSymptoms, symptom]);
  }

  function toggleTrackableSymptom(symptom: string) {
    if (symptomLogSelection.includes(symptom)) {
      setSymptomLogSelection(symptomLogSelection.filter((entry) => entry !== symptom));
      return;
    }
    setSymptomLogSelection([...symptomLogSelection, symptom]);
  }

  async function addSymptomLog() {
    if (!symptomLogDate || symptomLogSelection.length === 0) return;

    const nextEntry: MenstrualSymptomLogEntry = {
      dateISO: symptomLogDate,
      symptoms: [...symptomLogSelection].sort((left, right) => left.localeCompare(right)),
    };

    setSymptomLogs([nextEntry, ...symptomLogs]);
    setSymptomLogSelection([]);

    try {
      await fetch("/api/symptom-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dateISO: symptomLogDate,
          symptoms: nextEntry.symptoms,
          mood,
          energy,
          sexualActivity,
          medication,
        }),
      });
    } catch {}
  }

  if (!isClient) {
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
            <p className="text-sm text-zinc-600">Loading menstrual tracker...</p>
          </section>
        </main>
      </div>
    );
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
              Period start date
              <input
                type="date"
                value={periodStartDate}
                onChange={(e) => setPeriodStartDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-pink-200 bg-pink-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </label>

            <label className="text-sm font-medium text-zinc-700">
              Period end date
              <input
                type="date"
                value={periodEndDate}
                onChange={(e) => setPeriodEndDate(e.target.value)}
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
              Period length (days)
              <input
                type="number"
                min={2}
                max={10}
                value={periodLength}
                onChange={(e) => setPeriodLength(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-pink-200 bg-pink-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </label>

            <label className="text-sm font-medium text-zinc-700">
              Reminder days before next period
              <input
                type="number"
                min={1}
                max={10}
                value={reminderDaysBefore}
                onChange={(e) => setReminderDaysBefore(Number(e.target.value))}
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

            <div className="grid gap-3 rounded-xl border border-pink-200 bg-pink-50 p-4 text-sm text-pink-900 sm:grid-cols-2">
              <p>
                <span className="font-semibold">📅 Next period:</span>{" "}
                {predictions
                  ? `${formatDate(predictions.nextPeriodStart)} to ${formatDate(predictions.nextPeriodEnd)}`
                  : "Add period start date above"}
              </p>
              <p>
                <span className="font-semibold">🔁 Predicted cycle length:</span>{" "}
                {predictions ? `${predictions.predictedCycleLength} days` : "—"}
              </p>
              <p>
                <span className="font-semibold">🥚 Ovulation window:</span>{" "}
                {predictions
                  ? `${formatDate(predictions.ovulationWindowStart)} to ${formatDate(predictions.ovulationWindowEnd)}`
                  : "—"}
              </p>
              <p>
                <span className="font-semibold">🌱 Fertile days:</span>{" "}
                {predictions
                  ? `${formatDate(predictions.fertileDays[0])} to ${formatDate(predictions.fertileDays[predictions.fertileDays.length - 1])}`
                  : "—"}
              </p>
              <p>
                <span className="font-semibold">💗 PMS window:</span>{" "}
                {predictions ? `${formatDate(predictions.pmsStart)} to ${formatDate(predictions.pmsEnd)}` : "—"}
              </p>
              <p>
                <span className="font-semibold">⏰ Reminder:</span>{" "}
                {predictions ? formatDate(predictions.reminderDate) : "—"}
              </p>
            </div>

            {periodEndDate && periodStartDate && periodEndDate < periodStartDate && (
              <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
                Period end date should be on or after the period start date.
              </div>
            )}

            {predictions && (
              <div className="rounded-xl border border-pink-200 bg-white p-4">
                <p className="text-sm font-semibold text-pink-900">🗓️ Calendar visualization</p>
                <p className="mt-1 text-xs text-zinc-500">
                  Highlights shown for the month of your next predicted period.
                </p>

                <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-zinc-500">
                  {dayLabel.map((label) => (
                    <div key={label} className="py-1 font-semibold">
                      {label}
                    </div>
                  ))}

                  {calendarDays.map((entry) => {
                    if (entry.empty) {
                      return <div key={entry.dateISO} className="h-9 rounded-md bg-transparent" />;
                    }

                    const isPeriod = isInRange(entry.dateISO, predictions.nextPeriodStart, predictions.nextPeriodEnd);
                    const isOvulation = entry.dateISO === predictions.ovulationDate;
                    const isFertile = predictions.fertileDays.includes(entry.dateISO);
                    const isPms = isInRange(entry.dateISO, predictions.pmsStart, predictions.pmsEnd);

                    let style = "border-zinc-200 bg-white text-zinc-700";
                    if (isPeriod) style = "border-rose-300 bg-rose-100 text-rose-900";
                    else if (isOvulation) style = "border-fuchsia-300 bg-fuchsia-100 text-fuchsia-900";
                    else if (isFertile) style = "border-emerald-300 bg-emerald-100 text-emerald-900";
                    else if (isPms) style = "border-amber-300 bg-amber-100 text-amber-900";

                    return (
                      <div key={entry.dateISO} className={`h-9 rounded-md border pt-2 text-xs ${style}`}>
                        {entry.day}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-rose-300 bg-rose-100 px-2 py-1 text-rose-900">Period</span>
                  <span className="rounded-full border border-fuchsia-300 bg-fuchsia-100 px-2 py-1 text-fuchsia-900">
                    Ovulation
                  </span>
                  <span className="rounded-full border border-emerald-300 bg-emerald-100 px-2 py-1 text-emerald-900">
                    Fertile
                  </span>
                  <span className="rounded-full border border-amber-300 bg-amber-100 px-2 py-1 text-amber-900">PMS</span>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-pink-100 bg-pink-50 p-4">
              <p className="text-sm font-semibold text-pink-900">🧾 Optional tracking</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-medium text-zinc-700">
                  Mood
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-pink-200 bg-white px-3 py-2"
                  >
                    <option value="stable">Stable</option>
                    <option value="low">Low</option>
                    <option value="irritable">Irritable</option>
                    <option value="anxious">Anxious</option>
                  </select>
                </label>

                <label className="text-sm font-medium text-zinc-700">
                  Energy level
                  <select
                    value={energy}
                    onChange={(e) => setEnergy(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-pink-200 bg-white px-3 py-2"
                  >
                    <option value="high">High</option>
                    <option value="moderate">Moderate</option>
                    <option value="low">Low</option>
                  </select>
                </label>

                <label className="text-sm font-medium text-zinc-700">
                  Sexual activity
                  <select
                    value={sexualActivity}
                    onChange={(e) => setSexualActivity(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-pink-200 bg-white px-3 py-2"
                  >
                    <option value="not logged">Not logged</option>
                    <option value="protected">Protected</option>
                    <option value="unprotected">Unprotected</option>
                  </select>
                </label>

                <label className="text-sm font-medium text-zinc-700">
                  Medication use
                  <input
                    type="text"
                    value={medication}
                    onChange={(e) => setMedication(e.target.value)}
                    placeholder="e.g., ibuprofen 400mg"
                    className="mt-1 w-full rounded-xl border border-pink-200 bg-white px-3 py-2"
                  />
                </label>
              </div>

              <p className="mt-3 text-xs text-zinc-600">
                Logged: mood ({mood}), energy ({energy}), sexual activity ({sexualActivity})
                {medication ? `, medication (${medication})` : ""}.
              </p>
            </div>

            <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
              <p className="text-sm font-semibold text-rose-900">📝 Symptom log</p>
              <p className="mt-1 text-xs text-rose-800">
                Log symptoms over time to help AI identify patterns and suggest personalized care tips.
              </p>

              <label className="mt-3 block text-sm font-medium text-zinc-700">
                Log date
                <input
                  type="date"
                  value={symptomLogDate}
                  onChange={(e) => setSymptomLogDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-3 py-2"
                />
              </label>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {trackableSymptoms.map((symptom) => (
                  <label
                    key={symptom}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-all ${
                      symptomLogSelection.includes(symptom)
                        ? "border-rose-300 bg-rose-100 text-rose-900"
                        : "border-rose-200 bg-white text-zinc-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={symptomLogSelection.includes(symptom)}
                      onChange={() => toggleTrackableSymptom(symptom)}
                    />
                    {symptom}
                  </label>
                ))}
              </div>

              <button
                type="button"
                onClick={addSymptomLog}
                className="mt-3 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Add symptom log
              </button>

              <div className="mt-4 rounded-xl border border-rose-200 bg-white p-3">
                <p className="text-sm font-semibold text-rose-900">Recent logs</p>
                {symptomLogs.length === 0 ? (
                  <p className="mt-2 text-xs text-zinc-600">No symptom entries yet.</p>
                ) : (
                  <ul className="mt-2 space-y-2 text-sm text-zinc-700">
                    {symptomLogs.slice(0, 6).map((entry, index) => (
                      <li key={`${entry.dateISO}-${index}`} className="rounded-lg border border-zinc-200 px-3 py-2">
                        <p className="font-medium text-zinc-800">{formatDate(entry.dateISO)}</p>
                        <p className="text-xs text-zinc-600">{entry.symptoms.join(", ")}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-pink-100 bg-pink-50 p-4">
              <p className="text-sm font-semibold text-pink-900">🤖 AI symptom pattern insights</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-pink-800">
                {symptomPatternInsights.patternNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>

              {symptomPatternInsights.frequentSymptoms.length > 0 && (
                <p className="mt-2 text-sm text-pink-900">
                  <span className="font-semibold">Frequent symptoms:</span>{" "}
                  {symptomPatternInsights.frequentSymptoms.join(", ")}
                </p>
              )}

              <p className="mt-3 text-sm font-semibold text-pink-900">Care tips</p>
              <ul className="mt-1 list-disc pl-5 text-sm text-pink-800">
                {symptomPatternInsights.careTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>

              {symptomPatternInsights.seekCare.length > 0 && (
                <div className="mt-3 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
                  <p className="font-semibold">Care escalation</p>
                  <ul className="mt-1 list-disc pl-5">
                    {symptomPatternInsights.seekCare.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
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
