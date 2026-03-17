export type LifeStage = "menstrual" | "pregnancy" | "postpartum";

export type AdviceResult = {
  advice: string[];
  nutrition: string[];
  seekCare: string[];
};

export type PregnancyWeekDetail = {
  week: number;
  trimester: 1 | 2 | 3;
  fetalSize: string;
  fetalSizeComparison: string;
  fetalDevelopment: string[];
  commonSymptoms: string[];
  motherChanges: string[];
  nutritionFocus: string[];
  safeExercises: string[];
  appointmentTips: string[];
  mentalHealthTip: string;
};

export type PregnancyNutritionGuide = {
  trimester: 1 | 2 | 3;
  keyNutrients: { nutrient: string; sources: string; why: string }[];
  foodsToAvoid: string[];
  hydrationTip: string;
  supplementNote: string;
};

export type PregnancyWarningSign = {
  trimester: "all" | 1 | 2 | 3;
  sign: string;
  urgency: "urgent" | "soon" | "monitor";
  action: string;
};

export type MedicationSafetyCategory = {
  category: string;
  label: string;
  description: string;
  examples: string[];
  color: "green" | "yellow" | "red";
};

export type PregnancyAppointment = {
  weeksRange: string;
  title: string;
  purpose: string[];
};

export type PregnancySymptomLog = {
  dateISO: string;
  week: number;
  symptoms: string[];
  notes: string;
};

export type MenstrualPredictionInput = {
  lastPeriodStartISO: string;
  cycleLength: number;
  periodLength: number;
  reminderDaysBefore: number;
};

export type MenstrualPrediction = {
  nextPeriodStart: string;
  nextPeriodEnd: string;
  predictedCycleLength: number;
  ovulationDate: string;
  ovulationWindowStart: string;
  ovulationWindowEnd: string;
  fertileDays: string[];
  pmsStart: string;
  pmsEnd: string;
  reminderDate: string;
};

export type MenstrualSymptomLogEntry = {
  dateISO: string;
  symptoms: string[];
};

export type MenstrualSymptomPatternAnalysis = {
  frequentSymptoms: string[];
  patternNotes: string[];
  careTips: string[];
  seekCare: string[];
};

