import { Metadata } from "next";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustStrip } from "@/components/landing/TrustStrip";
import {
  ProblemAndSolution,
  ProductPreview,
  ScoreSection,
  SocialAndFinalCta,
} from "@/components/landing/LandingBlocks";

export const metadata: Metadata = {
  title: "Ravah | Prevent DevOps Failures Before They Happen",
  description:
    "Ravah is an AI DevOps Copilot that predicts risk, accelerates root cause analysis, and reduces MTTR.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <HeroSection />
      <TrustStrip />
      <ProblemAndSolution />
      <ScoreSection />
      <ProductPreview />
      <SocialAndFinalCta />
    </div>
  );
}
