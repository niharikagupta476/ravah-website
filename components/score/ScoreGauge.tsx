"use client";

import { useEffect, useMemo, useState } from "react";

interface ScoreGaugeProps {
  score: number;
}

interface StatusTier {
  label: string;
  badgeClass: string;
  textClass: string;
  description: string;
}

function getStatus(score: number): StatusTier {
  if (score >= 850) {
    return {
      label: "Elite",
      badgeClass: "bg-emerald-900/60 text-emerald-300 border border-emerald-700",
      textClass: "text-emerald-400",
      description: "Top-tier DevOps maturity. Your team sets the benchmark.",
    };
  }
  if (score >= 700) {
    return {
      label: "Stable",
      badgeClass: "bg-green-900/60 text-green-300 border border-green-700",
      textClass: "text-green-400",
      description: "Solid operational posture. A few areas can still be optimized.",
    };
  }
  if (score >= 400) {
    return {
      label: "At Risk",
      badgeClass: "bg-amber-900/60 text-amber-300 border border-amber-700",
      textClass: "text-amber-400",
      description: "Meaningful gaps exist. Address key pillars to prevent incidents.",
    };
  }
  return {
    label: "Critical",
    badgeClass: "bg-rose-900/60 text-rose-300 border border-rose-700",
    textClass: "text-rose-400",
    description: "High operational risk. Immediate action recommended.",
  };
}

// Zone definitions: [start%, width%, label, color]
const ZONES: Array<{ start: number; width: number; label: string; color: string }> = [
  { start: 0,  width: 40, label: "Critical", color: "#ef4444" },
  { start: 40, width: 30, label: "At Risk",  color: "#f59e0b" },
  { start: 70, width: 15, label: "Stable",   color: "#22c55e" },
  { start: 85, width: 15, label: "Elite",    color: "#10b981" },
];

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const [progress, setProgress] = useState(0);
  const clamped = Math.max(0, Math.min(1000, score));
  const percentage = (clamped / 1000) * 100;

  useEffect(() => {
    const timeout = setTimeout(() => setProgress(percentage), 80);
    return () => clearTimeout(timeout);
  }, [percentage]);

  const markerStyle = useMemo(
    () => ({ left: `calc(${progress}% - 8px)`, transition: "left 0.8s cubic-bezier(0.4,0,0.2,1)" }),
    [progress],
  );
  const status = getStatus(clamped);

  return (
    <div className="space-y-5">
      {/* Score number + badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-5xl font-bold tracking-tight text-white tabular-nums">
            {clamped}
            <span className="text-2xl font-normal text-slate-400"> / 1000</span>
          </p>
          <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
            Ravah DevOps Index (RDI)
          </p>
        </div>
        <span className={`mt-1 shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${status.badgeClass}`}>
          {status.label}
        </span>
      </div>

      <p className="text-sm text-slate-400">{status.description}</p>

      {/* CIBIL-style segmented scale */}
      <div className="space-y-2">
        <div className="relative h-4 w-full overflow-hidden rounded-full">
          {ZONES.map((zone) => (
            <div
              key={zone.label}
              className="absolute top-0 h-full"
              style={{
                left: `${zone.start}%`,
                width: `${zone.width}%`,
                backgroundColor: zone.color,
                opacity: 0.85,
              }}
            />
          ))}
          {/* Marker */}
          <span
            className="absolute top-1/2 z-10 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-slate-900 bg-white shadow-lg"
            style={markerStyle}
            aria-label={`Score position: ${clamped}`}
          />
        </div>

        {/* Zone labels */}
        <div className="flex text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          <span style={{ width: "40%" }}>Critical</span>
          <span style={{ width: "30%" }}>At Risk</span>
          <span style={{ width: "15%" }}>Stable</span>
          <span style={{ width: "15%", textAlign: "right" }}>Elite</span>
        </div>

        {/* Tick marks */}
        <div className="flex justify-between text-[10px] text-slate-600">
          <span>0</span>
          <span>400</span>
          <span>700</span>
          <span>850</span>
          <span>1000</span>
        </div>
      </div>
    </div>
  );
}