// ─── Pregnancy week detail data (representative weeks; adjacent weeks inherit nearest) ───
const pregnancyWeekDetails: Record<number, PregnancyWeekDetail> = {
  4: {
    week: 4, trimester: 1,
    fetalSize: "0.2 cm", fetalSizeComparison: "poppy seed",
    fetalDevelopment: ["Implantation complete", "Neural tube forming", "Heart cells beginning to develop"],
    commonSymptoms: ["Implantation spotting", "Mild cramping", "Breast tenderness", "Fatigue"],
    motherChanges: ["hCG hormone rising rapidly", "Uterine lining thickening"],
    nutritionFocus: ["Folic acid 400–800 mcg daily", "Iron-rich foods", "Avoid alcohol and smoking"],
    safeExercises: ["Walking", "Gentle yoga", "Swimming"],
    appointmentTips: ["Schedule first prenatal appointment", "Confirm pregnancy with clinician"],
    mentalHealthTip: "It's normal to feel a mix of excitement and anxiety. Talk to your partner or a trusted friend.",
  },
  8: {
    week: 8, trimester: 1,
    fetalSize: "1.6 cm", fetalSizeComparison: "kidney bean",
    fetalDevelopment: ["Heart beating ~150 bpm", "Major organs forming", "Hands and feet forming", "Eyelids forming"],
    commonSymptoms: ["Morning sickness", "Food aversions", "Fatigue", "Frequent urination", "Bloating"],
    motherChanges: ["Uterus size of an orange", "Breasts enlarging", "Increased blood volume"],
    nutritionFocus: ["Small frequent meals for nausea", "Ginger tea for morning sickness", "B6-rich foods (bananas, avocado)", "Folic acid continues"],
    safeExercises: ["Walking 20–30 min", "Prenatal yoga", "Light swimming"],
    appointmentTips: ["First prenatal visit: blood tests, blood pressure, due date confirmation", "Discuss medications with clinician"],
    mentalHealthTip: "Morning sickness can be exhausting. Rest when needed and ask for practical help at home.",
  },
  12: {
    week: 12, trimester: 1,
    fetalSize: "5.4 cm", fetalSizeComparison: "lime",
    fetalDevelopment: ["All essential organs formed", "Fingers and toes distinct", "Reflexes developing", "Vocal cords forming"],
    commonSymptoms: ["Nausea improving for many", "Visible veins on breasts", "Constipation", "Mood swings"],
    motherChanges: ["Uterus moves above pubic bone", "Waistline expanding", "Energy may pick up"],
    nutritionFocus: ["Calcium (dairy, leafy greens)", "Fibre for constipation", "Continue prenatal vitamins", "Safe fish 2x/week"],
    safeExercises: ["Brisk walking", "Prenatal yoga", "Light resistance training", "Swimming"],
    appointmentTips: ["First trimester screening (nuchal translucency scan)", "NIPT blood test if recommended", "Discuss genetic screening"],
    mentalHealthTip: "The end of the first trimester is a milestone. Many couples share news with family now.",
  },
  16: {
    week: 16, trimester: 2,
    fetalSize: "11.6 cm", fetalSizeComparison: "avocado",
    fetalDevelopment: ["Bones hardening", "Facial muscles active", "May start to hear sounds", "Limb movements increasing"],
    commonSymptoms: ["Feeling more energetic", "Round ligament pain", "Skin changes (glow or darkening)", "Nasal congestion"],
    motherChanges: ["Baby bump becoming visible", "Increased appetite", "Possible back discomfort"],
    nutritionFocus: ["Omega-3 fatty acids (salmon, walnuts)", "Iron to support increased blood volume", "Vitamin D (sunlight, fortified foods)"],
    safeExercises: ["Prenatal Pilates", "Swimming", "Walking", "Low-impact aerobics"],
    appointmentTips: ["Anatomy scan usually scheduled around 18–20 weeks", "Quad screen blood test option"],
    mentalHealthTip: "The second trimester 'honeymoon phase' often brings renewed energy. Enjoy connecting with your bump.",
  },
  20: {
    week: 20, trimester: 2,
    fetalSize: "16.4 cm", fetalSizeComparison: "banana",
    fetalDevelopment: ["Baby can swallow", "Sleep/wake cycles forming", "Hearing well-developed", "Vernix caseosa coating skin"],
    commonSymptoms: ["Fetal movement (quickening)", "Heartburn", "Leg cramps", "Mild swelling in feet"],
    motherChanges: ["Uterus at belly button level", "Weight gain progressing", "Linea nigra appearing"],
    nutritionFocus: ["Protein 70–80g/day", "Calcium 1000 mg/day", "Avoid high-mercury fish", "Whole grains and fibre"],
    safeExercises: ["Water aerobics", "Pregnancy yoga", "Walking", "Stationary cycling"],
    appointmentTips: ["Mid-pregnancy anatomy scan (20-week scan)", "Check placenta position", "Discuss birth plan early"],
    mentalHealthTip: "Feeling your baby move for the first time is powerful. Share the moment with a loved one.",
  },
  24: {
    week: 24, trimester: 2,
    fetalSize: "30 cm", fetalSizeComparison: "ear of corn",
    fetalDevelopment: ["Lungs developing surfactant", "Brain growing rapidly", "Taste buds forming", "Baby viable if born now (with intensive care)"],
    commonSymptoms: ["Braxton Hicks contractions", "Back pain", "Swollen ankles", "Shortness of breath"],
    motherChanges: ["Fundal height measurable", "Possible carpal tunnel symptoms", "Stretch marks may appear"],
    nutritionFocus: ["Magnesium-rich foods (nuts, seeds, beans)", "Hydration 8–10 glasses/day", "Iron-rich diet + vitamin C for absorption"],
    safeExercises: ["Swimming (excellent for joint relief)", "Prenatal yoga", "Walking", "Pelvic floor exercises"],
    appointmentTips: ["Glucose challenge test (gestational diabetes screening)", "Anaemia blood test", "Tdap vaccine discussion"],
    mentalHealthTip: "Braxton Hicks can feel alarming. Understanding the difference from real labour contractions reduces anxiety.",
  },
  28: {
    week: 28, trimester: 3,
    fetalSize: "37.6 cm", fetalSizeComparison: "eggplant",
    fetalDevelopment: ["Eyes can open and close", "Brain forming billions of neurons", "Lungs maturing", "Baby gaining fat layers"],
    commonSymptoms: ["Frequent urination returns", "Difficulty sleeping", "Pelvic pressure", "Heartburn worsening"],
    motherChanges: ["Third trimester begins", "Faster weight gain", "Colostrum may leak from breasts"],
    nutritionFocus: ["Calcium and vitamin K for bone development", "DHA omega-3 for brain development", "Smaller meals more often for heartburn"],
    safeExercises: ["Gentle walking", "Prenatal yoga", "Swimming", "Pelvic floor/Kegel exercises"],
    appointmentTips: ["Rhesus factor injection (if Rh negative)", "GDM follow-up if applicable", "Start counting fetal movements daily"],
    mentalHealthTip: "Start preparing your birth plan. Taking a childbirth class now can build confidence.",
  },
  32: {
    week: 32, trimester: 3,
    fetalSize: "42.4 cm", fetalSizeComparison: "squash",
    fetalDevelopment: ["Bones fully formed but still soft", "Nails and hair growing", "Immune system developing", "Gaining 500g/week"],
    commonSymptoms: ["Shortness of breath", "Haemorrhoids", "Waddling gait", "Insomnia", "Increased back pain"],
    motherChanges: ["Uterus pushes against diaphragm", "Frequent Braxton Hicks", "Increased vaginal discharge"],
    nutritionFocus: ["Iron and vitamin C pairing", "Prune juice for constipation", "Avoid large meals before bed for heartburn"],
    safeExercises: ["Slow walking", "Prenatal yoga", "Gentle stretching", "Kegel exercises"],
    appointmentTips: ["Discuss birth preferences with midwife/doctor", "Consider hospital bag preparation", "Group B Strep test approaching"],
    mentalHealthTip: "Nesting instincts are common now. Organising the nursery can channel anxiety into positive action.",
  },
  36: {
    week: 36, trimester: 3,
    fetalSize: "47.4 cm", fetalSizeComparison: "romaine lettuce",
    fetalDevelopment: ["Baby dropping into pelvis", "Lungs almost fully mature", "Gaining 28g/day", "Skull bones remain unfused for birth"],
    commonSymptoms: ["Pelvic lightning pains", "Easier breathing as baby drops", "Increased discharge", "Frequent urination extreme"],
    motherChanges: ["Engagement (lightening)", "More frequent contractions", "Cervix starting to change"],
    nutritionFocus: ["Dates may support cervical ripening (discuss with clinician)", "Continue iron and folate", "Easy digestible foods"],
    safeExercises: ["Short gentle walks", "Pelvic tilts", "Kegel exercises", "Light stretching"],
    appointmentTips: ["Weekly appointments begin", "Group B Strep swab (35–37 weeks)", "Review birth plan with care team", "Pack hospital bag"],
    mentalHealthTip: "Birth anxiety is normal. Practice breathing techniques and visualisation daily.",
  },
  40: {
    week: 40, trimester: 3,
    fetalSize: "50.7 cm", fetalSizeComparison: "watermelon",
    fetalDevelopment: ["Fully developed and ready for birth", "Lungs mature", "Meconium present in intestines", "Immune system boosted by maternal antibodies"],
    commonSymptoms: ["Strong Braxton Hicks or real labour", "Pelvic pressure and pain", "Water may break", "Bloody show possible"],
    motherChanges: ["Full term reached", "Cervix dilating and effacing", "Hormone surge (oxytocin, prostaglandins)"],
    nutritionFocus: ["Light meals for easy digestion", "Stay well hydrated", "Avoid lying flat — use left-side positioning"],
    safeExercises: ["Short walks to encourage labour", "Pelvic circles", "Breathing and relaxation techniques"],
    appointmentTips: ["Discuss induction plan if past 40 weeks", "Monitor for labour signs", "Have transport plan ready"],
    mentalHealthTip: "The waiting can be the hardest part. Trust your body and your care team — you are ready.",
  },
};

