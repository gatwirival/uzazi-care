import { NextResponse } from "next/server";
import type { LifeStage } from "@/lib/health-advisor";
import { isLLMConfigured, streamChatCompletion } from "@/lib/ai/ai-client";
import {
  MENSTRUAL_HEALTH_AGENT,
  PREGNANCY_CARE_AGENT,
  POSTPARTUM_RECOVERY_AGENT,
} from "@/lib/ai/agents";
import type { ChatMessage } from "@/lib/ai/ai-client";

const STAGE_AGENT: Record<LifeStage, { systemPrompt: string }> = {
  menstrual: MENSTRUAL_HEALTH_AGENT,
  pregnancy: PREGNANCY_CARE_AGENT,
  postpartum: POSTPARTUM_RECOVERY_AGENT,
};

const EMERGENCY_KEYWORDS = [
  "chest pain", "can't breathe", "bleeding heavily", "unconscious",
  "seizure", "stroke", "severe headache", "vision loss", "passing out",
  "baby not moving", "placenta", "eclampsia",
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const stage = (body?.stage ?? "menstrual") as LifeStage;
    const history: ChatMessage[] = Array.isArray(body?.history) ? body.history : [];

    if (!history.length) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const lastMessage = history[history.length - 1]?.content ?? "";

    // Emergency fast-path
    const isEmergency = EMERGENCY_KEYWORDS.some((kw) =>
      lastMessage.toLowerCase().includes(kw)
    );
    if (isEmergency) {
      return NextResponse.json({
        response:
          "\u26a0\ufe0f **This sounds like a medical emergency.** Please call emergency services (999\u00a0/\u00a0911\u00a0/\u00a0112) immediately or go to the nearest emergency room. Do not wait.",
        risk: "high",
      });
    }

    // Fallback to static advisor if no API key configured
    if (!isLLMConfigured()) {
      const { answerHealthQuestion } = await import("@/lib/health-advisor");
      const result = answerHealthQuestion(lastMessage, stage);
      return NextResponse.json({ response: result.response, risk: result.risk });
    }

    const agent = STAGE_AGENT[stage] ?? MENSTRUAL_HEALTH_AGENT;

    const messages: ChatMessage[] = [
      { role: "system", content: agent.systemPrompt },
      ...history,
    ];

    try {
      const stream = await streamChatCompletion(messages, {
        temperature: 0.6,
        maxTokens: 1500,
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
        },
      });
    } catch (llmError) {
      console.error("AI stream failed, using local fallback:", llmError);
      const { answerHealthQuestion } = await import("@/lib/health-advisor");
      const result = answerHealthQuestion(lastMessage, stage);
      return NextResponse.json({
        response: result.response,
        risk: result.risk,
        fallback: true,
      });
    }
  } catch (err) {
    console.error("health-chat error:", err);
    return NextResponse.json(
      { error: "Could not process your question right now." },
      { status: 500 }
    );
  }
}
