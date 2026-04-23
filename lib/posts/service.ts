import { ApiError, validationError } from "@/lib/shared/api-error";
import { postsRepository } from "@/lib/posts/repository";
import type { FeedMode, PostDetail, SearchTab } from "@/lib/posts/types";

function rethrowCursorError(error: unknown): never {
  if (error instanceof Error && error.message.toLowerCase().includes("cursor")) {
    throw validationError("cursor is invalid.", { field: "cursor" });
  }

  throw error;
}

export const postsService = {
  async getFeed(input: {
    viewerUserId?: string;
    mode: FeedMode;
    limit: number;
    cursor?: string;
  }) {
    if (input.mode === "following" && !input.viewerUserId) {
      throw new ApiError(401, "AUTH_REQUIRED", "Authentication is required for following feed.");
    }

    try {
      return await postsRepository.listFeed(input);
    } catch (error) {
      return rethrowCursorError(error);
    }
  },

  async search(input: {
    viewerUserId?: string;
    tab: SearchTab;
    queryText: string;
    limit: number;
    cursor?: string;
  }) {
    try {
      return await postsRepository.search(input);
    } catch (error) {
      return rethrowCursorError(error);
    }
  },

  async getPostDetail(postId: string, viewerUserId?: string): Promise<PostDetail> {
    const post = await postsRepository.findPostDetail(postId, viewerUserId);

    if (!post) {
      const accessState = await postsRepository.probePostAccess(postId, viewerUserId);

      if (accessState === "forbidden") {
        throw new ApiError(403, "PRIVACY_RESTRICTED", "You cannot access this post.");
      }

      throw new ApiError(404, "NOT_FOUND", "Post not found.");
    }

    return post;
  }
};
