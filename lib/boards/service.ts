import { ApiError, validationError } from "@/lib/shared/api-error";
import { boardsRepository } from "@/lib/boards/repository";
import { postsService } from "@/lib/posts/service";
import type {
  Board,
  BoardItem,
  BoardDetail,
  CreateBoardInput,
  UpdateBoardInput
} from "@/lib/boards/types";

function mapUnknownBoardError(error: unknown): never {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code?: string }).code === "BOARD_SLUG_TAKEN"
  ) {
    throw validationError("Slug already exists.", { field: "slug" });
  }

  throw error;
}

export const boardsService = {
  async listOwnBoards(userId: string): Promise<Board[]> {
    return boardsRepository.listOwnBoards(userId);
  },

  async createBoard(userId: string, input: CreateBoardInput): Promise<BoardDetail> {
    try {
      return await boardsRepository.createBoard(userId, input);
    } catch (error) {
      return mapUnknownBoardError(error);
    }
  },

  async updateBoard(
    userId: string,
    boardId: string,
    input: UpdateBoardInput
  ): Promise<BoardDetail> {
    try {
      const board = await boardsRepository.updateBoard(userId, boardId, input);

      if (board === "forbidden") {
        throw new ApiError(403, "FORBIDDEN", "You do not own this board.");
      }

      if (!board) {
        throw new ApiError(404, "NOT_FOUND", "Board not found.");
      }

      return board;
    } catch (error) {
      return mapUnknownBoardError(error);
    }
  },

  async reorderBoards(userId: string, boardIds: string[]): Promise<void> {
    const result = await boardsRepository.reorderBoards(userId, boardIds);

    if (result === "forbidden") {
      throw validationError("boardIds must contain all and only the viewer's boards.", {
        field: "boardIds"
      });
    }
  },

  async deleteBoard(userId: string, boardId: string): Promise<void> {
    const result = await boardsRepository.deleteBoard(userId, boardId);

    if (result === "forbidden") {
      throw new ApiError(403, "FORBIDDEN", "You do not own this board.");
    }

    if (result === "not_found") {
      throw new ApiError(404, "NOT_FOUND", "Board not found.");
    }
  },

  async getBoardDetail(
    boardIdOrSlug: string,
    viewerUserId?: string
  ): Promise<BoardDetail> {
    const board = await boardsRepository.findBoardDetail(boardIdOrSlug, viewerUserId);

    if (board === "forbidden") {
      throw new ApiError(403, "PRIVACY_RESTRICTED", "This board is private.");
    }

    if (!board) {
      throw new ApiError(404, "NOT_FOUND", "Board not found.");
    }

    return board;
  },

  async savePostToBoard(
    userId: string,
    boardId: string,
    postId: string
  ): Promise<BoardItem> {
    const post = await postsService.getPostDetail(postId, userId);
    const result = await boardsRepository.saveBoardItem(userId, boardId, postId);

    if (result === "forbidden") {
      throw new ApiError(403, "FORBIDDEN", "You do not own this board.");
    }

    if (result === "not_found") {
      throw new ApiError(404, "NOT_FOUND", "Board not found.");
    }

    if (result === "exists") {
      throw new ApiError(409, "BOARD_ITEM_EXISTS", "This post is already saved to the board.");
    }

    return {
      postId: result.post_id,
      position: result.position,
      savedAt: result.saved_at.toISOString(),
      post: {
        id: post.id,
        caption: post.caption,
        overlayTextTop: post.overlayTextTop,
        overlayTextBottom: post.overlayTextBottom,
        visibility: post.visibility,
        createdAt: post.createdAt,
        creator: post.creator,
        asset: post.asset,
        tags: post.tags,
        metrics: post.metrics
      }
    };
  },

  async removePostFromBoard(userId: string, boardId: string, postId: string): Promise<void> {
    const result = await boardsRepository.removeBoardItem(userId, boardId, postId);

    if (result === "forbidden") {
      throw new ApiError(403, "FORBIDDEN", "You do not own this board.");
    }

    if (result === "not_found") {
      throw new ApiError(404, "NOT_FOUND", "Board item not found.");
    }
  }
};
