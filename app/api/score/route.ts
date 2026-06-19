import { NextResponse } from "next/server";
import { calculateRavahScore, parseScoreInput } from "@/lib/score/engine";
import type { ScoreMetricKey } from "@/lib/score/types";
import { saveScoreResult } from "@/lib/score/store";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<Record<ScoreMetricKey, unknown>>;
    const parsed = parseScoreInput(payload);

    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const result = calculateRavahScore(parsed.input);
    const stored = saveScoreResult(parsed.input, result);

    return NextResponse.json({
      ...result,
      resultId: stored.id,
      shareUrl: `/score/result?id=${stored.id}`,
    });
  } catch (error) {
    console.error("/api/score error", error);
    return NextResponse.json(
      { error: "Unable to calculate score right now." },
      { status: 500 },
    );
  }
}
