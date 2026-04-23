import React from "react";
import Link from "next/link";
import { DesktopPageShell } from "@/components/navigation/desktop-page-shell";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { AppImage } from "@/components/ui/app-image";
import { MaterialIcon } from "@/components/ui/material-icon";
import type { ViewerSummary } from "@/lib/auth/viewer";
import { buildAuthHref } from "@/lib/auth/navigation";
import type {
  FeedCardViewModel,
  SearchCreatorViewModel,
  SearchTagViewModel
} from "@/lib/posts/presentation";
import { routes } from "@/lib/routes";

type SearchTab = "memes" | "creators" | "tags";

const searchTabs: ReadonlyArray<{ key: SearchTab; label: string }> = [
  { key: "memes", label: "Memes" },
  { key: "creators", label: "Creators" },
  { key: "tags", label: "Tags" }
];

type SearchDiscoveryScreenProps = {
  query: string;
  activeTab: SearchTab;
  hasSearchQuery: boolean;
  trendingItems: FeedCardViewModel[];
  memeResults: FeedCardViewModel[];
  creatorResults: SearchCreatorViewModel[];
  tagResults: SearchTagViewModel[];
  viewer?: ViewerSummary | null;
};

function tabHref(tab: SearchTab, query: string) {
  if (!query && tab === "memes") {
    return {
      pathname: routes.search
    };
  }

  return {
    pathname: routes.search,
    query: {
      q: query,
      tab
    }
  };
}

