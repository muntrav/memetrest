import { ApiError, validationError } from "@/lib/shared/api-error";
import { boardsRepository } from "@/lib/boards/repository";
import type {
  Board,
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
  }
};
