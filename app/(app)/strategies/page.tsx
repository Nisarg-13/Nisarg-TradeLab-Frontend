import { StrategiesManager } from "@/components/strategies/strategies-manager";
import { listMistakes, listStrategies, listTags } from "@/lib/api/strategies";
import { getServerAuthToken } from "@/lib/auth/server";
import type { Mistake, Strategy, Tag } from "@/types/strategy";

export default async function StrategiesPage() {
  let strategies: Strategy[] = [];
  let tags: Tag[] = [];
  let mistakes: Mistake[] = [];

  try {
    const [strategiesResponse, tagsResponse, mistakesResponse] =
      await Promise.all([
        listStrategies(getServerAuthToken),
        listTags(getServerAuthToken),
        listMistakes(getServerAuthToken),
      ]);

    strategies = strategiesResponse.data;
    tags = tagsResponse.data;
    mistakes = mistakesResponse.data;
  } catch {
    strategies = [];
    tags = [];
    mistakes = [];
  }

  return (
    <StrategiesManager
      initialStrategies={strategies}
      initialTags={tags}
      initialMistakes={mistakes}
    />
  );
}
