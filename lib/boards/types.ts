export type BoardVisibility = "public" | "private";

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

export type Board = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  visibility: BoardVisibility;
  itemCount: number;
  updatedAt: string;
  owner: PublicCreator;
};

export type BoardDetail = Board & {
  items: BoardItem[];
  pageInfo: PageInfo;
  canEdit: boolean;
};

export type BoardItem = {
  postId: string;
  position: number;
  savedAt: string;
  post: {
    id: string;
    caption: string;
    overlayTextTop: string | null;
    overlayTextBottom: string | null;
    visibility: "public" | "private";
    createdAt: string;
    creator: PublicCreator;
    asset: {
      url: string;
      width: number;
      height: number;
      mimeType: string;
      blurDataUrl: string | null;
    };
    tags: string[];
    metrics: {
      saveCount: number;
    };
  };
};

export type CreateBoardInput = {
  name: string;
  description?: string;
  visibility?: BoardVisibility;
};

export type UpdateBoardInput = {
  name?: string;
  description?: string;
  visibility?: BoardVisibility;
  slug?: string;
};
