import type { Strategy } from "@/types/strategy";

export function buildStrategySelectOptions(strategies: Strategy[]) {
  return [
    { value: "", label: "No strategy" },
    ...strategies.map((strategy) => ({
      value: strategy.id,
      label: strategy.name,
    })),
  ];
}
