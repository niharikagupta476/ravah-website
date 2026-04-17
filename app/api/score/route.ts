import { NextResponse } from "next/server";

interface ScorePayload {
  name?: string;
  email?: string;
  delivery?: number;
  reliability?: number;
  cost?: number;
  architecture?: number;
}

function boundedNumber(value: unknown) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return null;
  }
  return Math.max(1, Math.min(5, parsed));
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ScorePayload;

    const delivery = boundedNumber(payload.delivery);
    const reliability = boundedNumber(payload.reliability);
    const cost = boundedNumber(payload.cost);
    const architecture = boundedNumber(payload.architecture);

    if (!delivery || !reliability || !cost || !architecture) {
      return NextResponse.json(
        {
          success: false,
          error: "Please complete all score inputs before submitting.",
        },
        { status: 400 },
      );
    }

    const score = Math.round(
      ((delivery + reliability + cost + architecture) / 20) * 100,
    );

    const recommendation =
      score >= 80
        ? "Strong baseline. Focus on reducing change-failure blast radius with automated release guardrails."
        : score >= 60
          ? "Good momentum. Improve incident context quality and deployment verification depth."
          : "Foundational gaps detected. Start with pipeline visibility, runbook hygiene, and incident ownership clarity.";

    return NextResponse.json({
      success: true,
      result: {
        score,
        band: score >= 80 ? "Advanced" : score >= 60 ? "Scaling" : "Foundational",
        recommendation,
      },
    });
  } catch (error) {
    console.error("/api/score error", error);
    return NextResponse.json(
      { success: false, error: "Unable to calculate score right now." },
      { status: 500 },
    );
  }
}
