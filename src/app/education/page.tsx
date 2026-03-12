import { AppNav } from "@/components/app-nav";

const educationItems = [
  { title: "Menstrual health basics", type: "Article", emoji: "🩸", color: "border-rose-200 bg-rose-50 text-rose-900" },
  { title: "Understanding pregnancy warning signs", type: "Article", emoji: "🤰", color: "border-emerald-200 bg-emerald-50 text-emerald-900" },
  { title: "Postpartum recovery checklist", type: "Guide", emoji: "🍼", color: "border-violet-200 bg-violet-50 text-violet-900" },
  { title: "Breastfeeding positioning and latch", type: "Video", emoji: "🍼", color: "border-pink-200 bg-pink-50 text-pink-900" },
  { title: "Women's mental health and support", type: "Article", emoji: "💜", color: "border-purple-200 bg-purple-50 text-purple-900" },
  { title: "Newborn care essentials", type: "Video", emoji: "🌸", color: "border-teal-200 bg-teal-50 text-teal-900" },
];

const typeChip: Record<string, string> = {
  Article: "bg-blue-100 text-blue-800",
  Guide: "bg-amber-100 text-amber-800",
  Video: "bg-rose-100 text-rose-800",
};

export default function EducationPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <AppNav />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 to-yellow-400 p-6 text-white shadow-sm">
          <p className="text-3xl">📚</p>
          <h1 className="mt-2 text-2xl font-bold">Health Education Library</h1>
          <p className="mt-1 text-sm text-amber-100">
            Articles and guides covering menstrual health, pregnancy, postpartum, and women&apos;s mental health.
          </p>
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-2">
          {educationItems.map((item) => (
            <div key={item.title} className={`flex items-start gap-3 rounded-2xl border p-4 ${item.color}`}>
              <span className="text-2xl">{item.emoji}</span>
              <div>
                <span className={`mb-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${typeChip[item.type]}`}>
                  {item.type}
                </span>
                <p className="text-sm font-medium">{item.title}</p>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
