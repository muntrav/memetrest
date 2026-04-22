import { unstable_cache } from "next/cache";
import { collectionsRepository } from "@/lib/collections/repository";
import type { CollectionFilter } from "@/lib/collections/types";

const getCachedCollectionsSnapshot = unstable_cache(
  async (filter: CollectionFilter) => collectionsRepository.listBoards(filter),
  ["collections-snapshot"],
  {
    tags: ["collections"]
  }
);

export async function listCachedBoards(filter: CollectionFilter) {
  return getCachedCollectionsSnapshot(filter);
}
