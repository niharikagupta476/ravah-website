"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

interface ScoreRadarChartProps {
  data: Array<{ metric: string; value: number }>;
}

export function ScoreRadarChart({ data }: ScoreRadarChartProps) {
  return (
    <div className="h-64 w-full rounded-xl border border-slate-700 bg-slate-800 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
          <Radar
            dataKey="value"
            stroke="#38bdf8"
            fill="#38bdf8"
            fillOpacity={0.35}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
