import Link from "next/link";
import { Metadata } from "next";
import { getScoreResult } from "@/lib/score/store";

export const metadata: Metadata = {
  title: "Ravah Score Result",
  description: "View your saved Ravah Score assessment result.",
  alternates: {
    canonical: "/score/result",
  },
};

interface ScoreResultPageProps {
  searchParams?: {
    id?: string;
  };
}

export default function ScoreResultPage({ searchParams }: ScoreResultPageProps) {
  const id = searchParams?.id;
  const stored = id ? getScoreResult(id) : null;

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-24 text-slate-100">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/[0.03] p-8">
        <p className="text-sm uppercase tracking-widest text-cyan-300">Ravah Score</p>

        {!stored && (
          <div className="stack">
            <h1 className="mt-3 text-3xl font-semibold">Result unavailable</h1>
            <p className="text-slate-300">This result link is missing or expired. Run a fresh score.</p>
            <Link href="/score" className="button button-primary">
              Try Ravah Score
            </Link>
          </div>
        )}

        {stored && (
          <div className="stack">
            <h1 className="mt-3 text-3xl font-semibold">Your Ravah Score: {stored.result.score}</h1>
            <p className="text-slate-300">{stored.result.shareText}</p>

            <div className="card">
              <h3>Breakdown</h3>
              {Object.entries(stored.result.breakdown).map(([metric, value]) => (
                <p key={metric}>
                  <strong>{metric}:</strong> {value.normalized}/1000
                </p>
              ))}
            </div>

            <div className="card">
              <h3>Insights</h3>
              {stored.result.insights.length === 0 ? (
                <p>No critical issues detected.</p>
              ) : (
                stored.result.insights.map((insight) => (
                  <p key={`${insight.metric}-${insight.title}`}>
                    <strong>{insight.title}:</strong> {insight.detail}
                  </p>
                ))
              )}
            </div>

            <div className="card">
              <h3>Recommendations</h3>
              {stored.result.recommendations.map((recommendation) => (
                <p key={`${recommendation.metric}-${recommendation.priority}`}>
                  <strong>{recommendation.priority.toUpperCase()}:</strong> {recommendation.action}
                </p>
              ))}
            </div>

            <div className="cta-actions">
              <Link href="/product" className="button button-primary">
                Start Using Ravah
              </Link>
              <Link href="/contact" className="button button-ghost">
                Book Demo
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
