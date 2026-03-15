import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type SymptomLogRow = Awaited<ReturnType<typeof prisma.symptomLog.findMany>>[number];

function isValidISODate(value: string): boolean {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

export async function GET() {
  try {
    const logs = await prisma.symptomLog.findMany({
      orderBy: { logDate: "desc" },
      take: 50,
    });

    return NextResponse.json({
      logs: logs.map((entry: SymptomLogRow) => ({
        id: entry.id,
        dateISO: entry.logDate.toISOString().slice(0, 10),
        symptoms: JSON.parse(entry.symptoms) as string[],
        mood: entry.mood,
        energy: entry.energy,
        sexualActivity: entry.sexualActivity,
        medication: entry.medication,
      })),
    });
  } catch {
    return NextResponse.json({ logs: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dateISO = String(body?.dateISO ?? "").trim();
    const symptoms = Array.isArray(body?.symptoms)
      ? body.symptoms.map((item: unknown) => String(item).trim().toLowerCase()).filter(Boolean)
      : [];

    if (!dateISO || !isValidISODate(dateISO)) {
      return NextResponse.json({ error: "A valid date is required." }, { status: 400 });
    }

    if (symptoms.length === 0) {
      return NextResponse.json({ error: "At least one symptom is required." }, { status: 400 });
    }

    const created = await prisma.symptomLog.create({
      data: {
        logDate: new Date(dateISO),
        symptoms: JSON.stringify(symptoms),
        mood: body?.mood ? String(body.mood) : null,
        energy: body?.energy ? String(body.energy) : null,
        sexualActivity: body?.sexualActivity ? String(body.sexualActivity) : null,
        medication: body?.medication ? String(body.medication) : null,
      },
    });

    return NextResponse.json({
      id: created.id,
      dateISO: created.logDate.toISOString().slice(0, 10),
      symptoms,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }
}
