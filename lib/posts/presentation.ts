import type { Route } from "next";
import { postDetailHref } from "@/lib/routes";
import type {
  PostAsset,
  PostDetail,
  PostSummary,
  PublicCreator,
  SearchTag
} from "@/lib/posts/types";

type BrowsePostBase = {
  id: string;
  caption: string;
  overlayTextTop: string | null;
  overlayTextBottom: string | null;
  creator: PublicCreator;
  asset: PostAsset;
  tags: string[];
  metrics: {
    saveCount: number;
  };
};

export type FeedCardViewModel = {
  id: string;
  href: ReturnType<typeof postDetailHref>;
  imageUrl: string;
  imageAlt: string;
  aspectRatio: string;
  headline: string;
  supportingText: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatarUrl: string | null;
  tags: string[];
  saveCountLabel: string;
};

export type FeedLaneViewModel = {
  key: string;
  label: string;
  cards: FeedCardViewModel[];
};

export type SearchCreatorViewModel = {
  id: string;
  href: Route;
  displayName: string;
  username: string;
  avatarUrl: string | null;
};

export type SearchTagViewModel = {
  id: string;
  href: Route;
  label: string;
  postCountLabel: string;
};

function formatCompactCount(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(value >= 10000000 ? 0 : 1).replace(/\.0$/, "")}M`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1).replace(/\.0$/, "")}k`;
  }

  return value.toString();
}

function describeCreator(creator: PublicCreator): string {
  return creator.displayName || `@${creator.username}`;
}

function buildHeadline(post: BrowsePostBase): string {
  return (
    post.caption.trim() ||
    post.overlayTextTop?.trim() ||
    post.overlayTextBottom?.trim() ||
    post.tags[0] ||
    `Meme by ${describeCreator(post.creator)}`
  );
}

function buildSupportingText(post: BrowsePostBase): string {
  return (
    post.overlayTextBottom?.trim() ||
    post.overlayTextTop?.trim() ||
    (post.tags.length > 0 ? post.tags.slice(0, 3).map((tag) => `#${tag}`).join(" ") : "") ||
    `Posted by @${post.creator.username}`
  );
}

function buildAltText(post: BrowsePostBase): string {
  const headline = buildHeadline(post);
  return `${headline} by ${describeCreator(post.creator)}`;
}

function buildAspectRatio(asset: PostAsset): string {
  if (asset.width > 0 && asset.height > 0) {
    return `${asset.width} / ${asset.height}`;
  }

  return "4 / 5";
}

function toFeedCard(post: BrowsePostBase): FeedCardViewModel {
  return {
    id: post.id,
    href: postDetailHref(post.id),
    imageUrl: post.asset.url,
    imageAlt: buildAltText(post),
    aspectRatio: buildAspectRatio(post.asset),
    headline: buildHeadline(post),
    supportingText: buildSupportingText(post),
    creatorName: describeCreator(post.creator),
    creatorUsername: `@${post.creator.username}`,
    creatorAvatarUrl: post.creator.avatarUrl,
    tags: post.tags.slice(0, 3),
    saveCountLabel: formatCompactCount(post.metrics.saveCount)
  };
}

export function mapPostsToFeedCards(posts: PostSummary[]): FeedCardViewModel[] {
  return posts.map(toFeedCard);
}

export function mapPostDetailToFeedCard(post: PostDetail): FeedCardViewModel {
  return toFeedCard(post);
}

export function mapCreatorsToSearchResults(
  creators: PublicCreator[]
): SearchCreatorViewModel[] {
  return creators.map((creator) => ({
    id: creator.userId,
    href: `/search_discovery?q=${encodeURIComponent(creator.username)}&tab=memes` as Route,
    displayName: creator.displayName,
    username: `@${creator.username}`,
    avatarUrl: creator.avatarUrl
  }));
}

export function mapTagsToSearchResults(tags: SearchTag[]): SearchTagViewModel[] {
  return tags.map((tag) => ({
    id: tag.tag,
    href: `/search_discovery?q=${encodeURIComponent(tag.tag)}&tab=memes` as Route,
    label: `#${tag.tag}`,
    postCountLabel: `${formatCompactCount(tag.postCount)} posts`
  }));
}
