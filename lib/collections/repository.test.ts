import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createCollectionsRepository } from "@/lib/collections/repository";
import type { CollectionsStore } from "@/lib/collections/types";

const seedStore: CollectionsStore = {
  boards: [
    {
      id: "board-a",
      title: "Board A",
      itemCount: 3,
      previewImages: ["https://example.com/a.jpg"],
      visibility: "public",
      tags: ["tagged"],
      updatedAt: "2026-04-21T10:00:00.000Z"
    },
    {
      id: "board-b",
      title: "Board B",
      itemCount: 5,
      previewImages: ["https://example.com/b.jpg"],
      visibility: "private",
      tags: [],
      updatedAt: "2026-04-22T08:00:00.000Z"
    }
  ]
};

async function createTestRepository() {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "memetrest-collections-"));
  const storagePath = path.join(tempDir, "collections.json");
  await writeFile(storagePath, `${JSON.stringify(seedStore, null, 2)}\n`, "utf8");

  return {
    repository: createCollectionsRepository(storagePath),
    storagePath
  };
}

describe("collectionsRepository", () => {
  it("returns filtered boards and summary details", async () => {
    const { repository } = await createTestRepository();

    const privateBoards = await repository.listBoards("private");

    expect(privateBoards.boards).toHaveLength(1);
    expect(privateBoards.boards[0]?.title).toBe("Board B");
    expect(privateBoards.summary).toEqual({
      boardCount: 2,
      totalItemCount: 8,
      privateBoardCount: 1,
      taggedBoardPercentage: 50
    });
  });

  it("creates a board and persists it to storage", async () => {
    const { repository, storagePath } = await createTestRepository();

    const createdBoard = await repository.createBoard({
      title: " Reaction Vault ",
      visibility: "private"
    });

    expect(createdBoard.title).toBe("Reaction Vault");
    expect(createdBoard.visibility).toBe("private");
    expect(createdBoard.itemCount).toBe(0);

    const rawStore = await readFile(storagePath, "utf8");
    const parsedStore = JSON.parse(rawStore) as CollectionsStore;

    expect(parsedStore.boards[0]?.title).toBe("Reaction Vault");
    expect(parsedStore.boards).toHaveLength(3);
  });
});
