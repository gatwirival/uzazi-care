import { NextResponse } from "next/server";
import { answerHealthQuestion, type LifeStage } from "@/lib/health-advisor";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question = String(body?.question ?? "").trim();
    const stage = (body?.stage ?? "menstrual") as LifeStage;

    if (!question) {
      return NextResponse.json({ error: "Question is required." }, { status: 400 });
    }

    const result = answerHealthQuestion(question, stage);
    return NextResponse.json({
      ...result,
      disclaimer:
        "This tool provides educational support and does not replace professional diagnosis or treatment.",
    });
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }
}
