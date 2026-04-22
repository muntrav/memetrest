import type { Metadata } from "next";
import { CollectionsScreen } from "@/components/screens/collections-screen";
import { listCachedBoards } from "@/lib/collections/cache";
import { normalizeCollectionFilter } from "@/lib/collections/types";

export const metadata: Metadata = {
  title: "Memetrest - Collections"
};

type CollectionsPageProps = {
  searchParams: Promise<{
    filter?: string | string[];
  }>;
};

export default async function CollectionsPage({ searchParams }: CollectionsPageProps) {
  const resolvedSearchParams = await searchParams;
  const filter = normalizeCollectionFilter(resolvedSearchParams.filter);
  const snapshot = await listCachedBoards(filter);

  return <CollectionsScreen boards={snapshot.boards} filter={snapshot.filter} summary={snapshot.summary} />;
}
