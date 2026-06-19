import useCases from "@/content/use-cases.json";

export interface UseCaseItem {
  title: string;
  problem: string;
  solution: string;
  output: string;
  impact: string;
}

export const useCaseItems = useCases as UseCaseItem[];
