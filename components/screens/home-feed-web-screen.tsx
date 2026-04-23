"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { DesktopSidebar } from "@/components/navigation/desktop-sidebar";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { AppImage } from "@/components/ui/app-image";
import { MaterialIcon } from "@/components/ui/material-icon";
import type { FeedLaneViewModel } from "@/lib/posts/presentation";
import { routes } from "@/lib/routes";

type HomeFeedWebScreenProps = {
  lanes: FeedLaneViewModel[];
};

export function HomeFeedWebScreen({ lanes }: HomeFeedWebScreenProps) {
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
    <div className="bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <DesktopSidebar active="home" />

      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/20 bg-white/80 px-4 backdrop-blur-xl md:hidden">
        <Link href={routes.home}>
          <span className="text-xl font-black tracking-tighter text-purple-600">Memetrest</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href={routes.search}>
            <MaterialIcon className="text-zinc-500">search</MaterialIcon>
          </Link>
          <Link className="h-8 w-8 rounded-full bg-primary-container" href={routes.profile}>
            <span className="sr-only">Go to profile</span>
          </Link>
        </div>
      </header>

      <main className="min-h-screen p-4 md:ml-24 md:p-8 lg:ml-64">
        <section className="sticky top-4 z-40 mx-auto mb-10 max-w-4xl">
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
              <MaterialIcon className="text-zinc-400 transition-colors group-focus-within:text-primary">
                search
              </MaterialIcon>
            </div>
            <input
              type="text"
              placeholder="Search for memes, stickers, or creators..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="block w-full rounded-3xl bg-white/90 py-4 pl-14 pr-4 text-body-lg font-medium shadow-[0_8px_32px_rgba(168,85,247,0.06)] backdrop-blur-md transition-all outline-none ring-2 ring-transparent focus:ring-primary"
            />
            <div className="absolute inset-y-0 right-4 flex items-center gap-2">
              <Link
                className="rounded-xl p-2 transition-colors hover:bg-zinc-100"
                href={routes.search}
              >
                <MaterialIcon className="text-zinc-400">tune</MaterialIcon>
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-8 flex gap-3 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
          {lanes.map((lane) => (
            <button
              className={[
                "cursor-pointer rounded-full px-5 py-2 text-sm font-label-sm transition-colors",
                lane.key === activeLane?.key
                  ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
                  : "border border-zinc-100 bg-white text-zinc-600 hover:bg-purple-50"
              ].join(" ")}
              key={lane.key}
              onClick={() => setActiveLaneKey(lane.key)}
              type="button"
            >
              {lane.label}
            </button>
          ))}
        </section>

        {!activeLane || activeLane.cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[32px] border border-dashed border-outline-variant/30 bg-white/70 py-20 text-center">
            <MaterialIcon className="text-6xl text-zinc-300">gallery_thumbnail</MaterialIcon>
            <p className="mt-4 text-lg font-semibold text-zinc-700">No live memes yet</p>
            <p className="mt-2 max-w-xl text-sm text-zinc-500">
              Seed a few posts or upload your first meme and the home feed will render from the live
              browse APIs immediately.
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
          <div className="[column-count:2] gap-4 md:[column-count:3] lg:[column-count:4] 2xl:[column-count:5]">
            {filteredCards.map((card) => (
              <div
                className="masonry-item mb-4 break-inside-avoid overflow-hidden rounded-3xl bg-zinc-200 shadow-sm transition-all hover:scale-[1.02] hover:shadow-xl"
                key={card.id}
                style={{ aspectRatio: card.aspectRatio }}
              >
                <Link className="group relative block h-full w-full" href={card.href}>
                  <AppImage
                    alt={card.imageAlt}
                    className="h-full w-full object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    src={card.imageUrl}
                  />
                  <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/85 via-black/10 to-transparent p-5 opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
                    <div className="flex items-center justify-between">
                      <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                        {card.saveCountLabel} saves
                      </div>
                      <span className="rounded-xl bg-white/20 p-2 text-white backdrop-blur-md">
                        <MaterialIcon>favorite</MaterialIcon>
                      </span>
                    </div>
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white/80 bg-white/20">
                          {card.creatorAvatarUrl ? (
                            <AppImage
                              alt={card.creatorName}
                              className="h-full w-full object-cover"
                              height={32}
                              src={card.creatorAvatarUrl}
                              width={32}
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <span className="block truncate text-sm font-bold text-white">
                            {card.creatorName}
                          </span>
                          <span className="block truncate text-xs text-white/75">
                            {card.creatorUsername}
                          </span>
                        </div>
                      </div>
                      <p className="mb-3 line-clamp-2 text-sm font-bold text-white">
                        {card.headline}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {card.tags.length > 0 ? (
                          card.tags.map((tag) => (
                            <span
                              className="rounded-lg bg-white/30 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm"
                              key={tag}
                            >
                              #{tag}
                            </span>
                          ))
                        ) : (
                          <span className="rounded-lg bg-white/20 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-sm">
                            Live post
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        <button className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-2xl md:hidden">
          <MaterialIcon>add</MaterialIcon>
        </button>
      </main>

      <MobileBottomNav active="home" className="md:hidden" homeRoute={routes.home} />
    </div>
  );
}
