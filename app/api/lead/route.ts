import { NextResponse } from "next/server";
import {
  parseLeadPayload,
  saveLead,
  sendLeadReportEmail,
  type LeadPayload,
} from "@/lib/lead";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as LeadPayload;
    const parsed = parseLeadPayload(payload);

    if (!parsed.ok) {
      return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });
    }

    const lead = saveLead(parsed.value.email, parsed.value.resultId);

    try {
      await sendLeadReportEmail(parsed.value.email, parsed.value.resultId);
    } catch (emailError) {
      console.error("lead email error", emailError);
      return NextResponse.json(
        {
          success: false,
          error:
            "Lead captured, but report email could not be sent. Please verify Resend configuration.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true, id: lead.id });
  } catch (error) {
    console.error("/api/lead error", error);
    return NextResponse.json(
      { success: false, error: "Unable to process lead request." },
      { status: 500 },
    );
  }
}
