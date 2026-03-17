"use client";

import { useEffect, useMemo, useState } from "react";
import { AppNav } from "@/components/app-nav";
import {
  getAppointmentSchedule,
  getHospitalChecklist,
  getMedicationSafetyCategories,
  getMentalHealthSupportForWeek,
  getNextAppointment,
  getPregnancyNutritionGuide,
  getPregnancyWarningSignsForWeek,
  getPregnancyWeekDetail,
} from "@/lib/health-advisor";

const PREGNANCY_STORAGE_KEY = "afya-pregnancy-session-v1";

type StoredPregnancyState = {
  week?: number;
  dueDate?: string;
  selectedSymptoms?: string[];
  symptomNotes?: string;
};

const symptomOptions = [
  "nausea",
  "heartburn",
  "fatigue",
  "back pain",
  "mild swelling feet",
  "sleep difficulty",
  "heavy bleeding",
  "severe abdominal pain",
  "severe headache",
  "vision changes",
  "sudden swelling face/hands",
  "reduced fetal movement",
  "fluid leakage",
  "regular contractions before 37 weeks",
  "high fever",
  "painful urination",
  "persistent vomiting",
  "chest pain or trouble breathing",
  "low mood or self-harm thoughts",
];

const warningMatcher: Record<string, RegExp> = {
  "heavy bleeding": /heavy vaginal bleeding/i,
  "severe abdominal pain": /severe, persistent abdominal pain/i,
  "severe headache": /severe headache/i,
  "vision changes": /blurred|double vision|flashes/i,
  "sudden swelling face/hands": /sudden severe swelling/i,
  "reduced fetal movement": /reduced or absent fetal movement|reduced fetal movement/i,
  "fluid leakage": /fluid leaking from vagina/i,
  "regular contractions before 37 weeks": /regular contractions before 37 weeks|pressure or cramping in the lower abdomen before week 37/i,
  "high fever": /high fever/i,
  "painful urination": /pain during urination/i,
  "persistent vomiting": /persistent vomiting/i,
  "chest pain or trouble breathing": /chest pain or difficulty breathing/i,
  "low mood or self-harm thoughts": /self-harm/i,
};

function readStoredPregnancyState(): StoredPregnancyState | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(PREGNANCY_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredPregnancyState;
  } catch {
    localStorage.removeItem(PREGNANCY_STORAGE_KEY);
    return null;
  }
}

function getTrimesterLabel(week: number): string {
  if (week <= 13) return "First trimester";
  if (week <= 27) return "Second trimester";
  return "Third trimester";
}

function getPregnancyEducation(week: number): { stage: string; learning: string[]; childbirthPrep: string[] } {
  if (week <= 13) {
    return {
      stage: "Early pregnancy (weeks 1–13)",
      learning: [
        "Your baby’s major organs are forming, so folic acid and prenatal visits are essential.",
        "Nausea, fatigue, and mood changes are common and usually improve over time.",
        "Avoid alcohol, smoking, and unapproved medications.",
      ],
      childbirthPrep: [
        "Choose your maternity clinic or provider.",
        "Start a pregnancy journal and list questions for each visit.",
      ],
    };
  }

  if (week <= 27) {
    return {
      stage: "Middle pregnancy (weeks 14–27)",
      learning: [
        "Fetal movement becomes more noticeable and anatomy scanning is usually done now.",
        "Nutrition and regular safe movement support healthy fetal growth and maternal wellbeing.",
        "Track symptoms and discuss any warning signs quickly.",
      ],
      childbirthPrep: [
        "Attend childbirth education classes.",
        "Discuss pain-management options and preferred birth setting.",
      ],
    };
  }

  return {
    stage: "Late pregnancy (weeks 28–40)",
    learning: [
      "Your baby gains weight rapidly and lung/brain maturity continues.",
      "Kick counting and regular antenatal reviews are especially important.",
      "It is normal to feel excited and anxious while preparing for birth.",
    ],
    childbirthPrep: [
      "Finalize your birth plan and hospital bag.",
      "Review true labour signs and transport plans.",
      "Plan immediate postpartum support for feeding, rest, and emotional health.",
    ],
  };
}