// ─── Pregnancy nutrition guides by trimester ───
const pregnancyNutritionGuides: Record<1 | 2 | 3, PregnancyNutritionGuide> = {
  1: {
    trimester: 1,
    keyNutrients: [
      { nutrient: "Folic Acid", sources: "Leafy greens, fortified cereals, legumes", why: "Prevents neural tube defects in the first 28 days" },
      { nutrient: "Iron", sources: "Red meat, beans, spinach, tofu", why: "Supports increased blood volume and prevents anaemia" },
      { nutrient: "Vitamin B6", sources: "Bananas, avocado, chicken, potatoes", why: "Helps reduce morning sickness" },
      { nutrient: "Iodine", sources: "Seafood, dairy, iodised salt", why: "Essential for baby's brain and thyroid development" },
    ],
    foodsToAvoid: ["Raw or undercooked meat and eggs", "High-mercury fish (shark, swordfish, tilefish)", "Unpasteurised dairy", "Alcohol", "Excess caffeine (limit to <200 mg/day)", "Raw sprouts"],
    hydrationTip: "Aim for 8–10 glasses of water daily. Herbal teas like ginger can soothe nausea.",
    supplementNote: "Start a prenatal vitamin with at least 400 mcg folic acid before or as soon as you know you are pregnant.",
  },
  2: {
    trimester: 2,
    keyNutrients: [
      { nutrient: "Calcium", sources: "Dairy, fortified plant milks, broccoli, almonds", why: "Builds baby's bones and teeth; protects your bone density" },
      { nutrient: "Omega-3 DHA", sources: "Salmon, sardines, walnuts, algae oil", why: "Critical for brain and eye development" },
      { nutrient: "Magnesium", sources: "Nuts, seeds, whole grains, dark chocolate", why: "Reduces leg cramps and supports muscle function" },
      { nutrient: "Vitamin D", sources: "Fortified dairy, egg yolks, sunlight", why: "Works with calcium for bone formation" },
    ],
    foodsToAvoid: ["Deli meats unless heated until steaming", "Soft cheeses (brie, camembert, feta unless pasteurised)", "Raw sushi", "Excess sugar (gestational diabetes risk)"],
    hydrationTip: "Increase to 10 glasses. Constipation is common — prune juice and fibre-rich foods help.",
    supplementNote: "Continue prenatal vitamins. Your doctor may add iron if haemoglobin is low at 16-week check.",
  },
  3: {
    trimester: 3,
    keyNutrients: [
      { nutrient: "Protein", sources: "Chicken, fish, lentils, eggs, Greek yoghurt", why: "Baby gains weight rapidly — protein fuels growth" },
      { nutrient: "Vitamin K", sources: "Leafy greens, broccoli, fermented foods", why: "Supports blood clotting at birth" },
      { nutrient: "Iron", sources: "Lean beef, pumpkin seeds, fortified cereals", why: "Prepares for blood loss during delivery" },
      { nutrient: "Choline", sources: "Eggs, meat, fish, beans", why: "Supports baby's brain development and memory function" },
    ],
    foodsToAvoid: ["Large meals (heartburn)", "Gassy foods before bed", "Excess sodium (worsens swelling)", "Unpasteurised foods"],
    hydrationTip: "Staying hydrated reduces Braxton Hicks. Eat smaller, more frequent meals to ease heartburn.",
    supplementNote: "Discuss vitamin D and omega-3 supplementation with your clinician for the third trimester.",
  },
};

