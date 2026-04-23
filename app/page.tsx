import { HomeFeedMobileScreen } from "@/components/screens/home-feed-mobile-screen";
import { HomeFeedWebScreen } from "@/components/screens/home-feed-web-screen";
import { getOptionalServerSession } from "@/lib/auth/server-session";
import { toViewerSummary } from "@/lib/auth/viewer";
import {
  mapPostsToFeedCards,
  type FeedCardViewModel,
  type FeedLaneViewModel
} from "@/lib/posts/presentation";
import { postsService } from "@/lib/posts/service";

export const dynamic = "force-dynamic";

function dedupeCards(cards: FeedCardViewModel[]): FeedCardViewModel[] {
  return [...new Map(cards.map((card) => [card.id, card])).values()];
}

function buildTagLanes(cards: FeedCardViewModel[]): FeedLaneViewModel[] {
  const tagCounts = new Map<string, number>();

  cards.forEach((card) => {
    card.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    });
  });

  return [...tagCounts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 4)
    .map(([tag]) => ({
      key: `tag:${tag}`,
      label: `#${tag}`,
      cards: cards.filter((card) => card.tags.includes(tag))
    }))
    .filter((lane) => lane.cards.length > 0);
}

async function buildHomeFeedLanes(viewerUserId?: string): Promise<FeedLaneViewModel[]> {
  const [latestFeed, trendingFeed, followingFeed] = await Promise.all([
    postsService.getFeed({
      viewerUserId,
      mode: "latest",
      limit: 24
    }),
    postsService.getFeed({
      viewerUserId,
      mode: "trending",
      limit: 24
    }),
    postsService.getFeed({
      viewerUserId,
      mode: viewerUserId ? "following" : "for_you",
      limit: 24
    })
  ]);

  const latestCards = mapPostsToFeedCards(latestFeed.items);
  const trendingCards = mapPostsToFeedCards(trendingFeed.items);
  const personalizedCards = mapPostsToFeedCards(followingFeed.items);
  const allCards = dedupeCards([...latestCards, ...trendingCards, ...personalizedCards]);

  const lanes: FeedLaneViewModel[] = [
    {
      key: "all",
      label: "All Memes",
      cards: latestCards
    },
    {
      key: "trending",
      label: "Trending",
      cards: trendingCards
    },
    {
      key: viewerUserId ? "following" : "for_you",
      label: viewerUserId ? "Following" : "For You",
      cards: personalizedCards
    },
    ...buildTagLanes(allCards)
  ];

  return lanes.filter((lane, index) => index === 0 || lane.cards.length > 0);
}

export default async function HomePage() {
  const authSession = await getOptionalServerSession();
  const feedLanes = await buildHomeFeedLanes(authSession?.user.id);
  const viewer = toViewerSummary(authSession);

  return (
    <>
      <div className="hidden md:block">
        <HomeFeedWebScreen lanes={feedLanes} viewer={viewer} />
      </div>
      <div className="md:hidden">
        <HomeFeedMobileScreen lanes={feedLanes} viewer={viewer} />
      </div>
    </>
  );
}
