import { Metadata } from "next";
import { TrackedLink } from "@/components/TrackedLink";

export const metadata: Metadata = {
  title: "Ravah Score",
  description:
    "Preview the Ravah Score experience and benchmark your DevOps maturity across reliability and delivery.",
  alternates: {
    canonical: "/ravah-score",
  },
};

export default function RavahScorePage() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-24 text-slate-100">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-8">
        <p className="text-sm uppercase tracking-widest text-cyan-300">Ravah Score</p>
        <h1 className="mt-3 text-4xl font-semibold">Measure your DevOps maturity</h1>
        <p className="mt-4 text-slate-300">
          We are launching Ravah Score soon. It benchmarks delivery, reliability, cost efficiency, and
          architecture health in one view.
        </p>
        <TrackedLink
          href="/contact"
          event="cta_demo_click"
          className="mt-8 inline-flex rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950"
        >
          Request Early Access
        </TrackedLink>
      </div>
    </div>
  );
}
