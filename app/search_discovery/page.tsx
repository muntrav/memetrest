import type { Metadata } from "next";
import { SearchDiscoveryScreen } from "@/components/screens/search-discovery-screen";
import { getOptionalServerSession } from "@/lib/auth/server-session";
import {
  mapCreatorsToSearchResults,
  mapPostsToFeedCards,
  mapTagsToSearchResults
} from "@/lib/posts/presentation";
import { postsService } from "@/lib/posts/service";
import type { SearchTab } from "@/lib/posts/types";

export const metadata: Metadata = {
  title: "Memetrest Search & Discovery"
};

export const dynamic = "force-dynamic";

type SearchDiscoveryPageProps = {
  searchParams?: Promise<{
    q?: string | string[];
    tab?: string | string[];
  }>;
};

function normalizeSearchValue(value?: string | string[]): string {
  return (Array.isArray(value) ? value[0] : value ?? "").trim();
}

function normalizeSearchTab(value?: string | string[]): SearchTab {
  const normalized = Array.isArray(value) ? value[0] : value;

  if (normalized === "creators" || normalized === "tags" || normalized === "memes") {
    return normalized;
  }

  return "memes";
}

export default async function SearchDiscoveryPage({
  searchParams
}: SearchDiscoveryPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const query = normalizeSearchValue(resolvedSearchParams.q);
  const activeTab = normalizeSearchTab(resolvedSearchParams.tab);
  const authSession = await getOptionalServerSession();
  const viewerUserId = authSession?.user.id;

  const [trendingFeed, resultSet] = await Promise.all([
    postsService.getFeed({
      viewerUserId,
      mode: "trending",
      limit: 6
    }),
    query || activeTab !== "memes"
      ? postsService.search({
          viewerUserId,
          tab: activeTab,
          queryText: query,
          limit: 12
        })
      : postsService.getFeed({
          viewerUserId,
          mode: "latest",
          limit: 12
        })
  ]);

  return (
    <SearchDiscoveryScreen
      activeTab={activeTab}
      creatorResults={
        resultSet.tab === "creators" ? mapCreatorsToSearchResults(resultSet.items) : []
      }
      hasSearchQuery={Boolean(query)}
      memeResults={resultSet.tab === "memes" ? mapPostsToFeedCards(resultSet.items) : []}
      query={query}
      tagResults={resultSet.tab === "tags" ? mapTagsToSearchResults(resultSet.items) : []}
      trendingItems={mapPostsToFeedCards(trendingFeed.items)}
    />
  );
}
