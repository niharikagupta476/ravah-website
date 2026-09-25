import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  parseContactPayload,
  saveContactSubmission,
  type ContactRequestPayload,
} from "@/lib/contact";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ContactRequestPayload;
    const parsed = parseContactPayload(payload);

    if (!parsed.ok) {
      return NextResponse.json(
        { success: false, error: parsed.error },
        { status: 400 },
      );
    }

    const submission = saveContactSubmission(parsed.value);

    const resendKey = process.env.RESEND_API_KEY;
    const contactTo = process.env.CONTACT_TO_EMAIL;
    const contactFrom = process.env.CONTACT_FROM_EMAIL;

    if (!resendKey || !contactTo || !contactFrom) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Contact service is not configured. Set RESEND_API_KEY, CONTACT_TO_EMAIL, and CONTACT_FROM_EMAIL.",
        },
        { status: 503 },
      );
    }

    const resend = new Resend(resendKey);

    await resend.emails.send({
      from: contactFrom,
      to: [contactTo],
      replyTo: submission.email,
      subject: `Ravah inquiry (${submission.source}) from ${submission.name}`,
      text: [
        `Name: ${submission.name}`,
        `Email: ${submission.email}`,
        `Company: ${submission.company || "N/A"}`,
        `Role: ${submission.role || "N/A"}`,
        `Source: ${submission.source}`,
        "",
        submission.message,
      ].join("\n"),
    });

    return NextResponse.json({ success: true, id: submission.id });
  } catch (error) {
    console.error("/api/contact error", error);
    return NextResponse.json(
      { success: false, error: "Unable to submit form. Please try again." },
      { status: 500 },
    );
  }
}
