import { cookies } from "next/headers";
import { authRepository } from "@/lib/auth/repository";
import { hashOpaqueToken, sessionCookieName } from "@/lib/auth/session";
import { boardsRepository } from "@/lib/boards/repository";
import type { Board } from "@/lib/boards/types";
import type {
  CollectionBoard,
  CollectionFilter,
  CollectionsSnapshot,
  CollectionsSummary
} from "@/lib/collections/types";

const fallbackPreviewImages = [
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80"
];

function summarizeBoards(boards: CollectionBoard[]): CollectionsSummary {
  const boardCount = boards.length;
  const totalItemCount = boards.reduce((sum, board) => sum + board.itemCount, 0);
  const privateBoardCount = boards.filter((board) => board.visibility === "private").length;

  return {
    boardCount,
    totalItemCount,
    privateBoardCount,
    taggedBoardPercentage: 0
  };
}

function selectBoards(boards: CollectionBoard[], filter: CollectionFilter): CollectionBoard[] {
  switch (filter) {
    case "recent":
      return [...boards].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
    case "private":
      return boards.filter((board) => board.visibility === "private");
    case "organized":
      return [];
    case "all":
    default:
      return boards;
  }
}

function mapBoardToCollectionBoard(board: Board, previewImages: string[]): CollectionBoard {
  return {
    id: board.id,
    slug: board.slug,
    title: board.name,
    itemCount: board.itemCount,
    previewImages: previewImages.length > 0 ? previewImages : fallbackPreviewImages,
    visibility: board.visibility,
    tags: [],
    updatedAt: board.updatedAt
  };
}

export async function getCollectionsSnapshotForViewer(
  filter: CollectionFilter
): Promise<CollectionsSnapshot> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(sessionCookieName())?.value;

  if (!rawToken) {
    return {
      boards: selectBoards([], filter),
      summary: summarizeBoards([]),
      filter
    };
  }

  const authSession = await authRepository.findAuthSessionByTokenHash(hashOpaqueToken(rawToken));

  if (!authSession) {
    return {
      boards: selectBoards([], filter),
      summary: summarizeBoards([]),
      filter
    };
  }

  const [boards, previews] = await Promise.all([
    boardsRepository.listOwnBoards(authSession.user.id),
    boardsRepository.listOwnBoardPreviewImages(authSession.user.id)
  ]);
  const collectionBoards = boards.map((board) =>
    mapBoardToCollectionBoard(board, previews.get(board.id) ?? [])
  );

  return {
    boards: selectBoards(collectionBoards, filter),
    summary: summarizeBoards(collectionBoards),
    filter
  };
}
