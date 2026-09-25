"use client";

import { useEffect, useMemo, useState } from "react";

interface ScoreGaugeProps {
  score: number;
}

function getStatus(score: number) {
  if (score >= 700) {
    return { label: "Stable", className: "text-emerald-400" };
  }

  if (score >= 450) {
    return { label: "At Risk", className: "text-amber-400" };
  }

  return { label: "Critical", className: "text-rose-400" };
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const [progress, setProgress] = useState(0);
  const clamped = Math.max(0, Math.min(1000, score));
  const percentage = (clamped / 1000) * 100;

  useEffect(() => {
    const timeout = setTimeout(() => setProgress(percentage), 60);
    return () => clearTimeout(timeout);
  }, [percentage]);

  const markerStyle = useMemo(() => ({ left: `calc(${progress}% - 8px)` }), [progress]);
  const status = getStatus(clamped);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-5xl font-bold tracking-tight text-white">{clamped} / 1000</p>
        <p className="text-sm text-slate-300">Ravah DevOps Index (RDI)</p>
        <p className={`text-sm font-semibold ${status.className}`}>{status.label}</p>
      </div>

      <div className="relative">
        <div className="h-3 w-full rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500" />
        <span
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-slate-900 bg-white shadow transition-all duration-700"
          style={markerStyle}
          aria-hidden
        />
      </div>
    </div>
  );
}
