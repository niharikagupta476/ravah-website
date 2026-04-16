import { Metadata } from "next";
import { Section } from "@/components/Section";
import { PricingTable } from "@/components/PricingTable";
import { CTA } from "@/components/CTA";
import { StickyCTA } from "@/components/StickyCTA";
import { PricingViewTracker } from "@/components/PricingViewTracker";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple pricing for teams of any size.",
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingPage() {
  return (
    <>
      <PricingViewTracker />
      <Section>
        <div className="section-header">
          <p className="eyebrow">Pricing</p>
          <h1>Plans that scale with your reliability goals</h1>
          <p>
            Start free and graduate to enterprise controls when you are ready.
          </p>
        </div>
        <PricingTable />
      </Section>

      <Section className="alt">
        <CTA
          title="Need a tailored security review?"
          description="We can share a data handling overview and compliance roadmap."
          primary={{ href: "/contact", label: "Talk to sales" }}
          secondary={{ href: "/security", label: "Review security" }}
        />
      </Section>
      <StickyCTA label="Talk to sales" />
    </>
  );
}
