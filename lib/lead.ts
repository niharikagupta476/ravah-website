import { Resend } from "resend";
import { getScoreResult } from "@/lib/score/store";
import type { ScoreInput } from "@/lib/score/types";

export interface LeadPayload {
  email?: string;
  resultId?: string;
}

interface StoredLead {
  id: string;
  email: string;
  resultId: string;
  score: number;
  inputs: ScoreInput;
  createdAt: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const leads: StoredLead[] = [];

export function parseLeadPayload(payload: LeadPayload) {
  const email = (payload.email || "").trim().toLowerCase();
  const resultId = (payload.resultId || "").trim();

  if (!EMAIL_REGEX.test(email)) {
    return { ok: false as const, error: "Please enter a valid email." };
  }

  if (!resultId) {
    return { ok: false as const, error: "Missing score result id." };
  }

  const scoreResult = getScoreResult(resultId);

  if (!scoreResult) {
    return { ok: false as const, error: "Score result not found or expired." };
  }

  return { ok: true as const, value: { email, resultId, scoreResult } };
}

export function saveLead(email: string, resultId: string) {
  const scoreResult = getScoreResult(resultId);

  if (!scoreResult) {
    throw new Error("Cannot store lead without score result.");
  }

  const lead = {
    id: crypto.randomUUID(),
    email,
    resultId,
    score: scoreResult.result.score,
    inputs: scoreResult.input,
    createdAt: new Date().toISOString(),
  };

  leads.unshift(lead);
  leads.splice(1000);

  return lead;
}

export async function sendLeadReportEmail(email: string, resultId: string) {
  const scoreResult = getScoreResult(resultId);

  if (!scoreResult) {
    throw new Error("Result not found for email report.");
  }

  const resendKey = process.env.RESEND_API_KEY;
  const contactFrom = process.env.CONTACT_FROM_EMAIL;

  if (!resendKey || !contactFrom) {
    throw new Error("Missing Resend configuration.");
  }

  const resend = new Resend(resendKey);

  const lines = Object.entries(scoreResult.result.breakdown).map(
    ([metric, value]) => `${metric}: ${value.normalized}/1000`,
  );

  await resend.emails.send({
    from: contactFrom,
    to: [email],
    subject: `Your Ravah Score report (${scoreResult.result.score})`,
    text: [
      `Ravah Score: ${scoreResult.result.score}`,
      "",
      "Breakdown:",
      ...lines,
      "",
      "Insights:",
      ...scoreResult.result.insights.map((insight) => `- ${insight.title}: ${insight.detail}`),
      "",
      "Next step:",
      "Explore Ravah product capabilities: https://ravah.ai/product",
    ].join("\n"),
  });
}
