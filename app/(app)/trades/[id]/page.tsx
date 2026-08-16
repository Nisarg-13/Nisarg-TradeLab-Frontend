import { notFound } from "next/navigation";

import { TradeDetailView } from "@/components/trades/trade-detail-view";
import { listMistakes, listStrategies, listTags } from "@/lib/api/strategies";
import { getTrade } from "@/lib/api/trades";
import { getServerAuthToken } from "@/lib/auth/server";
import type { Mistake, Strategy, Tag } from "@/types/strategy";
import type { Trade } from "@/types/trade";

export default async function TradeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let trade: Trade | null = null;
  let strategies: Strategy[] = [];
  let tags: Tag[] = [];
  let mistakes: Mistake[] = [];

  try {
    const [tradeResponse, strategiesResponse, tagsResponse, mistakesResponse] =
      await Promise.all([
        getTrade(getServerAuthToken, id),
        listStrategies(getServerAuthToken),
        listTags(getServerAuthToken),
        listMistakes(getServerAuthToken),
      ]);

    trade = tradeResponse.data;
    strategies = strategiesResponse.data;
    tags = tagsResponse.data;
    mistakes = mistakesResponse.data;
  } catch {
    notFound();
  }

  return (
    <TradeDetailView
      initialTrade={trade}
      strategies={strategies}
      tags={tags}
      mistakes={mistakes}
    />
  );
}
