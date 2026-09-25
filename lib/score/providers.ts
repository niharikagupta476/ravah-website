import type { ScoreDataSource, ScoreInput } from "@/lib/score/types";

export class CompositeScoreDataSource {
  constructor(private readonly providers: ScoreDataSource[]) {}

  async collect(): Promise<Partial<ScoreInput>> {
    const snapshots = await Promise.all(this.providers.map((provider) => provider.fetchMetrics()));
    return snapshots.reduce((acc, snapshot) => ({ ...acc, ...snapshot }), {});
  }
}

export function createFutureScoreProvider(name: string): ScoreDataSource {
  return {
    name,
    async fetchMetrics() {
      return {};
    },
  };
}
