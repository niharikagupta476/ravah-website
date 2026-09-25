export type ScoreMetricKey =
  | "delivery"
  | "cost"
  | "architecture"
  | "reliability"
  | "ai"
  | "devEx";

export interface ScoreInput {
  delivery: number;
  cost: number;
  architecture: number;
  reliability: number;
  ai: number;
  devEx: number;
}

export interface WeightedMetric {
  key: ScoreMetricKey;
  label: string;
  weight: number;
}

export interface MetricBreakdown {
  raw: number;
  normalized: number;
  weight: number;
  weightedContribution: number;
}

export interface ScoreInsight {
  metric: ScoreMetricKey;
  severity: "high" | "medium";
  title: string;
  detail: string;
}

export interface ScoreRecommendation {
  metric: ScoreMetricKey;
  priority: "p0" | "p1" | "p2";
  action: string;
  expectedOutcome: string;
}

export interface ScoreResult {
  score: number;
  breakdown: Record<ScoreMetricKey, MetricBreakdown>;
  insights: ScoreInsight[];
  recommendations: ScoreRecommendation[];
  shareText: string;
}

export interface ScoreDataSource {
  name: string;
  fetchMetrics: () => Promise<Partial<ScoreInput>>;
}