function renderMemeGrid(cards: FeedCardViewModel[], emptyLabel: string) {
  if (cards.length === 0) {
    return (
      <div className="rounded-[24px] border border-dashed border-outline-variant/40 bg-background/60 px-6 py-12 text-center">
        <p className="text-lg font-bold text-on-surface">{emptyLabel}</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-on-surface-variant">
          Seed content, upload memes, or broaden the search query to populate this surface.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {cards.map((card, index) => (
        <Link
          className={[
            "relative overflow-hidden rounded-[24px] bg-white shadow-[0_8px_32px_rgba(168,85,247,0.06)] transition-transform duration-300 hover:scale-[1.02]",
            index === 0 ? "md:col-span-2" : ""
          ].join(" ")}
          href={card.href}
          key={card.id}
          style={{ aspectRatio: card.aspectRatio }}
        >
          <AppImage
            alt={card.imageAlt}
            className="h-full w-full object-cover"
            sizes="(max-width: 1536px) 50vw, 33vw"
            src={card.imageUrl}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-sm">
            <p className="truncate font-label-sm text-white">{card.headline}</p>
            <p className="truncate text-[11px] text-white/75">{card.creatorUsername}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function renderCreatorList(creators: SearchCreatorViewModel[]) {
  if (creators.length === 0) {
    return (
      <div className="rounded-[24px] border border-dashed border-outline-variant/40 bg-background/60 px-6 py-12 text-center">
        <p className="text-lg font-bold text-on-surface">No creators matched</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-on-surface-variant">
          Try a username, display name, or switch back to meme results.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {creators.map((creator) => (
        <Link
          className="flex items-center justify-between rounded-[24px] bg-white/90 p-5 shadow-[0_8px_32px_rgba(168,85,247,0.06)] transition-transform hover:scale-[1.01]"
          href={creator.href}
          key={creator.id}
        >
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 overflow-hidden rounded-full bg-surface-container-high">
              {creator.avatarUrl ? (
                <AppImage
                  alt={creator.displayName}
                  className="h-full w-full object-cover"
                  height={56}
                  src={creator.avatarUrl}
                  width={56}
                />
              ) : null}
            </div>
            <div>
              <p className="font-headline-md text-on-surface">{creator.displayName}</p>
              <p className="text-sm text-on-surface-variant">{creator.username}</p>
            </div>
          </div>
          <MaterialIcon className="text-primary">north_east</MaterialIcon>
        </Link>
      ))}
    </div>
  );
}

function renderTagList(tags: SearchTagViewModel[]) {
  if (tags.length === 0) {
    return (
      <div className="rounded-[24px] border border-dashed border-outline-variant/40 bg-background/60 px-6 py-12 text-center">
        <p className="text-lg font-bold text-on-surface">No tags matched</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-on-surface-variant">
          Try a shorter keyword or switch to meme search.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {tags.map((tag) => (
        <Link
          className="rounded-[24px] bg-white/90 p-5 shadow-[0_8px_32px_rgba(168,85,247,0.06)] transition-transform hover:scale-[1.01]"
          href={tag.href}
          key={tag.id}
        >
          <p className="font-headline-md text-on-surface">{tag.label}</p>
          <p className="mt-1 text-sm text-on-surface-variant">{tag.postCountLabel}</p>
        </Link>
      ))}
    </div>
  );
}

export function SearchDiscoveryScreen({
  query,
  activeTab,
  hasSearchQuery,
  trendingItems,
  memeResults,
  creatorResults,
  tagResults,
  viewer = null
}: SearchDiscoveryScreenProps) {
  const title = hasSearchQuery ? `Results for "${query}"` : "Explore Ideas";
  const subtitle = hasSearchQuery
    ? "Live search results from the browse API."
    : "Fresh posts and trends from the live feed.";

  return (
    <div className="min-h-screen bg-background font-body-md text-on-background">
      <DesktopPageShell
        active="explore"
        description="Find memes by trend, tag, or creator without carrying the mobile navigation chrome into the desktop view."
        title="Search Discovery"
        viewer={viewer}
        toolbar={
          <Link
            className={[
              "flex items-center justify-center overflow-hidden",
              viewer
                ? "h-12 w-12 rounded-full border-2 border-primary/20"
                : "rounded-full border border-outline-variant/40 px-4 py-3 text-sm font-semibold text-on-surface"
            ].join(" ")}
            href={viewer ? routes.profile : buildAuthHref(routes.login, routes.search)}
          >
            {viewer ? <span className="sr-only">Open profile</span> : "Sign in"}
          </Link>
        }
      >
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-6">
            <section className="rounded-[28px] border border-white/30 bg-white/75 p-6 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl">
              <form action={routes.search} className="group relative block">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400">
                  <MaterialIcon>search</MaterialIcon>
                </div>
                <input
                  className="block w-full rounded-full bg-background py-4 pl-12 pr-4 text-on-surface shadow-sm outline-none ring-2 ring-transparent transition-colors focus:ring-primary"
                  defaultValue={query}
                  name="q"
                  placeholder="Search memes, stickers, or chaos..."
                  type="search"
                />
                <input name="tab" type="hidden" value={activeTab} />
              </form>
              <div className="mt-6 flex flex-wrap gap-2">
                {searchTabs.map((tab) => (
                  <Link
                    className={[
                      "rounded-full px-md py-xs font-label-sm transition-colors",
                      tab.key === activeTab
                        ? "bg-primary-container text-on-primary-container shadow-sm"
                        : "border border-outline-variant/30 bg-surface-container text-on-surface-variant"
                    ].join(" ")}
                    href={tabHref(tab.key, query)}
                    key={tab.key}
                  >
                    {tab.label}
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-white/30 bg-white/75 p-6 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-base font-headline-md text-on-surface">
                  <MaterialIcon className="text-primary">trending_up</MaterialIcon>
                  Trending
                </h2>
                <Link className="font-label-sm text-primary" href={tabHref("memes", "")}>
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {trendingItems.length > 0 ? (
                  trendingItems.slice(0, 5).map((item, index) => (
                    <Link
                      className="group flex items-center justify-between rounded-2xl bg-background/70 p-4 transition-all hover:bg-white"
                      href={item.href}
                      key={item.id}
                    >
                      <div className="flex min-w-0 items-center gap-sm">
                        <span className="text-xl font-bold text-primary/40">{`0${index + 1}`}</span>
                        <div className="min-w-0">
                          <span className="block truncate font-body-lg font-bold">
                            {item.headline}
                          </span>
                          <span className="block truncate text-xs text-on-surface-variant">
                            {item.creatorUsername}
                          </span>
                        </div>
                      </div>
                      <MaterialIcon className="text-zinc-300 transition-colors group-hover:text-primary">
                        north_east
                      </MaterialIcon>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-2xl bg-background/70 p-4 text-sm text-on-surface-variant">
                    Trending will populate as soon as the first published memes exist.
                  </div>
                )}
              </div>
            </section>
          </div>

          <section className="rounded-[28px] border border-white/30 bg-white/75 p-6 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-headline-md text-on-surface">{title}</h2>
              <span className="text-sm text-on-surface-variant">{subtitle}</span>
            </div>
            {activeTab === "creators"
              ? renderCreatorList(creatorResults)
              : activeTab === "tags"
                ? renderTagList(tagResults)
                : renderMemeGrid(
                    memeResults,
                    hasSearchQuery ? "No memes matched that search." : "No live memes yet."
                  )}
          </section>
        </div>
      </DesktopPageShell>

      <nav className="sticky top-0 z-50 border-b border-white/20 bg-white/80 shadow-[0_8px_32px_rgba(168,85,247,0.08)] backdrop-blur-xl md:hidden">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link className="text-purple-600" href={routes.search}>
              <MaterialIcon>search</MaterialIcon>
            </Link>
            <Link href={routes.home}>
              <span className="bg-clip-text text-lg font-bold tracking-tight text-purple-600">
                Memetrest
              </span>
            </Link>
          </div>
          <Link
            className={[
              "flex items-center justify-center overflow-hidden",
              viewer
                ? "h-10 w-10 rounded-full border-2 border-primary/20"
                : "rounded-full border border-outline-variant/40 px-3 py-2 text-xs font-semibold text-on-surface"
            ].join(" ")}
            href={viewer ? routes.profile : buildAuthHref(routes.login, routes.search)}
          >
            {viewer ? <span className="sr-only">Open profile</span> : "Sign in"}
          </Link>
        </div>
      </nav>

      <main className="pb-24 md:hidden">
        <section className="px-margin-mobile pb-gutter pt-sm">
          <form action={routes.search} className="group relative block">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400">
              <MaterialIcon>search</MaterialIcon>
            </div>
            <input
              className="block w-full rounded-full bg-white py-4 pl-12 pr-4 text-on-surface shadow-sm"
              defaultValue={query}
              name="q"
              placeholder="Search memes, stickers, or chaos..."
              type="search"
            />
            <input name="tab" type="hidden" value={activeTab} />
          </form>
        </section>

        <section className="mb-gutter flex gap-base overflow-x-auto whitespace-nowrap px-margin-mobile hide-scrollbar">
          {searchTabs.map((tab) => (
            <Link
              className={[
                "rounded-full px-md py-xs font-label-sm transition-colors",
                tab.key === activeTab
                  ? "scale-105 bg-primary-container text-on-primary-container shadow-sm"
                  : "border border-outline-variant/30 bg-surface-container text-on-surface-variant hover:bg-white"
              ].join(" ")}
              href={tabHref(tab.key, query)}
              key={tab.key}
            >
              {tab.label}
            </Link>
          ))}
        </section>

        <section className="mb-lg px-margin-mobile">
          <div className="mb-sm flex items-center justify-between">
            <h2 className="flex items-center gap-base font-headline-md text-on-surface">
              <MaterialIcon className="text-primary">trending_up</MaterialIcon>
              Trending
            </h2>
            <Link className="font-label-sm text-primary" href={tabHref("memes", "")}>
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-base">
            {trendingItems.length > 0 ? (
              trendingItems.slice(0, 4).map((item, index) => (
                <Link
                  className="group flex items-center justify-between rounded-xl bg-white/40 p-sm backdrop-blur-sm transition-all hover:bg-white"
                  href={item.href}
                  key={item.id}
                >
                  <div className="flex min-w-0 items-center gap-sm">
                    <span className="text-xl font-bold text-primary/40">{`0${index + 1}`}</span>
                    <div className="min-w-0">
                      <span className="block truncate font-body-lg font-bold">{item.headline}</span>
                      <span className="block truncate text-xs text-on-surface-variant">
                        {item.creatorUsername}
                      </span>
                    </div>
                  </div>
                  <MaterialIcon className="text-zinc-300 transition-colors group-hover:text-primary">
                    north_east
                  </MaterialIcon>
                </Link>
              ))
            ) : (
              <div className="rounded-xl bg-white/40 p-sm text-sm text-on-surface-variant backdrop-blur-sm">
                Trending content will appear here after the first published uploads land.
              </div>
            )}
          </div>
        </section>

        <section className="px-margin-mobile">
          <h2 className="mb-sm font-headline-md text-on-surface">{title}</h2>
          {activeTab === "creators"
            ? renderCreatorList(creatorResults)
            : activeTab === "tags"
              ? renderTagList(tagResults)
              : renderMemeGrid(
                  memeResults,
                  hasSearchQuery ? "No memes matched that search." : "No live memes yet."
                )}
        </section>
      </main>

      <MobileBottomNav active="explore" asFooter className="md:hidden" />
    </div>
  );
}
