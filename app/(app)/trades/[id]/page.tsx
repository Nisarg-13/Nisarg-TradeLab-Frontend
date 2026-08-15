import { notFound } from "next/navigation";

import { TradeDetailView } from "@/components/trades/trade-detail-view";
import { getTrade } from "@/lib/api/trades";
import { getServerAuthToken } from "@/lib/auth/server";
import type { Trade } from "@/types/trade";

export default async function TradeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let trade: Trade | null = null;

  try {
    const response = await getTrade(getServerAuthToken, id);
    trade = response.data;
  } catch {
    notFound();
  }

  return <TradeDetailView initialTrade={trade} />;
}
