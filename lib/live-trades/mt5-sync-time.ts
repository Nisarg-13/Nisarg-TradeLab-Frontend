import type { LiveTradeConnection } from "@/types/live-trades";

export function getLatestMt5SnapshotAt(
  connections: LiveTradeConnection[],
): string | null {
  let latest: string | null = null;

  for (const connection of connections) {
    if (!connection.lastSnapshotAt) continue;

    if (
      latest === null ||
      new Date(connection.lastSnapshotAt).getTime() > new Date(latest).getTime()
    ) {
      latest = connection.lastSnapshotAt;
    }
  }

  return latest;
}
