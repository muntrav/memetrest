import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import defaultCollectionsStore from "@/data/collections.json";
import type {
  CollectionBoard,
  CollectionFilter,
  CollectionsSnapshot,
  CollectionsStore,
  CollectionsSummary,
  CreateBoardInput
} from "@/lib/collections/types";

const defaultStoragePath = path.join(process.cwd(), "data", "collections.json");
const fallbackPreviewImages = defaultCollectionsStore.boards[0]?.previewImages ?? [];

export class CollectionsValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CollectionsValidationError";
  }
}

function cloneStore(store: CollectionsStore): CollectionsStore {
  return {
    boards: store.boards.map((board) => ({
      ...board,
      previewImages: [...board.previewImages],
      tags: [...board.tags]
    }))
  };
}

function assertCollectionsStore(value: unknown): CollectionsStore {
  if (!value || typeof value !== "object" || !Array.isArray((value as CollectionsStore).boards)) {
    throw new CollectionsValidationError("Collections store is malformed.");
  }

  const boards = (value as CollectionsStore).boards.map((board) => {
    if (
      !board ||
      typeof board !== "object" ||
      typeof board.id !== "string" ||
      typeof board.title !== "string" ||
      typeof board.itemCount !== "number" ||
      !Array.isArray(board.previewImages) ||
      (board.visibility !== "public" && board.visibility !== "private") ||
      !Array.isArray(board.tags) ||
      typeof board.updatedAt !== "string"
    ) {
      throw new CollectionsValidationError("Collections store contains an invalid board.");
    }

    return {
      ...board,
      previewImages: board.previewImages.filter((image): image is string => typeof image === "string"),
      tags: board.tags.filter((tag): tag is string => typeof tag === "string")
    };
  });

  return { boards };
}

function summarizeBoards(boards: CollectionBoard[]): CollectionsSummary {
  const boardCount = boards.length;
  const totalItemCount = boards.reduce((sum, board) => sum + board.itemCount, 0);
  const privateBoardCount = boards.filter((board) => board.visibility === "private").length;
  const taggedBoardCount = boards.filter((board) => board.tags.length > 0).length;

  return {
    boardCount,
    totalItemCount,
    privateBoardCount,
    taggedBoardPercentage: boardCount === 0 ? 0 : Math.round((taggedBoardCount / boardCount) * 100)
  };
}

function selectBoards(boards: CollectionBoard[], filter: CollectionFilter): CollectionBoard[] {
  const sortedBoards = [...boards].sort((left, right) => {
    return Date.parse(right.updatedAt) - Date.parse(left.updatedAt);
  });

  switch (filter) {
    case "recent":
      return sortedBoards;
    case "private":
      return sortedBoards.filter((board) => board.visibility === "private");
    case "organized":
      return sortedBoards.filter((board) => board.tags.length > 0);
    case "all":
    default:
      return boards;
  }
}

export function createCollectionsRepository(storagePath = defaultStoragePath) {
  async function readStore(): Promise<CollectionsStore> {
    try {
      const raw = await readFile(storagePath, "utf8");
      return assertCollectionsStore(JSON.parse(raw));
    } catch (error) {
      const isMissingFile =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "ENOENT";

      if (isMissingFile) {
        const initialStore = cloneStore(defaultCollectionsStore as CollectionsStore);
        await writeStore(initialStore);
        return initialStore;
      }

      throw error;
    }
  }

  async function writeStore(store: CollectionsStore) {
    await mkdir(path.dirname(storagePath), { recursive: true });
    await writeFile(storagePath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
  }

  return {
    async listBoards(filter: CollectionFilter = "all"): Promise<CollectionsSnapshot> {
      const store = await readStore();
      return {
        boards: selectBoards(store.boards, filter),
        summary: summarizeBoards(store.boards),
        filter
      };
    },
    async createBoard(input: CreateBoardInput): Promise<CollectionBoard> {
      const title = input.title.trim();

      if (title.length < 2) {
        throw new CollectionsValidationError("Board title must be at least 2 characters long.");
      }

      if (title.length > 60) {
        throw new CollectionsValidationError("Board title must be 60 characters or fewer.");
      }

      const store = await readStore();
      const board: CollectionBoard = {
        id: crypto.randomUUID(),
        title,
        itemCount: 0,
        previewImages: fallbackPreviewImages.slice(0, 3),
        visibility: input.visibility ?? "public",
        tags: [],
        updatedAt: new Date().toISOString()
      };

      store.boards.unshift(board);
      await writeStore(store);

      return board;
    }
  };
}

export const collectionsRepository = createCollectionsRepository();
