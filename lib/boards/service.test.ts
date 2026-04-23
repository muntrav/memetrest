import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/shared/api-error";
import { boardsRepository } from "@/lib/boards/repository";
import { boardsService } from "@/lib/boards/service";
import { postsService } from "@/lib/posts/service";

vi.mock("@/lib/boards/repository", () => ({
  boardsRepository: {
    saveBoardItem: vi.fn(),
    removeBoardItem: vi.fn()
  }
}));

vi.mock("@/lib/posts/service", () => ({
  postsService: {
    getPostDetail: vi.fn()
  }
}));

describe("boards service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a board item after saving a post", async () => {
    vi.mocked(postsService.getPostDetail).mockResolvedValue({
      id: "post-1",
      caption: "Saved meme",
      overlayTextTop: null,
      overlayTextBottom: null,
      visibility: "public",
      createdAt: "2026-04-23T12:00:00.000Z",
      creator: {
        userId: "user-1",
        username: "creator",
        displayName: "Creator",
        avatarUrl: null
      },
      asset: {
        url: "https://example.com/meme.png",
        width: 100,
        height: 100,
        mimeType: "image/png",
        blurDataUrl: null
      },
      tags: ["saved"],
      metrics: {
        saveCount: 4
      },
      boardSaveState: {
        savedBoardIds: []
      },
      moderation: {
        status: "active",
        reason: null
      }
    });
    vi.mocked(boardsRepository.saveBoardItem).mockResolvedValue({
      post_id: "post-1",
      position: 2,
      saved_at: new Date("2026-04-23T12:01:00.000Z")
    });

    const item = await boardsService.savePostToBoard("viewer-1", "board-1", "post-1");

    expect(item).toEqual({
      postId: "post-1",
      position: 2,
      savedAt: "2026-04-23T12:01:00.000Z",
      post: {
        id: "post-1",
        caption: "Saved meme",
        overlayTextTop: null,
        overlayTextBottom: null,
        visibility: "public",
        createdAt: "2026-04-23T12:00:00.000Z",
        creator: {
          userId: "user-1",
          username: "creator",
          displayName: "Creator",
          avatarUrl: null
        },
        asset: {
          url: "https://example.com/meme.png",
          width: 100,
          height: 100,
          mimeType: "image/png",
          blurDataUrl: null
        },
        tags: ["saved"],
        metrics: {
          saveCount: 4
        }
      }
    });
  });

  it("maps duplicate saves to BOARD_ITEM_EXISTS", async () => {
    vi.mocked(postsService.getPostDetail).mockResolvedValue({
      id: "post-1",
      caption: "Saved meme",
      overlayTextTop: null,
      overlayTextBottom: null,
      visibility: "public",
      createdAt: "2026-04-23T12:00:00.000Z",
      creator: {
        userId: "user-1",
        username: "creator",
        displayName: "Creator",
        avatarUrl: null
      },
      asset: {
        url: "https://example.com/meme.png",
        width: 100,
        height: 100,
        mimeType: "image/png",
        blurDataUrl: null
      },
      tags: [],
      metrics: { saveCount: 1 },
      boardSaveState: { savedBoardIds: [] },
      moderation: { status: "active", reason: null }
    });
    vi.mocked(boardsRepository.saveBoardItem).mockResolvedValue("exists");

    await expect(boardsService.savePostToBoard("viewer-1", "board-1", "post-1")).rejects.toMatchObject({
      status: 409,
      code: "BOARD_ITEM_EXISTS"
    } satisfies Partial<ApiError>);
  });

  it("maps missing board items on delete to NOT_FOUND", async () => {
    vi.mocked(boardsRepository.removeBoardItem).mockResolvedValue("not_found");

    await expect(boardsService.removePostFromBoard("viewer-1", "board-1", "post-1")).rejects.toMatchObject({
      status: 404,
      code: "NOT_FOUND"
    } satisfies Partial<ApiError>);
  });
});
