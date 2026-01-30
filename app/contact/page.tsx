import { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { DemoForm } from "@/components/DemoForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Request a demo or contact the Ravah.ai team.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <Section>
      <div className="section-header">
        <p className="eyebrow">Contact</p>
        <h1>Request a demo</h1>
        <p>
          Share your biggest reliability challenges and we will tailor the
          walkthrough.
        </p>
      </div>
      <div className="grid-3">
        <div className="card" style={{ gridColumn: "span 2" }}>
          <DemoForm />
        </div>
        <div className="stack">
          <div className="card">
            <h3>Email</h3>
            <p>hello@ravah.ai</p>
          </div>
          <div className="card">
            <h3>Calendly</h3>
            <p>Scheduling link placeholder</p>
            <Link className="button button-ghost" href="/contact">
              Request calendar access
            </Link>
          </div>
          <div className="card">
            <h3>Support</h3>
            <p>security@ravah.ai</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
