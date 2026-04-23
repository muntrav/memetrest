import type { Metadata } from "next";
import { MemeDetailViewScreen } from "@/components/screens/meme-detail-view-screen";
import { authRepository } from "@/lib/auth/repository";
import { getOptionalServerSession } from "@/lib/auth/server-session";
import { toViewerSummary } from "@/lib/auth/viewer";
import {
  mapPostDetailToFeedCard,
  mapPostsToFeedCards
} from "@/lib/posts/presentation";
import { postsService } from "@/lib/posts/service";
import { ApiError } from "@/lib/shared/api-error";

export const metadata: Metadata = {
  title: "Memetrest - Meme Detail"
};

export const dynamic = "force-dynamic";

type MemeDetailViewPageProps = {
  searchParams?: Promise<{
    post?: string | string[];
  }>;
};

function normalizePostId(value?: string | string[]): string | null {
  const normalized = Array.isArray(value) ? value[0] : value;
  return normalized?.trim() || null;
}

export default async function MemeDetailViewPage({
  searchParams
}: MemeDetailViewPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const requestedPostId = normalizePostId(resolvedSearchParams.post);
  const authSession = await getOptionalServerSession();
  const viewerUserId = authSession?.user.id;

  let detail = null;
  let statusTitle: string | null = null;
  let statusDescription: string | null = null;

  if (requestedPostId) {
    try {
      detail = await postsService.getPostDetail(requestedPostId, viewerUserId);
    } catch (error) {
      if (error instanceof ApiError && (error.status === 403 || error.status === 404)) {
        statusTitle =
          error.status === 403 ? "This meme is not available to you" : "That meme could not be found";
        statusDescription = error.message;
      } else {
        throw error;
      }
    }
  }

  if (!detail) {
    const fallbackFeed = await postsService.getFeed({
      viewerUserId,
      mode: "latest",
      limit: 5
    });

    if (fallbackFeed.items[0]) {
      detail = await postsService.getPostDetail(fallbackFeed.items[0].id, viewerUserId);
      if (!requestedPostId) {
        statusTitle = "Live detail preview";
        statusDescription = "Pick any meme from the feed to jump straight into its full detail view.";
      }
    }
  }

  const creatorProfile =
    detail ? await authRepository.findProfileByUsername(detail.creator.username) : null;
  const relatedFeed = await postsService.getFeed({
    viewerUserId,
    mode: "trending",
    limit: 8
  });
  const relatedItems = mapPostsToFeedCards(relatedFeed.items).filter(
    (item) => item.id !== detail?.id
  );

  return (
    <MemeDetailViewScreen
      post={
        detail
          ? {
              ...mapPostDetailToFeedCard(detail),
              savedBoardCount: detail.boardSaveState.savedBoardIds.length,
              savedBoardIds: detail.boardSaveState.savedBoardIds,
              followerCountLabel: creatorProfile
                ? creatorProfile.followerCount.toLocaleString()
                : null
            }
          : null
      }
      relatedItems={relatedItems.slice(0, 4)}
      statusDescription={statusDescription}
      statusTitle={statusTitle}
      viewer={toViewerSummary(authSession)}
    />
  );
}
