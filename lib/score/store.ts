import type { ScoreInput, ScoreResult } from "@/lib/score/types";

export interface StoredScoreResult {
  id: string;
  input: ScoreInput;
  result: ScoreResult;
  createdAt: string;
}

const scoreResults = new Map<string, StoredScoreResult>();

export function saveScoreResult(input: ScoreInput, result: ScoreResult) {
  const id = crypto.randomUUID();
  const stored: StoredScoreResult = {
    id,
    input,
    result,
    createdAt: new Date().toISOString(),
  };

  scoreResults.set(id, stored);

  if (scoreResults.size > 500) {
    const firstKey = scoreResults.keys().next().value;
    if (firstKey) {
      scoreResults.delete(firstKey);
    }
  }

  return stored;
}

export function getScoreResult(id: string) {
  return scoreResults.get(id) || null;
}
