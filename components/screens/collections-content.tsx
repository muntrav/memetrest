import { CollectionsScreen } from "@/components/screens/collections-screen";
import { getOptionalServerSession } from "@/lib/auth/server-session";
import { toViewerSummary } from "@/lib/auth/viewer";
import { getCollectionsSnapshotForViewer } from "@/lib/collections/snapshot";
import { normalizeCollectionFilter } from "@/lib/collections/types";

type CollectionsContentProps = {
  filterQuery?: string | string[];
};

export async function CollectionsContent({ filterQuery }: CollectionsContentProps) {
  const filter = normalizeCollectionFilter(filterQuery);
  const [authSession, snapshot] = await Promise.all([
    getOptionalServerSession(),
    getCollectionsSnapshotForViewer(filter)
  ]);

  return (
    <CollectionsScreen
      boards={snapshot.boards}
      filter={snapshot.filter}
      summary={snapshot.summary}
      viewer={toViewerSummary(authSession)}
    />
  );
}
