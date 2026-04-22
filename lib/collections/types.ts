export const collectionFilters = ["all", "recent", "private", "organized"] as const;

export type CollectionFilter = (typeof collectionFilters)[number];
export type CollectionVisibility = "public" | "private";

export type CollectionBoard = {
  id: string;
  title: string;
  itemCount: number;
  previewImages: string[];
  visibility: CollectionVisibility;
  tags: string[];
  updatedAt: string;
};

export type CollectionsStore = {
  boards: CollectionBoard[];
};

export type CollectionsSummary = {
  boardCount: number;
  totalItemCount: number;
  privateBoardCount: number;
  taggedBoardPercentage: number;
};

export type CollectionsSnapshot = {
  boards: CollectionBoard[];
  summary: CollectionsSummary;
  filter: CollectionFilter;
};

export type CreateBoardInput = {
  title: string;
  visibility?: CollectionVisibility;
};

export function isCollectionFilter(value: string): value is CollectionFilter {
  return collectionFilters.includes(value as CollectionFilter);
}

export function normalizeCollectionFilter(
  value: string | string[] | undefined
): CollectionFilter {
  const normalized = Array.isArray(value) ? value[0] : value;
  return normalized && isCollectionFilter(normalized) ? normalized : "all";
}