// ─── Pregnancy warning signs ───
const pregnancyWarningSignsList: PregnancyWarningSign[] = [
  { trimester: "all", sign: "Heavy vaginal bleeding", urgency: "urgent", action: "Call emergency services immediately." },
  { trimester: "all", sign: "Severe, persistent abdominal pain or cramping", urgency: "urgent", action: "Go to the nearest emergency room or call your midwife immediately." },
  { trimester: "all", sign: "High fever (over 38°C / 100.4°F)", urgency: "urgent", action: "Seek urgent medical care — fever in pregnancy can be dangerous." },
  { trimester: "all", sign: "Severe headache that won't go away", urgency: "urgent", action: "May indicate preeclampsia — call your care team now." },
  { trimester: "all", sign: "Blurred or double vision, flashes of light", urgency: "urgent", action: "Sign of possible preeclampsia — seek evaluation immediately." },
  { trimester: "all", sign: "Sudden severe swelling of face, hands or feet", urgency: "urgent", action: "Monitor blood pressure and contact clinician urgently." },
  { trimester: 2, sign: "Reduced or absent fetal movement (after 20 weeks)", urgency: "soon", action: "Perform a kick count; if fewer than 10 in 2 hours, contact your midwife." },
  { trimester: 3, sign: "Reduced fetal movement", urgency: "urgent", action: "Count kicks — fewer than 10 in 2 hours requires immediate assessment." },
  { trimester: "all", sign: "Burning or pain during urination", urgency: "soon", action: "UTI in pregnancy can lead to kidney infection — see clinician within 24 hours." },
  { trimester: "all", sign: "Persistent vomiting (unable to keep fluids down)", urgency: "soon", action: "Risk of dehydration — seek IV fluids and antiemetic support." },
  { trimester: 2, sign: "Pressure or cramping in the lower abdomen before week 37", urgency: "urgent", action: "Could be preterm labour — contact your care team immediately." },
  { trimester: 3, sign: "Regular contractions before 37 weeks", urgency: "urgent", action: "Possible preterm labour — go to the hospital immediately." },
  { trimester: 3, sign: "Fluid leaking from vagina (water breaking)", urgency: "soon", action: "Note the time, colour, and amount; contact your hospital for guidance." },
  { trimester: "all", sign: "Chest pain or difficulty breathing", urgency: "urgent", action: "Could indicate pulmonary embolism — call emergency services." },
  { trimester: "all", sign: "Signs of depression or thoughts of self-harm", urgency: "urgent", action: "Reach out to a mental health provider or crisis line immediately." },
];

// ─── Medication safety categories ───
const medicationSafetyCategories: MedicationSafetyCategory[] = [
  {
    category: "Generally Safe (with clinician guidance)",
    label: "Low Risk",
    description: "These medications are widely used in pregnancy and have reassuring safety data. Always confirm with your clinician.",
    examples: ["Paracetamol (acetaminophen) for pain/fever", "Prenatal vitamins with folic acid and iron", "Antacids containing calcium carbonate", "Topical antifungals for yeast infections", "Metoclopramide for severe nausea (prescribed)"],
    color: "green",
  },
  {
    category: "Use with Caution (only if benefits outweigh risks)",
    label: "Caution",
    description: "Limited data exists. Your clinician will weigh benefits against potential risks for you individually.",
    examples: ["Antihistamines (ask clinician which type)", "Some antibiotics (clinician must approve)", "SSRIs for depression (discuss tapering vs continuing)", "Beta blockers for hypertension", "Low-dose aspirin for preeclampsia prevention (prescribed)"],
    color: "yellow",
  },
  {
    category: "Avoid in Pregnancy",
    label: "Avoid",
    description: "These medications carry known risks of harm to the fetus or serious complications. Do not use unless a specialist prescribes them for a life-threatening condition.",
    examples: ["Ibuprofen and NSAIDs (especially after 20 weeks)", "ACE inhibitors (for blood pressure)", "Warfarin / blood thinners (without specialist supervision)", "Retinoids (acne medications)", "Thalidomide", "Tetracycline antibiotics"],
    color: "red",
  },
];

