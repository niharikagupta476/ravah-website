"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface ScoreRadarChartProps {
  data: Array<{ metric: string; value: number }>;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { metric: string; value: number } }>;
}) {
  if (!active || !payload?.length) return null;
  const { metric, value } = payload[0].payload;
  return (
    <div className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-white">{metric}</p>
      <p className="text-slate-300">{value} / 1000</p>
    </div>
  );
}

export function ScoreRadarChart({ data }: ScoreRadarChartProps) {
  return (
    <div className="h-72 w-full rounded-xl border border-slate-700 bg-slate-800/60 p-2">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 12, right: 24, bottom: 12, left: 24 }}>
          <PolarGrid stroke="#334155" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            dataKey="value"
            stroke="#38bdf8"
            strokeWidth={2}
            fill="#38bdf8"
            fillOpacity={0.2}
            dot={{ fill: "#38bdf8", r: 3, strokeWidth: 0 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
