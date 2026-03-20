import Link from "next/link";
import { AppNav } from "@/components/app-nav";

const pages = [
  {
    href: "/menstrual",
    emoji: "🩸",
    title: "AI Menstrual Assistant",
    description: "Period tracking, cycle prediction, symptom logging, and PMS guidance.",
    color: "from-rose-500 to-pink-500",
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
  {
    href: "/pregnancy",
    emoji: "🤰",
    title: "Pregnancy & Childbirth Support",
    description: "Weekly development updates, warning signs, and hospital checklist.",
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    href: "/postpartum",
    emoji: "👶",
    title: "Postpartum Care Assistant",
    description: "Recovery tips, breastfeeding support, and mood check guidance.",
    color: "from-violet-500 to-purple-500",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  {
    href: "/chat",
    emoji: "💬",
    title: "AI Chat Health Companion",
    description: "Ask health questions and receive stage-based, safety-focused guidance.",
    color: "from-blue-500 to-indigo-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    href: "/emergency",
    emoji: "🚨",
    title: "Emergency Warning System",
    description: "Detect high-risk symptoms and get immediate care advice.",
    color: "from-red-500 to-orange-500",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  {
    href: "/education",
    emoji: "📚",
    title: "Health Education Library",
    description: "Articles and guides on menstrual, pregnancy, postpartum, and mental health.",
    color: "from-amber-500 to-yellow-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <AppNav />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
        {/* Hero */}
        <section
          className="mb-8 overflow-hidden rounded-3xl p-8 text-white shadow-lg"
          style={{ background: "linear-gradient(135deg, var(--brand-dark) 0%, var(--brand) 60%, #e06fa0 100%)" }}
        >
          <p className="text-4xl">🌸</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">Uzazi Care</h1>
          <p className="mt-2 max-w-xl text-pink-100">
            Personalized AI-powered support for women — covering menstrual health, pregnancy,
            postpartum recovery, emergency guidance, and education.
          </p>
          <p className="mt-4 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
            ⚕️ Educational support only — seek immediate care for emergencies
          </p>
          <div className="mt-5">
            <Link
              href="/auth"
              className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-pink-700 transition hover:bg-pink-50"
            >
              Provider access →
            </Link>
          </div>
        </section>

        {/* Feature cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className={`group flex flex-col gap-3 rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-md ${page.bg} ${page.border}`}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-2xl text-white shadow-sm ${page.color}`}
              >
                {page.emoji}
              </div>
              <div>
                <h2 className="font-semibold text-zinc-900">{page.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-zinc-600">{page.description}</p>
              </div>
              <span className="mt-auto text-xs font-medium" style={{ color: "var(--brand)" }}>
                Open →
              </span>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
