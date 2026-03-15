export type LifeStage = "menstrual" | "pregnancy" | "postpartum";

export type AdviceResult = {
  advice: string[];
  nutrition: string[];
  seekCare: string[];
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

const pregnancyWeekHighlights: Record<number, string> = {
  4: "Implantation is complete and the neural tube starts forming.",
  8: "Major organs are forming and heartbeat is detectable on ultrasound.",
  12: "Fingers, toes, and facial features are becoming clearer.",
  16: "Muscles strengthen and fetal movement may begin soon.",
  20: "Hearing develops and movement is usually noticeable.",
  24: "Lungs and brain continue rapid development.",
  28: "Baby is developing lungs and gaining more body fat.",
  32: "Bones are fully developed, but still soft.",
  36: "Baby prepares for birth and may move lower into the pelvis.",
  40: "Full-term stage reached; labor signs are expected soon.",
};

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

export function getPregnancyWeekInfo(week: number): string {
  const milestones = Object.keys(pregnancyWeekHighlights)
    .map(Number)
    .sort((a, b) => a - b);

  let selected = milestones[0];
  for (const marker of milestones) {
    if (week >= marker) {
      selected = marker;
    }
  }

  return pregnancyWeekHighlights[selected] ?? "Your baby continues to grow and develop each week.";
}

export function getPregnancyWarnings(): string[] {
  return [
    "Vaginal bleeding, severe headache, blurred vision, or persistent abdominal pain need urgent review.",
    "Reduced fetal movement in later pregnancy should be assessed quickly.",
    "Swelling with high blood pressure symptoms can indicate a hypertensive emergency.",
  ];
}

export function getHospitalChecklist(): string[] {
  return [
    "Identification and insurance/clinic card",
    "Birth plan and emergency contacts",
    "Comfortable clothes and sanitary pads",
    "Baby clothes, diapers, and blanket",
    "Phone charger and essential toiletries",
  ];
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
    if (/(normal|pain|abdominal)/.test(text)) {
      return {
        response:
          "Mild discomfort can occur in pregnancy, but severe abdominal pain, bleeding, severe headache, or reduced fetal movement need urgent evaluation.",
        risk: "low",
      };
    }
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
