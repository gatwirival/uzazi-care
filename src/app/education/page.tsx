"use client";

import { useEffect, useState } from "react";
import { AppNav } from "@/components/app-nav";

const articles = [
  {
    title: "Menstrual health basics",
    emoji: "🩸",
    content:
      "Understanding your menstrual cycle is essential for good health. A typical cycle lasts 28 days but can range from 21-35 days. Your cycle has four phases: menstruation, follicular, ovulation, and luteal.\n\nDuring menstruation, the uterine lining sheds, lasting 3-7 days. Track your flow: light, moderate, or heavy. The follicular phase stimulates estrogen, preparing for ovulation. Ovulation occurs mid-cycle when the ovary releases an egg—this is your most fertile time.\n\nThe luteal phase prepares the uterus for pregnancy. If fertilization doesn't occur, hormone levels drop, triggering menstruation again.\n\nTips for menstrual health: use period tracking apps, maintain iron-rich nutrition, exercise regularly, manage stress, and consult your doctor if you experience severe pain, very heavy bleeding, or irregular cycles.",
  },
  {
    title: "Understanding pregnancy warning signs",
    emoji: "🤰",
    content:
      "While pregnancy can be exciting, it's crucial to recognize warning signs that require immediate medical attention.\n\nContact your healthcare provider immediately if you experience:\n• Vaginal bleeding or spotting\n• Severe abdominal or pelvic pain\n• Severe headaches\n• Vision changes or dizziness\n• Shortness of breath\n• Chest pain\n• Fluid leaking from the vagina\n• Severe or persistent vomiting\n• Inability to keep food or liquids down\n\nModerate concerns to discuss with your provider at your next appointment:\n• Persistent fatigue\n• Back pain\n• Swelling in hands or face\n• Weight gain exceeding normal pregnancy guidelines\n\nAlways trust your instincts. If something feels wrong during pregnancy, contact your healthcare provider. Early intervention can prevent serious complications. Keep regular prenatal appointments and maintain open communication with your care team.",
  },
  {
    title: "Women's mental health and support",
    emoji: "💜",
    content:
      "Women's mental health is just as important as physical health. Hormonal changes throughout life phases affect mood and emotional well-being.\n\nMenstrual-related mood changes: Some women experience premenstrual syndrome (PMS) or premenstrual dysphoric disorder (PMDD), characterized by mood swings, depression, anxiety, and irritability before menstruation.\n\nPregnancy and postpartum mood disorders: Pregnancy hormones and the stress of impending parenthood can trigger anxiety and depression. Postpartum depression (PPD) and postpartum anxiety are common and treatable.\n\nSupport strategies:\n• Talk to a mental health professional (counselor, therapist, psychiatrist)\n• Join support groups for women going through similar experiences\n• Practice stress-reduction techniques: meditation, yoga, deep breathing\n• Maintain social connections and don't isolate\n• Prioritize sleep and nutrition\n• Exercise regularly\n• Limit alcohol and caffeine\n\nRemember: seeking help is a sign of strength, not weakness. Mental health conditions are treatable, and you deserve support.",
  },
  {
    title: "Postpartum nutrition essentials",
    emoji: "🥗",
    content:
      "Postpartum nutrition is critical for recovery, energy, and breastfeeding success. You need more calories and nutrients now than during pregnancy.\n\nKey nutrients:\n• Protein (70-100g daily): supports tissue repair and healing. Include lean meat, fish, eggs, legumes, and dairy.\n• Iron (27mg daily): replenish blood loss. Eat red meat, spinach, fortified cereals.\n• Calcium (1000mg daily): for bone health. Dairy, fortified plant-based milk, leafy greens.\n• Vitamin D (600 IU daily): supports calcium absorption. Fatty fish, egg yolks, sunshine.\n• Omega-3 fatty acids: support brain health and mood. Salmon, walnuts, flaxseeds.\n• Fluids: drink plenty of water, especially if breastfeeding.\n\nMeals and snacks:\n• Eat regular meals and healthy snacks\n• Keep hydrated with water, herbal tea, and broths\n• Avoid restrictive dieting while breastfeeding\n• Wait until 6-8 weeks postpartum before major dietary changes\n\nConsider consulting a nutritionist for personalized guidance.",
  },
];