// ─── Standard appointment schedule ───
const appointmentSchedule: PregnancyAppointment[] = [
  { weeksRange: "6–10 weeks", title: "First Prenatal Visit", purpose: ["Confirm pregnancy and estimated due date", "Blood type, Rh factor, full blood count", "STI and HIV screening", "Discuss medications and supplements", "Blood pressure baseline"] },
  { weeksRange: "11–14 weeks", title: "First Trimester Screening", purpose: ["Nuchal translucency ultrasound", "NIPT blood test (optional)", "Down syndrome and chromosomal screening", "Review lifestyle: diet, exercise, work, travel"] },
  { weeksRange: "16–18 weeks", title: "Routine Check", purpose: ["Blood pressure and weight", "Urine test for protein", "Quad screen blood test (optional)", "Listen to fetal heartbeat"] },
  { weeksRange: "18–22 weeks", title: "Anatomy Scan (20-week scan)", purpose: ["Detailed fetal anatomy assessment", "Placenta location check", "Cervical length if at risk for preterm labour", "Confirm sex if desired"] },
  { weeksRange: "24–28 weeks", title: "Gestational Diabetes Screening", purpose: ["Glucose challenge test", "Anaemia blood test", "Blood pressure check", "Vaccination review (flu, Tdap)"] },
  { weeksRange: "28–32 weeks", title: "Third Trimester Begin", purpose: ["Rhesus factor injection (if Rh negative)", "Growth and position scan", "Birth plan discussion begins", "Group B Strep swab preparation"] },
  { weeksRange: "35–37 weeks", title: "Group B Strep Swab", purpose: ["GBS vaginal/rectal swab", "Review birth plan", "Discuss labour signs and when to go to hospital", "Check presentation (head down?)"] },
  { weeksRange: "38–40 weeks", title: "Weekly Checks", purpose: ["Cervical assessment if indicated", "Non-stress test if post-dates", "Discuss induction plan", "Finalise hospital plan and transport"] },
];

const emergencySymptoms = new Set([
  "excessive bleeding",
  "severe abdominal pain",
  "fainting",
  "chest pain",
  "high fever",
  "seizure",
  "thoughts of self-harm",
]);

