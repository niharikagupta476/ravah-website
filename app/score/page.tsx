import { Metadata } from "next";
import { ScoreAssessmentForm } from "@/components/ScoreAssessmentForm";

export const metadata: Metadata = {
  title: "Ravah Score — DevOps Maturity Index",
  description:
    "Benchmark your DevOps maturity across delivery, reliability, cost, architecture, AI adoption, and developer experience.",
  alternates: {
    canonical: "/score",
  },
};

export default function ScorePage() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-20 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
            Ravah DevOps Index
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Measure your DevOps maturity
          </h1>
          <p className="mt-4 text-base text-slate-400">
            Get a scored benchmark across 6 pillars — delivery, reliability, cost, architecture, AI adoption, and developer experience.
            Takes about 3 minutes.
          </p>
        </div>

        {/* Trust strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-500">●</span>
            Free to use
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-500">●</span>
            No signup required
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-500">●</span>
            Based on DORA &amp; industry benchmarks
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-500">●</span>
            Instant score, no waiting
          </span>
        </div>

        <ScoreAssessmentForm />
      </div>
    </div>
  );
}