const guides = [
  {
    title: "Postpartum recovery checklist",
    emoji: "🍼",
    content:
      "First 24 hours:\n☐ Rest and bond with your baby\n☐ Manage pain with prescribed medications if needed\n☐ Empty bladder regularly\n☐ Start pelvic floor exercises\n☐ Practice good hygiene with perineal care\n☐ Begin light walking when ready\n\nWeek 1:\n☐ Gradually increase activity\n☐ Attend follow-up appointment with healthcare provider\n☐ Monitor for signs of infection (fever, unusual bleeding)\n☐ Continue pelvic floor exercises\n☐ Maintain good nutrition and hydration\n☐ Accept help from family and friends\n☐ Get as much sleep as possible\n\nWeeks 2-6:\n☐ Increase walking distance\n☐ Return to gentle stretching if cleared by doctor\n☐ Avoid heavy lifting and strenuous exercise\n☐ Complete 6-week postpartum check-up\n☐ Discuss contraception with your provider\n☐ Monitor for postpartum depression symptoms\n\nWeeks 6-12:\n☐ With doctor clearance, gradually return to normal exercise\n☐ Resume sexual activity if feeling ready (usually around week 6)\n☐ Address any persistent pain or discomfort\n☐ Plan follow-up mental health support if needed",
  },
  {
    title: "Birth preparedness guide",
    emoji: "🏥",
    content:
      "Prepare for labor and delivery by planning ahead:\n\nWhere to give birth:\n• Hospital: access to medical interventions and emergency care\n• Birth center: homelike setting with midwife care\n• Home birth: familiar environment with midwife support (requires careful planning)\n\nChoose your care team:\n• Obstetrician or midwife\n• Doula (optional but beneficial for support)\n• Labor and delivery nurse\n• Partner or family member to support you\n\nCreate a birth plan:\n• Your preferences for pain management\n• Preferred positions for labor\n• Preferences for interventions (episiotomy, induction, etc.)\n• Plans for immediate postpartum care\n• Breastfeeding goals\n\nPrepare for labor:\n• Take childbirth education classes\n• Practice breathing and relaxation techniques\n• Tour your hospital or birth center\n• Pack a hospital bag: comfortable clothes, toiletries, medical records\n• Arrange childcare for other children\n• Plan transportation to hospital/birth center\n\nMental preparation:\n• Read positive birth stories\n• Practice visualization of a healthy birth\n• Discuss fears and concerns with your healthcare provider\n• Build a supportive community\n\nHave a backup plan for emergency situations.",
  },
  {
    title: "Breastfeeding positioning and latch",
    emoji: "👶",
    content:
      "Proper latch is essential for successful breastfeeding and baby's comfort.\n\nCommon positions:\n1. Cradle hold: Baby's head rests in your forearm, facing your breast. Good for most mothers and babies.\n\n2. Cross-cradle hold: Use opposite arm to support baby's head. Good for smaller babies or latch problems.\n\n3. Football hold: Baby positioned at your side like a football. Great for C-section recovery or large-breasted women.\n\n4. Side-lying: Both you and baby lying on your sides. Perfect for night feeds and recovery.\n\nCorrect latch signs:\n• Baby's lips flare outward (not tucked in)\n• Baby's chin touching your breast\n• Mouth covers most of the areola (dark area around nipple)\n• Cheeks full and rounded during sucking\n• You feel pressure but no sharp pain\n• Baby's ears wiggle as they suck\n• Milk flows and baby's throat moves with swallowing\n\nCommon latch problems:\n• Shallow latch: Ask your baby to open wider, pull closer\n• Tongue tie: May require medical intervention\n• Inverted nipples: Use breast shells or nipple shields\n• Soreness: Practice correct positioning and latch\n\nIf you experience persistent pain or latch difficulties, consult a lactation consultant immediately.",
  },
  {
    title: "Newborn care essentials",
    emoji: "🌸",
    content:
      "Essential skills for caring for your newborn:\n\nFeeding:\n• Breastfeed on demand (8-12 times per day initially)\n• Formula feeding: follow preparation instructions carefully\n• Watch for hunger cues: rooting, hand-to-mouth, fussiness\n• Support baby's head and neck\n• Burp baby after feeding\n\nDiaper care:\n• Check diaper every 2-3 hours\n• Change immediately if wet or soiled\n• Wipe from front to back\n• Use fragrance-free products\n• Watch for diaper rash\n\nBathing:\n• Bathe after umbilical cord falls off\n• Use lukewarm water (around 37°C/98°F)\n• Keep face and ears clean with warm washcloth\n• Support head and neck securely\n\nSleep:\n• Place baby on back for sleep\n• Use a firm sleep surface (bassinet, crib)\n• Room share without bed sharing\n• Avoid pillows, blankets, and bumpers\n• Newborns sleep 16-17 hours daily\n\nHealth and safety:\n• Keep baby at safe temperature (warm but not hot)\n• Avoid smoking, alcohol, and drugs\n• Dress appropriately for room temperature\n• Install smoke and carbon monoxide detectors\n• Learn infant CPR\n• Attend all pediatric appointments\n• Vaccinate on schedule\n\nContact your pediatrician if baby has fever, unusual crying, difficulty feeding, or breathing problems.",
  },
];