function parseISODate(isoDate: string): Date | null {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(baseDate: Date, days: number): Date {
  const next = new Date(baseDate);
  next.setDate(next.getDate() + days);
  return next;
}

function formatISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function buildMenstrualPrediction(input: MenstrualPredictionInput): MenstrualPrediction | null {
  const startDate = parseISODate(input.lastPeriodStartISO);
  if (!startDate) return null;

  const cycleLength = Math.max(21, Math.min(40, Math.round(input.cycleLength || 28)));
  const periodLength = Math.max(2, Math.min(10, Math.round(input.periodLength || 5)));
  const reminderDaysBefore = Math.max(1, Math.min(10, Math.round(input.reminderDaysBefore || 2)));

  const nextPeriodStart = addDays(startDate, cycleLength);
  const nextPeriodEnd = addDays(nextPeriodStart, periodLength - 1);

  const ovulationDate = addDays(nextPeriodStart, -14);
  const ovulationWindowStart = addDays(ovulationDate, -1);
  const ovulationWindowEnd = addDays(ovulationDate, 1);

  const fertileStart = addDays(ovulationDate, -5);
  const fertileEnd = addDays(ovulationDate, 1);
  const fertileDays: string[] = [];
  const cursor = new Date(fertileStart);
  while (cursor <= fertileEnd) {
    fertileDays.push(formatISODate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  const pmsStart = addDays(nextPeriodStart, -5);
  const pmsEnd = addDays(nextPeriodStart, -1);
  const reminderDate = addDays(nextPeriodStart, -reminderDaysBefore);

  return {
    nextPeriodStart: formatISODate(nextPeriodStart),
    nextPeriodEnd: formatISODate(nextPeriodEnd),
    predictedCycleLength: cycleLength,
    ovulationDate: formatISODate(ovulationDate),
    ovulationWindowStart: formatISODate(ovulationWindowStart),
    ovulationWindowEnd: formatISODate(ovulationWindowEnd),
    fertileDays,
    pmsStart: formatISODate(pmsStart),
    pmsEnd: formatISODate(pmsEnd),
    reminderDate: formatISODate(reminderDate),
  };
}

export function predictNextCycle(lastPeriodISO: string, cycleLength = 28): string | null {
  if (!lastPeriodISO) return null;
  const date = new Date(lastPeriodISO);
  if (Number.isNaN(date.getTime())) return null;
  const next = new Date(date);
  next.setDate(next.getDate() + cycleLength);
  return next.toISOString().slice(0, 10);
}

export function getMenstrualAdvice(symptoms: string[], painLevel: number): AdviceResult {
  const advice: string[] = [
    "Hydrate well and use light movement such as walking or stretching.",
    "Apply gentle heat on the lower abdomen for cramp relief.",
  ];
  const nutrition: string[] = [
    "Include iron-rich foods (beans, spinach, fish, lean meats).",
    "Magnesium and omega-3 foods may support cramp and mood control.",
  ];
  const seekCare: string[] = [];

  if (symptoms.includes("fatigue")) {
    advice.push("Prioritize sleep and short daytime rest when possible.");
  }
  if (symptoms.includes("mood swings")) {
    advice.push("Use stress-reduction routines: breathing, journaling, and low-intensity exercise.");
  }
  if (painLevel >= 7 || symptoms.includes("severe cramps")) {
    advice.push("Over-the-counter pain medicine may help if safe for you.");
    seekCare.push("Seek medical care if severe pain does not improve in 24 hours.");
  }
  if (symptoms.includes("heavy bleeding")) {
    seekCare.push("Urgent care is recommended for soaking through pads/tampons every hour.");
  }

  return { advice, nutrition, seekCare };
}

export function analyzeMenstrualSymptomPatterns(
  entries: MenstrualSymptomLogEntry[],
): MenstrualSymptomPatternAnalysis {
  const counts = new Map<string, number>();

  for (const entry of entries) {
    for (const symptom of entry.symptoms) {
      const key = symptom.toLowerCase().trim();
      if (!key) continue;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  const ranked = [...counts.entries()].sort((left, right) => right[1] - left[1]);
  const frequentSymptoms = ranked.filter(([, count]) => count >= 2).map(([symptom]) => symptom);

  const patternNotes: string[] = [];
  if (entries.length === 0) {
    patternNotes.push("Log symptoms over several days to unlock personalized pattern insights.");
  } else {
    patternNotes.push(`You have logged ${entries.length} symptom entries so far.`);
    if (frequentSymptoms.length > 0) {
      patternNotes.push(`Most repeated: ${frequentSymptoms.slice(0, 3).join(", ")}.`);
    }
  }

  const careTips = [
    "Track hydration, sleep, and stress alongside symptoms for clearer trend detection.",
    "Use gentle movement and warm compresses on days with cramps or bloating.",
  ];
  const seekCare: string[] = [];

  if (counts.has("cramps") || counts.has("severe cramps")) {
    careTips.push("For recurring cramps, discuss pain control options with your clinician.");
  }
  if (counts.has("headaches") || counts.has("nausea")) {
    careTips.push("Frequent headaches or nausea may improve with regular meals and hydration.");
  }
  if (counts.has("mood swings") || counts.has("fatigue")) {
    careTips.push("Mood and fatigue patterns may improve with sleep routines and stress-reduction habits.");
  }
  if (counts.has("breast tenderness") || counts.has("bloating")) {
    careTips.push("Limit excess salt and caffeine during PMS-prone days to reduce tenderness and bloating.");
  }
  if (counts.has("heavy bleeding")) {
    seekCare.push("Seek urgent care for heavy bleeding that soaks a pad or tampon every hour.");
  }
  if (counts.has("severe cramps")) {
    seekCare.push("Severe cramps that disrupt normal activities should be medically reviewed.");
  }

  return {
    frequentSymptoms,
    patternNotes,
    careTips,
    seekCare,
  };
}

export function getPregnancyWeekDetail(week: number): PregnancyWeekDetail {
  const clampedWeek = Math.max(4, Math.min(40, week));
  const milestones = Object.keys(pregnancyWeekDetails).map(Number).sort((a, b) => a - b);
  let selected = milestones[0];
  for (const marker of milestones) {
    if (clampedWeek >= marker) selected = marker;
  }
  return { ...pregnancyWeekDetails[selected], week: clampedWeek };
}

export function getPregnancyWeekInfo(week: number): string {
  const detail = getPregnancyWeekDetail(week);
  return detail.fetalDevelopment[0] ?? "Your baby continues to grow and develop each week.";
}

export function getTrimester(week: number): 1 | 2 | 3 {
  if (week <= 13) return 1;
  if (week <= 27) return 2;
  return 3;
}

export function getPregnancyNutritionGuide(week: number): PregnancyNutritionGuide {
  return pregnancyNutritionGuides[getTrimester(week)];
}

export function getPregnancyWarnings(): string[] {
  return pregnancyWarningSignsList.filter(w => w.trimester === "all").map(w => w.sign);
}

export function getPregnancyWarningSignsForWeek(week: number): PregnancyWarningSign[] {
  const trimester = getTrimester(week);
  return pregnancyWarningSignsList.filter(w => w.trimester === "all" || w.trimester === trimester);
}

export function getMedicationSafetyCategories(): MedicationSafetyCategory[] {
  return medicationSafetyCategories;
}

export function getAppointmentSchedule(): PregnancyAppointment[] {
  return appointmentSchedule;
}

export function getNextAppointment(week: number): PregnancyAppointment | null {
  const weekNum = week;
  for (const appt of appointmentSchedule) {
    const [startStr] = appt.weeksRange.split("–");
    const startWeek = parseInt(startStr, 10);
    if (weekNum <= startWeek + 2) return appt;
  }
  return appointmentSchedule[appointmentSchedule.length - 1];
}

export function getMentalHealthSupportForWeek(week: number): {
  tip: string;
  commonFeelings: string[];
  strategies: string[];
  seekHelp: string[];
} {
  const trimester = getTrimester(week);
  if (trimester === 1) {
    return {
      tip: "First trimester emotions can be intense. Physical discomfort and hormonal surges affect mood.",
      commonFeelings: ["Anxiety about miscarriage risk", "Excitement mixed with worry", "Mood swings", "Feeling overwhelmed"],
      strategies: ["Share news with a trusted support person", "Keep a journal", "Rest and reduce unnecessary stress", "Join an early pregnancy online community"],
      seekHelp: ["Persistent hopelessness lasting more than 2 weeks", "Inability to function at work or home", "Thoughts of self-harm"],
    };
  }
  if (trimester === 2) {
    return {
      tip: "The second trimester often brings more energy and emotional stability. Enjoy this bonding time.",
      commonFeelings: ["Excitement as bump grows", "Body image changes", "Partner relationship shifts", "Planning anxiety"],
      strategies: ["Take childbirth preparation classes", "Practice mindfulness and gentle yoga", "Discuss parenting values with partner", "Connect with other expecting parents"],
      seekHelp: ["Severe anxiety about birth or parenting", "Persistent low mood", "Relationship distress affecting daily life"],
    };
  }
  return {
    tip: "Third trimester brings anticipation and worry. Prepare practically and emotionally for birth.",
    commonFeelings: ["Birth anxiety", "Fear of pain", "Worry about baby's health", "Nesting urges", "Impatience"],
    strategies: ["Write and share your birth plan", "Practice breathing and relaxation techniques", "Accept help from those who offer it", "Discuss postpartum plan with partner"],
    seekHelp: ["Panic attacks or severe fear of childbirth (tokophobia)", "Feeling detached from baby", "Persistent low mood or hopelessness"],
  };
}

export function getHospitalChecklist(): string[] {
  return [
    "Identification and insurance/clinic card",
    "Birth plan (2 copies) and emergency contacts",
    "Comfortable, loose clothing and slippers",
    "Sanitary pads (extra thick, postpartum)",
    "Snacks and electrolyte drinks for labour",
    "Going-home outfit for you and baby",
    "Baby clothes (3 outfits), nappies, and blanket",
    "Infant car seat installed in vehicle",
    "Phone charger and camera",
    "Essential toiletries and lip balm",
    "Pillow from home for comfort",
    "Insurance or maternity card",
  ];
}

export function answerPregnancyQuestion(question: string): { response: string; risk: "low" | "high" } {
  const text = question.toLowerCase();

  if (/(heavy bleeding|severe pain|fainting|chest pain|seizure|self-harm|not moving|stopped moving)/.test(text)) {
    return {
      response: "Your symptoms may be a danger sign. Please seek urgent medical care immediately — go to your nearest hospital or call emergency services.",
      risk: "high",
    };
  }
  if (/(nausea|morning sickness|vomiting)/.test(text)) {
    return {
      response: "Morning sickness is very common in the first trimester. Try small frequent meals, ginger tea, vitamin B6-rich foods, and acupressure wristbands. If you cannot keep fluids down, contact your clinician for antiemetic support.",
      risk: "low",
    };
  }
  if (/(appointment|antenatal|prenatal visit|checkup|check-up|scan)/.test(text)) {
    return {
      response: "Regular antenatal appointments are key for blood pressure checks, fetal growth monitoring, and early detection of complications. If you share your pregnancy week, I can suggest what visit is usually next and what to prepare.",
      risk: "low",
    };
  }
  if (/(due date|week|trimester|how far along)/.test(text)) {
    return {
      response: "Pregnancy is usually tracked over 40 weeks across 3 trimesters. If you know your current week or last menstrual period date, I can help you understand your stage and what changes are common now.",
      risk: "low",
    };
  }
  if (/(kick|movement|baby moving|fetal movement)/.test(text)) {
    return {
      response: "From around 28 weeks, aim to feel at least 10 movements in 2 hours once per day. If movements decrease significantly, contact your midwife or hospital for monitoring. Do not wait until the next day.",
      risk: "low",
    };
  }
  if (/(swelling|edema|oedema)/.test(text)) {
    return {
      response: "Mild ankle and foot swelling is common, especially in the third trimester. Elevate your feet, stay hydrated, and avoid standing for long periods. Sudden severe swelling of the face or hands with headaches needs urgent evaluation for preeclampsia.",
      risk: "low",
    };
  }
  if (/(sleep|insomnia|can't sleep|sleeping)/.test(text)) {
    return {
      response: "Sleep difficulty is very common in pregnancy. Try a pregnancy pillow to support your bump, sleep on your left side to improve blood flow, limit fluids in the evening, and practice a calming bedtime routine.",
      risk: "low",
    };
  }
  if (/(exercise|workout|gym|run|sport)/.test(text)) {
    return {
      response: "Moderate exercise is safe and beneficial in most pregnancies. Walking, swimming, prenatal yoga, and light resistance training are excellent choices. Avoid contact sports, high-impact jumping, and exercises lying flat on your back after 16 weeks. Always check with your clinician if you have any complications.",
      risk: "low",
    };
  }
  if (/(anxiety|stress|panic|sad|depressed|overwhelmed|mental health|hopeless)/.test(text)) {
    return {
      response: "Emotional ups and downs are common in pregnancy, but persistent anxiety, low mood, or hopelessness deserves support. Please tell your clinician or midwife, and seek urgent help immediately for thoughts of self-harm.",
      risk: "low",
    };
  }
  if (/(diet|eat|food|nutrition|safe to eat)/.test(text)) {
    return {
      response: "A balanced diet rich in folate, iron, calcium, and omega-3s supports your pregnancy. Avoid raw meat and fish, high-mercury seafood, unpasteurised dairy, and alcohol. Small, frequent meals help with nausea and heartburn.",
      risk: "low",
    };
  }
  if (/(medication|medicine|drug|painkiller|ibuprofen|paracetamol)/.test(text)) {
    return {
      response: "Paracetamol (acetaminophen) is generally considered safe for pain and fever during pregnancy. Avoid ibuprofen and other NSAIDs, especially after 20 weeks. Always discuss any medications — including supplements — with your clinician before taking them.",
      risk: "low",
    };
  }
  if (/(labour bag|hospital bag|birth plan|childbirth class|prepare for birth|delivery prep)/.test(text)) {
    return {
      response: "Birth preparation can start in the third trimester: pack a hospital bag, finalize your birth preferences, and review labour signs and transport plans. Childbirth classes can improve confidence for both first-time and experienced parents.",
      risk: "low",
    };
  }
  if (/(labour|labor|contraction|birth|deliver)/.test(text)) {
    return {
      response: "Labour signs include regular contractions that increase in intensity, a bloody show, and/or rupture of membranes. Contact your hospital when contractions are 5 minutes apart for 1 hour, if your water breaks, or if you have any concerns. Trust your instincts.",
      risk: "low",
    };
  }
  if (/(sex|intercourse|safe|intimate)/.test(text)) {
    return {
      response: "Sex is generally safe throughout pregnancy unless your clinician advises otherwise (e.g. low-lying placenta, preterm labour risk). Discomfort may increase as your bump grows — different positions may help. Some spotting after sex is normal but persistent bleeding should be assessed.",
      risk: "low",
    };
  }
  if (/(miscarriage|loss|cramping early)/.test(text)) {
    return {
      response: "Early pregnancy loss is unfortunately common and is almost never caused by anything the mother did. If you are experiencing bleeding and cramping, contact your clinician or early pregnancy unit for support and assessment. You deserve compassionate care.",
      risk: "low",
    };
  }
  if (/(preeclampsia|blood pressure|hypertension)/.test(text)) {
    return {
      response: "Preeclampsia is high blood pressure in pregnancy that can be serious. Warning signs include severe headache, visual disturbances, sudden face/hand swelling, and upper abdominal pain. Report any of these immediately to your care team.",
      risk: "low",
    };
  }

  return {
    response: "I can help with week-by-week development, symptoms, warning signs, appointments, nutrition, safe exercise, medication safety, mental health, and childbirth preparation. Share your week and symptom details for more specific guidance.",
    risk: "low",
  };
}

export function getPostpartumTips(weeksAfterBirth: number, moodScore: number, breastfeeding: boolean): string[] {
  const tips = [
    "Prioritize hydration, balanced meals, and short rest periods.",
    "Accept family/community support for daily tasks and childcare breaks.",
    "Track bleeding, wound healing, and signs of infection.",
    "Practice gentle movement as advised by your clinician.",
  ];

  if (breastfeeding) {
    tips.push("Breastfeed on demand and watch latch quality to reduce nipple pain.");
  } else {
    tips.push("If not breastfeeding, discuss safe formula preparation and feeding schedules.");
  }

  if (weeksAfterBirth <= 6) {
    tips.push("Attend your postnatal checkup within the first 6 weeks.");
  }
  if (moodScore <= 4) {
    tips.push("Low mood can be a warning sign; talk to a trusted person and a clinician quickly.");
  }

  return tips;
}

export function assessEmergencyRisk(symptoms: string[]): { risk: "low" | "high"; recommendation: string } {
  const hasHighRisk = symptoms.some((symptom) => emergencySymptoms.has(symptom.toLowerCase()));
  if (hasHighRisk) {
    return {
      risk: "high",
      recommendation: "High-risk symptoms detected. Seek immediate medical care or emergency services now.",
    };
  }

  return {
    risk: "low",
    recommendation: "No immediate danger signs detected from selected symptoms. Continue monitoring and contact a clinician if symptoms worsen.",
  };
}

export function answerHealthQuestion(question: string, stage: LifeStage): { response: string; risk: "low" | "high" } {
  const text = question.toLowerCase();

  if (/(heavy bleeding|fainting|severe pain|self-harm|seizure|chest pain)/.test(text)) {
    return {
      response:
        "Your message contains danger signs. Please seek urgent medical care immediately. If available, contact emergency services now.",
      risk: "high",
    };
  }

  if (stage === "menstrual") {
    if (/(late period|period late|missed period)/.test(text)) {
      return {
        response:
          "A late period can be caused by stress, hormonal changes, travel, or pregnancy. If sexually active, consider a pregnancy test and consult a clinician if delay persists.",
        risk: "low",
      };
    }

    if (/(cramp|pms|pain)/.test(text)) {
      return {
        response:
          "For menstrual pain, use heat therapy, hydration, gentle movement, and balanced meals. Seek care if pain is severe or interferes with daily activity.",
        risk: "low",
      };
    }
  }

  if (stage === "pregnancy") {
    return answerPregnancyQuestion(question);
  }

  if (stage === "postpartum") {
    if (/(breastfeed|latch|milk)/.test(text)) {
      return {
        response:
          "For breastfeeding, ensure deep latch, feed on demand, and stay hydrated. Seek lactation or clinical support for persistent pain, fever, or low infant weight gain.",
        risk: "low",
      };
    }

    if (/(sad|anxious|depressed|hopeless)/.test(text)) {
      return {
        response:
          "Postpartum mood changes are common, but persistent sadness or anxiety should be discussed with a clinician promptly. Reach out to trusted support today.",
        risk: "low",
      };
    }
  }

  return {
    response:
      "I can help with menstrual health, pregnancy, postpartum recovery, symptom tracking, and warning signs. Share your symptoms and duration for more specific guidance.",
    risk: "low",
  };
}
