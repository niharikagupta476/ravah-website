import { Metadata } from "next";
import { ScoreAssessmentForm } from "@/components/ScoreAssessmentForm";

export const metadata: Metadata = {
  title: "Ravah Score",
  description:
    "Benchmark your DevOps maturity across delivery, reliability, cost, and architecture.",
  alternates: {
    canonical: "/score",
  },
};

export default function ScorePage() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-24 text-slate-100">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/[0.03] p-8">
        <p className="text-sm uppercase tracking-widest text-cyan-300">Ravah Score</p>
        <h1 className="mt-3 text-4xl font-semibold">Measure your DevOps maturity instantly</h1>
        <p className="mt-4 text-slate-300">
          Get a Ravah Score based on delivery, reliability, cost, and architecture.
        </p>
        <ScoreAssessmentForm />
      </div>
    </div>
  );
}
