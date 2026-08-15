import { notFound } from "next/navigation";

import { TradeForm } from "@/components/trades/trade-form";
import { listAccounts } from "@/lib/api/accounts";
import { listMistakes, listStrategies, listTags } from "@/lib/api/strategies";
import { getTrade } from "@/lib/api/trades";
import { getServerAuthToken } from "@/lib/auth/server";
import type { TradingAccount } from "@/types/account";
import type { Mistake, Strategy, Tag } from "@/types/strategy";
import type { Trade } from "@/types/trade";

export default async function EditTradePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let trade: Trade | null = null;
  let accounts: TradingAccount[] = [];
  let strategies: Strategy[] = [];
  let tags: Tag[] = [];
  let mistakes: Mistake[] = [];

  try {
    const [
      tradeResponse,
      accountsResponse,
      strategiesResponse,
      tagsResponse,
      mistakesResponse,
    ] = await Promise.all([
      getTrade(getServerAuthToken, id),
      listAccounts(getServerAuthToken),
      listStrategies(getServerAuthToken),
      listTags(getServerAuthToken),
      listMistakes(getServerAuthToken),
    ]);

    trade = tradeResponse.data;
    accounts = accountsResponse.data;
    strategies = strategiesResponse.data;
    tags = tagsResponse.data;
    mistakes = mistakesResponse.data;
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit trade</h1>
        <p className="text-muted-foreground text-sm">
          Update stop loss, take profit, strategy, and psychology fields.
        </p>
      </div>
      <TradeForm
        mode="edit"
        accounts={accounts}
        strategies={strategies}
        tags={tags}
        mistakes={mistakes}
        trade={trade}
      />
    </div>
  );
}
