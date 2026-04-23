export type PostVisibility = "public" | "private";
export type FeedMode = "for_you" | "following" | "latest" | "trending";
export type SearchTab = "memes" | "creators" | "tags";

export type PublicCreator = {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
};

export type PageInfo = {
  nextCursor: string | null;
  hasNextPage: boolean;
};

export type PostAsset = {
  url: string;
  width: number;
  height: number;
  mimeType: string;
  blurDataUrl: string | null;
};

export type PostMetrics = {
  saveCount: number;
};

export type PostSummary = {
  id: string;
  caption: string;
  overlayTextTop: string | null;
  overlayTextBottom: string | null;
  visibility: PostVisibility;
  createdAt: string;
  creator: PublicCreator;
  asset: PostAsset;
  tags: string[];
  metrics: PostMetrics;
};

export type PostDetail = PostSummary & {
  boardSaveState: {
    savedBoardIds: string[];
  };
  moderation: {
    status: "active" | "removed";
    reason: string | null;
  };
};

export type SearchTag = {
  tag: string;
  postCount: number;
};

export type SearchCreatorsResponse = {
  tab: "creators";
  items: PublicCreator[];
  pageInfo: PageInfo;
};

export type SearchTagsResponse = {
  tab: "tags";
  items: SearchTag[];
  pageInfo: PageInfo;
};

export type SearchMemesResponse = {
  tab: "memes";
  items: PostSummary[];
  pageInfo: PageInfo;
};
