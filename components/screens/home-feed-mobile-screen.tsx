"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { AppImage } from "@/components/ui/app-image";
import { MaterialIcon } from "@/components/ui/material-icon";
import type { ViewerSummary } from "@/lib/auth/viewer";
import { buildAuthHref } from "@/lib/auth/navigation";
import type { FeedLaneViewModel } from "@/lib/posts/presentation";
import { routes } from "@/lib/routes";

type HomeFeedMobileScreenProps = {
  lanes: FeedLaneViewModel[];
  viewer?: ViewerSummary | null;
};

export function HomeFeedMobileScreen({ lanes, viewer = null }: HomeFeedMobileScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLaneKey, setActiveLaneKey] = useState(lanes[0]?.key ?? "all");

  const activeLane = lanes.find((lane) => lane.key === activeLaneKey) ?? lanes[0] ?? null;
  const filteredCards = useMemo(() => {
    const cards = activeLane?.cards ?? [];
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return cards;
    }

    return cards.filter((card) =>
      [
        card.headline,
        card.supportingText,
        card.creatorName,
        card.creatorUsername,
        ...card.tags
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [activeLane, searchQuery]);

  return (
    <div className="min-h-screen bg-background font-body-md text-on-background selection:bg-primary-fixed md:px-6 md:py-8">
      <div className="relative mx-auto min-h-screen max-w-[430px] bg-background md:min-h-[820px] md:overflow-hidden md:rounded-[32px] md:border md:border-white/40 md:bg-white/70 md:shadow-[0_20px_60px_rgba(129,39,207,0.12)] md:backdrop-blur-xl">
        <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 shadow-[0_8px_32px_rgba(168,85,247,0.08)] backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
            <div className="flex items-center gap-base">
              <Link href={routes.home}>
                <span className="bg-clip-text text-2xl font-black tracking-tighter text-purple-600">
                  Memetrest
                </span>
              </Link>
            </div>
            <div className="flex-1 px-4">
              <div className="group relative flex items-center">
                <MaterialIcon className="absolute left-3 text-zinc-400 transition-colors group-focus-within:text-primary">
                  search
                </MaterialIcon>
                <input
                  type="text"
                  placeholder="Search memes..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="glass-blur h-10 w-full rounded-full bg-surface-container-low pl-10 pr-4 text-on-surface outline-none ring-2 ring-transparent transition-all focus:ring-primary"
                />
              </div>
            </div>
            <Link
              className={[
                "flex items-center justify-center overflow-hidden transition-transform duration-200 hover:scale-105",
                viewer
                  ? "h-10 w-10 rounded-full border-2 border-primary-fixed"
                  : "rounded-full border border-outline-variant/40 px-3 py-2 text-xs font-semibold text-on-surface"
              ].join(" ")}
              href={viewer ? routes.profile : buildAuthHref(routes.login, routes.home)}
            >
              {viewer ? <span className="sr-only">Open profile</span> : "Sign in"}
            </Link>
          </div>
        </header>

        <nav className="sticky top-16 z-40 overflow-x-auto border-b border-surface-variant/30 bg-white/80 py-sm backdrop-blur-xl no-scrollbar">
          <div className="flex min-w-max items-center gap-sm px-margin-mobile">
            {lanes.map((lane) => (
              <button
                className={[
                  "rounded-full px-md py-xs font-label-sm transition-colors",
                  lane.key === activeLane?.key
                    ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
                ].join(" ")}
                key={lane.key}
                onClick={() => setActiveLaneKey(lane.key)}
                type="button"
              >
                {lane.label}
              </button>
            ))}
          </div>
        </nav>

        <main className="mx-auto max-w-7xl pb-24">
          {!activeLane || activeLane.cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <MaterialIcon className="text-6xl text-zinc-300">gallery_thumbnail</MaterialIcon>
              <p className="mt-4 text-lg font-semibold text-zinc-700">No live memes yet</p>
              <p className="mt-2 text-sm text-zinc-500">
                Seed content or upload the first meme and this mobile feed will switch to real data
                automatically.
              </p>
            </div>
          ) : filteredCards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <MaterialIcon className="text-6xl text-zinc-300">search_off</MaterialIcon>
              <p className="mt-4 text-lg text-zinc-500">
                No memes found for{" "}
                <span className="font-semibold text-zinc-700">{searchQuery}</span>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 p-4">
              {filteredCards.map((card) => (
                <div
                  className="relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm transition-all duration-300 hover:shadow-xl"
                  key={card.id}
                  style={{ aspectRatio: card.aspectRatio }}
                >
                  <Link className="group block h-full w-full" href={card.href}>
                    <AppImage
                      alt={card.imageAlt}
                      className="h-full w-full object-cover"
                      priority={card.id === filteredCards[0]?.id}
                      sizes="50vw"
                      src={card.imageUrl}
                    />
                    <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-black/10 to-transparent p-base">
                      <div className="flex justify-end">
                        <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-label-sm text-white backdrop-blur-md">
                          {card.saveCountLabel} saves
                        </span>
                      </div>
                      <div>
                        <p className="line-clamp-2 text-sm font-bold text-white">{card.headline}</p>
                        <div className="mt-2 flex items-center justify-between text-white/85">
                          <span className="truncate text-[11px] font-label-sm">
                            {card.creatorUsername}
                          </span>
                          {card.tags[0] ? (
                            <span className="truncate text-[11px] font-label-sm">
                              #{card.tags[0]}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {activeLane && activeLane.cards.length > 0 ? (
            <div className="px-4 pb-8">
              <div className="rounded-2xl bg-white/70 px-4 py-3 text-center text-xs text-zinc-500 shadow-sm">
                Showing live posts from {activeLane.label.toLowerCase()}.
              </div>
            </div>
          ) : null}
        </main>

        <Link
          className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-2xl md:absolute md:bottom-24 md:right-6"
          href={viewer ? routes.profile : buildAuthHref(routes.signup, routes.home)}
        >
          <MaterialIcon className="text-3xl">{viewer ? "person" : "person_add"}</MaterialIcon>
        </Link>

        <MobileBottomNav
          active="home"
          className="md:absolute md:inset-x-0 md:bottom-0 md:left-0 md:w-auto"
          homeRoute={routes.home}
          showLabels
        />
      </div>
    </div>
  );
}