export default function PregnancyPage() {
  const [stored] = useState<StoredPregnancyState | null>(() => readStoredPregnancyState());
  const [pregnancyWeek, setPregnancyWeek] = useState(stored?.week ?? 28);
  const [dueDate, setDueDate] = useState(stored?.dueDate ?? "");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(stored?.selectedSymptoms ?? []);
  const [symptomNotes, setSymptomNotes] = useState(stored?.symptomNotes ?? "");
  const [question, setQuestion] = useState("");
  const [assistantReply, setAssistantReply] = useState("");
  const [assistantRisk, setAssistantRisk] = useState<"low" | "high">("low");
  const [isAsking, setIsAsking] = useState(false);

  const weekDetail = useMemo(() => getPregnancyWeekDetail(pregnancyWeek), [pregnancyWeek]);
  const nutritionGuide = useMemo(() => getPregnancyNutritionGuide(pregnancyWeek), [pregnancyWeek]);
  const warningSigns = useMemo(() => getPregnancyWarningSignsForWeek(pregnancyWeek), [pregnancyWeek]);
  const nextAppointment = useMemo(() => getNextAppointment(pregnancyWeek), [pregnancyWeek]);
  const appointmentSchedule = useMemo(() => getAppointmentSchedule(), []);
  const medicationSafety = useMemo(() => getMedicationSafetyCategories(), []);
  const hospitalChecklist = useMemo(() => getHospitalChecklist(), []);
  const mentalHealth = useMemo(() => getMentalHealthSupportForWeek(pregnancyWeek), [pregnancyWeek]);
  const education = useMemo(() => getPregnancyEducation(pregnancyWeek), [pregnancyWeek]);

  const matchedWarningSigns = useMemo(
    () =>
      warningSigns.filter((warning) =>
        selectedSymptoms.some((symptom) => {
          const matcher = warningMatcher[symptom];
          return matcher ? matcher.test(warning.sign) : false;
        }),
      ),
    [warningSigns, selectedSymptoms],
  );

  useEffect(() => {
    const payload: StoredPregnancyState = {
      week: pregnancyWeek,
      dueDate,
      selectedSymptoms,
      symptomNotes,
    };
    localStorage.setItem(PREGNANCY_STORAGE_KEY, JSON.stringify(payload));
  }, [pregnancyWeek, dueDate, selectedSymptoms, symptomNotes]);

  function toggleSymptom(symptom: string) {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((entry) => entry !== symptom));
      return;
    }
    setSelectedSymptoms([...selectedSymptoms, symptom]);
  }

  async function askPregnancyAssistant() {
    if (!question.trim()) return;

    setIsAsking(true);
    try {
      const response = await fetch("/api/health-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, stage: "pregnancy" }),
      });
      const payload = (await response.json()) as { response?: string; risk?: "low" | "high"; error?: string };
      setAssistantReply(payload.response ?? payload.error ?? "I could not process your question right now.");
      setAssistantRisk(payload.risk ?? "low");
    } catch {
      setAssistantReply("Network issue. Please try again.");
      setAssistantRisk("low");
    } finally {
      setIsAsking(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <AppNav />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white shadow-sm">
          <p className="text-3xl">🤰</p>
          <h1 className="mt-2 text-2xl font-bold">Pregnancy & Childbirth Support</h1>
          <p className="mt-1 text-sm text-emerald-100">
            Week-by-week support from early pregnancy to birth prep, built for first-time mothers and experienced parents.
          </p>
          <p className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs">
            ⚕️ Educational support only — contact a clinician for medical diagnosis.
          </p>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
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

            <label className="text-sm font-medium text-zinc-700">
              Estimated due date (optional)
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </label>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              <p className="font-semibold">🌱 Week {pregnancyWeek} development snapshot</p>
              <p className="mt-1">
                {getTrimesterLabel(pregnancyWeek)} · Baby size: {weekDetail.fetalSizeComparison} ({weekDetail.fetalSize})
              </p>
              <ul className="mt-2 list-disc pl-5">
                {weekDetail.fetalDevelopment.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-900">
              <p className="font-semibold">📅 Appointment reminder</p>
              {nextAppointment ? (
                <>
                  <p className="mt-1">
                    {nextAppointment.weeksRange}: {nextAppointment.title}
                  </p>
                  <ul className="mt-2 list-disc pl-5">
                    {nextAppointment.purpose.slice(0, 3).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="mt-1">No upcoming reminder found.</p>
              )}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-zinc-900">🩺 Symptom tracker + warning alerts</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {symptomOptions.map((symptom) => (
              <label
                key={symptom}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                  selectedSymptoms.includes(symptom)
                    ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                    : "border-zinc-200 bg-zinc-50 text-zinc-700"
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

          <label className="mt-4 block text-sm font-medium text-zinc-700">
            Notes for your next visit
            <textarea
              rows={3}
              value={symptomNotes}
              onChange={(e) => setSymptomNotes(e.target.value)}
              placeholder="Add details like timing, triggers, and what helps"
              className="mt-1 w-full rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </label>

          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">⚠️ Warning signs for your current stage</p>
            <ul className="mt-2 list-disc pl-5 text-sm text-amber-800">
              {warningSigns.map((warning) => (
                <li key={warning.sign}>{warning.sign}</li>
              ))}
            </ul>
          </div>

          {matchedWarningSigns.length > 0 && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
              <p className="font-semibold">🚨 These selected symptoms need urgent attention</p>
              <ul className="mt-2 list-disc pl-5">
                {matchedWarningSigns.map((warning) => (
                  <li key={warning.sign}>
                    {warning.sign} — {warning.action}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-zinc-900">🥗 Nutrition guidance</p>
            <p className="mt-1 text-sm text-zinc-600">Trimester {nutritionGuide.trimester} focus</p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-700">
              {nutritionGuide.keyNutrients.map((item) => (
                <li key={item.nutrient} className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2">
                  <span className="font-semibold">{item.nutrient}:</span> {item.why} ({item.sources})
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-zinc-700">
              <span className="font-semibold">Hydration:</span> {nutritionGuide.hydrationTip}
            </p>
            <p className="mt-1 text-sm text-zinc-700">
              <span className="font-semibold">Supplement note:</span> {nutritionGuide.supplementNote}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-zinc-900">🏃 Safe exercise recommendations</p>
            <ul className="mt-3 list-disc pl-5 text-sm text-zinc-700">
              {weekDetail.safeExercises.map((exercise) => (
                <li key={exercise}>{exercise}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm font-semibold text-zinc-900">Avoid these unless your clinician advises otherwise</p>
            <ul className="mt-2 list-disc pl-5 text-sm text-zinc-700">
              <li>Contact sports and fall-risk activities</li>
              <li>Overheating or high-intensity exhaustion</li>
              <li>Long periods lying flat on your back after mid-pregnancy</li>
            </ul>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-zinc-900">🧠 Mental health support</p>
            <p className="mt-2 text-sm text-zinc-700">{mentalHealth.tip}</p>
            <p className="mt-3 text-sm font-semibold text-zinc-900">Helpful strategies</p>
            <ul className="mt-2 list-disc pl-5 text-sm text-zinc-700">
              {mentalHealth.strategies.map((strategy) => (
                <li key={strategy}>{strategy}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm font-semibold text-rose-800">Seek urgent help if you notice</p>
            <ul className="mt-2 list-disc pl-5 text-sm text-rose-700">
              {mentalHealth.seekHelp.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-zinc-900">📚 Education + childbirth preparation</p>
            <p className="mt-2 text-sm text-zinc-700">{education.stage}</p>
            <ul className="mt-2 list-disc pl-5 text-sm text-zinc-700">
              {education.learning.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm font-semibold text-zinc-900">Birth preparation checklist</p>
            <ul className="mt-2 list-disc pl-5 text-sm text-zinc-700">
              {education.childbirthPrep.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-zinc-900">💊 Medication safety guidance</p>
          <div className="mt-3 grid gap-3 lg:grid-cols-3">
            {medicationSafety.map((group) => (
              <div
                key={group.category}
                className={`rounded-xl border p-4 text-sm ${
                  group.color === "green"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : group.color === "yellow"
                      ? "border-amber-200 bg-amber-50 text-amber-900"
                      : "border-rose-200 bg-rose-50 text-rose-900"
                }`}
              >
                <p className="font-semibold">{group.label}</p>
                <p className="mt-1">{group.description}</p>
                <ul className="mt-2 list-disc pl-5">
                  {group.examples.slice(0, 4).map((example) => (
                    <li key={example}>{example}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-zinc-900">🗓️ Antenatal schedule overview</p>
          <div className="mt-3 space-y-2 text-sm text-zinc-700">
            {appointmentSchedule.map((appointment) => (
              <div
                key={`${appointment.weeksRange}-${appointment.title}`}
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2"
              >
                <p className="font-medium">
                  {appointment.weeksRange} · {appointment.title}
                </p>
                <p className="mt-1 text-zinc-600">{appointment.purpose[0]}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-zinc-900">🏥 Hospital bag + birth day essentials</p>
          <ul className="mt-3 grid list-disc gap-2 pl-5 text-sm text-zinc-700 sm:grid-cols-2">
            {hospitalChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-zinc-900">💬 Pregnancy AI assistant</p>
          <p className="mt-1 text-sm text-zinc-600">
            Ask about symptoms, development, nutrition, exercise, medication, or labour signs. Urgent danger signs should
            always go to emergency care first.
          </p>

          <label className="mt-3 block text-sm font-medium text-zinc-700">
            Ask your question
            <textarea
              rows={4}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Example: I am 30 weeks and feel reduced movement today, what should I do?"
              className="mt-1 w-full rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </label>

          <button
            type="button"
            onClick={askPregnancyAssistant}
            disabled={isAsking}
            className="mt-3 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity disabled:opacity-60"
            style={{ background: "linear-gradient(90deg, #10b981, #0d9488)" }}
          >
            {isAsking ? "Analyzing..." : "Ask Pregnancy Assistant"}
          </button>

          {assistantReply && (
            <div
              className={`mt-3 rounded-xl border p-4 text-sm leading-relaxed ${
                assistantRisk === "high"
                  ? "border-rose-200 bg-rose-50 text-rose-800"
                  : "border-emerald-200 bg-emerald-50 text-emerald-900"
              }`}
            >
              <p className="mb-1 font-semibold">{assistantRisk === "high" ? "Urgent guidance" : "AI guidance"}</p>
              {assistantReply}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