type EducationItem = {
  title: string;
  emoji: string;
  content: string;
};

export default function EducationPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadedVideos, setUploadedVideos] = useState<Array<{ id: string; name: string; url: string }>>([]);
  const [selectedItem, setSelectedItem] = useState<EducationItem | null>(null);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const response = await fetch("/api/education/videos");
        if (!response.ok) return;

        const data = await response.json();
        const existingVideos = (data.videos || []).map(
          (video: { id: string; fileName: string; url: string }) => ({
            id: video.id,
            name: video.fileName,
            url: video.url,
          })
        );

        setUploadedVideos(existingVideos);
      } catch {
      }
    };

    loadVideos();
  }, []);

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles?.length) return;

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      Array.from(selectedFiles).forEach((file) => {
        formData.append("videos", file);
      });

      const response = await fetch("/api/education/videos", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      const newVideos = (data.uploads || []).map((item: { id: string; name: string; url: string }) => ({
        id: item.id,
        name: item.name,
        url: item.url,
      }));

      setUploadedVideos((prev) => [...newVideos, ...prev]);
      event.target.value = "";
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <AppNav />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
        <section className="overflow-hidden rounded-3xl p-6 text-white shadow-sm" style={{ background: "linear-gradient(135deg, var(--brand-dark), var(--brand))" }}>
          <p className="text-3xl">📚</p>
          <h1 className="mt-2 text-2xl font-bold">Health Education Library</h1>
          <p className="mt-1 text-sm text-pink-100">
            Articles and guides covering menstrual health, pregnancy, postpartum, and women&apos;s mental health.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="mb-3 text-lg font-semibold text-rose-900">Articles</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {articles.map((item) => (
              <button
                key={item.title}
                onClick={() => setSelectedItem(item)}
                className="flex cursor-pointer items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-900 transition-all hover:border-rose-400 hover:bg-rose-100"
              >
                <span className="text-2xl">{item.emoji}</span>
                <div className="text-left">
                  <span className="mb-1 inline-block rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-800">
                    Article
                  </span>
                  <p className="text-sm font-medium">{item.title}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="mb-3 text-lg font-semibold text-rose-900">Guides</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {guides.map((item) => (
              <button
                key={item.title}
                onClick={() => setSelectedItem(item)}
                className="flex cursor-pointer items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-900 transition-all hover:border-rose-400 hover:bg-rose-100"
              >
                <span className="text-2xl">{item.emoji}</span>
                <div className="text-left">
                  <span className="mb-1 inline-block rounded-full bg-pink-100 px-2 py-0.5 text-xs font-semibold text-pink-800">
                    Guide
                  </span>
                  <p className="text-sm font-medium">{item.title}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-rose-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-rose-900">Upload Videos</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Add educational videos for menstrual health, pregnancy, and postpartum support.
          </p>

          <div className="mt-4 rounded-xl border border-dashed border-rose-300 bg-rose-50 p-4">
            <label htmlFor="video-upload" className="block text-sm font-medium text-rose-800">
              Select video file(s)
            </label>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              multiple
              onChange={handleVideoUpload}
              disabled={uploading}
              className="mt-2 block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-rose-600 file:px-3 file:py-2 file:text-white hover:file:bg-rose-700"
            />
            <p className="mt-2 text-xs text-zinc-500">Supported formats: MP4, MOV, WebM · Max 100MB each</p>
            {uploading && <p className="mt-2 text-xs text-rose-700">Uploading video(s)…</p>}
            {uploadError && <p className="mt-2 text-xs text-red-700">{uploadError}</p>}
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-semibold text-rose-900">Uploaded videos</h3>
            {uploadedVideos.length === 0 ? (
              <p className="mt-1 text-xs text-zinc-500">No videos uploaded yet.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {uploadedVideos.map((video) => (
                  <li key={video.id} className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm">
                    <a href={video.url} target="_blank" rel="noreferrer" className="font-medium text-rose-800 hover:underline">
                      {video.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {selectedItem && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelectedItem(null)}>
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 flex items-center justify-between border-b border-rose-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedItem.emoji}</span>
                  <h2 className="text-2xl font-bold text-rose-900">{selectedItem.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="rounded-lg bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-800 transition-all hover:bg-rose-200"
                >
                  Close
                </button>
              </div>
              <div className="p-6">
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                  {selectedItem.content}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
