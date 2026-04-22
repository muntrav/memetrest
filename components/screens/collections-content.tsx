import { CollectionsScreen } from "@/components/screens/collections-screen";
import { listCachedBoards } from "@/lib/collections/cache";
import { normalizeCollectionFilter } from "@/lib/collections/types";

type CollectionsContentProps = {
  filterQuery?: string | string[];
};

export async function CollectionsContent({ filterQuery }: CollectionsContentProps) {
  const filter = normalizeCollectionFilter(filterQuery);
  const snapshot = await listCachedBoards(filter);

  return (
    <CollectionsScreen
      boards={snapshot.boards}
      filter={snapshot.filter}
      summary={snapshot.summary}
    />
  );
}
