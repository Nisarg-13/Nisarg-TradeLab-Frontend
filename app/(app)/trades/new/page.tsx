import { PageHeader } from "@/components/layout/page-header";
import {
  TradeForm,
  type TradeFormPrefill,
} from "@/components/trades/trade-form";
import { listAccounts } from "@/lib/api/accounts";
import { listMistakes, listStrategies, listTags } from "@/lib/api/strategies";
import { getServerAuthToken } from "@/lib/auth/server";
import type { TradingAccount } from "@/types/account";
import type { Mistake, Strategy, Tag } from "@/types/strategy";
import type { TradeDirection } from "@/types/risk";

type SearchParams = Record<string, string | string[] | undefined>;

function readParam(params: SearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function NewTradePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  let accounts: TradingAccount[] = [];
  let strategies: Strategy[] = [];
  let tags: Tag[] = [];
  let mistakes: Mistake[] = [];

  try {
    const [
      accountsResponse,
      strategiesResponse,
      tagsResponse,
      mistakesResponse,
    ] = await Promise.all([
      listAccounts(getServerAuthToken),
      listStrategies(getServerAuthToken),
      listTags(getServerAuthToken),
      listMistakes(getServerAuthToken),
    ]);

    accounts = accountsResponse.data;
    strategies = strategiesResponse.data;
    tags = tagsResponse.data;
    mistakes = mistakesResponse.data;
  } catch {
    accounts = [];
    strategies = [];
    tags = [];
    mistakes = [];
  }

  const prefill: TradeFormPrefill = {
    tradingAccountId: readParam(params, "accountId"),
    symbol: readParam(params, "symbol"),
    direction: readParam(params, "direction") as TradeDirection | undefined,
    entryPrice: readParam(params, "entry"),
    stopLoss: readParam(params, "stopLoss"),
    takeProfit: readParam(params, "takeProfit"),
    volume: readParam(params, "volume"),
    accountBalanceAtEntry: readParam(params, "accountBalance"),
    initialRiskAmount: readParam(params, "riskAmount"),
    initialRiskPercentage: readParam(params, "riskPercentage"),
    plannedRR: readParam(params, "plannedRR"),
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Journal"
        title="New trade"
        description="Record a manual trade with optional risk snapshot and psychology notes."
      />
      <TradeForm
        mode="create"
        accounts={accounts}
        strategies={strategies}
        tags={tags}
        mistakes={mistakes}
        prefill={prefill}
      />
    </div>
  );
}
