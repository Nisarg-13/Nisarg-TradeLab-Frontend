import type { ChartTimeframe } from "@/lib/constants/chart-timeframes";
import type { JournalFieldValues } from "@/types/journal";
import type { MarketBias } from "@/types/journal";
import type {
  PlanComplianceStatus,
  Trade,
  TradeReviewInput,
  UpdateTradeInput,
} from "@/types/trade";

export function toggleSelection(
  current: string[],
  id: string,
  setter: (value: string[]) => void,
) {
  setter(
    current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id],
  );
}

export function toJournalValues(review: Trade["review"]): JournalFieldValues {
  return {
    marketBias: review?.marketBias ?? "",
    preTradePlan: review?.preTradePlan ?? "",
    postTradePlan: review?.postTradePlan ?? "",
    confidenceScore: review?.confidenceScore ?? 7,
    whatWentWell: review?.whatWentWell ?? "",
    whatWentWrong: review?.whatWentWrong ?? "",
  };
}

export function buildReviewPayload(
  values: JournalFieldValues,
  planCompliance: string,
): TradeReviewInput {
  return {
    marketBias: values.marketBias
      ? (values.marketBias as MarketBias)
      : undefined,
    preTradePlan: values.preTradePlan || undefined,
    postTradePlan: values.postTradePlan || undefined,
    confidenceScore: values.confidenceScore,
    planCompliance: planCompliance
      ? (planCompliance as PlanComplianceStatus)
      : undefined,
    whatWentWell: values.whatWentWell || undefined,
    whatWentWrong: values.whatWentWrong || undefined,
  };
}

export function buildJournalUpdateInput(input: {
  chartTimeframe: string;
  strategyIds: string[];
  tagIds: string[];
  mistakeIds: string[];
  values: JournalFieldValues;
  planCompliance: string;
}): UpdateTradeInput {
  return {
    chartTimeframe: input.chartTimeframe
      ? (input.chartTimeframe as ChartTimeframe)
      : null,
    strategyIds: input.strategyIds,
    tagIds: input.tagIds,
    mistakeIds: input.mistakeIds,
    review: buildReviewPayload(input.values, input.planCompliance),
  };
}

export const EMPTY_JOURNAL_FORM = {
  values: {
    marketBias: "",
    preTradePlan: "",
    postTradePlan: "",
    confidenceScore: 7,
    whatWentWell: "",
    whatWentWrong: "",
  } satisfies JournalFieldValues,
  planCompliance: "",
  strategyIds: [] as string[],
  tagIds: [] as string[],
  mistakeIds: [] as string[],
  chartTimeframe: "",
};
