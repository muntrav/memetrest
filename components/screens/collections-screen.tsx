import React from "react";
import Link from "next/link";
import { DesktopPageShell } from "@/components/navigation/desktop-page-shell";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { CollectionsCreateBoardButton } from "@/components/screens/collections-create-board-button";
import { AppImage } from "@/components/ui/app-image";
import { MaterialIcon } from "@/components/ui/material-icon";
import type {
  CollectionBoard,
  CollectionFilter,
  CollectionsSummary
} from "@/lib/collections/types";
import { routes, type RoutePath } from "@/lib/routes";

const filters = [
  { key: "all", label: "All Boards" },
  { key: "recent", label: "Recently Updated" },
  { key: "private", label: "Secret Boards" },
  { key: "organized", label: "Organized" }
] as const satisfies ReadonlyArray<{ key: CollectionFilter; label: string }>;

type CollectionsScreenProps = {
  boards: CollectionBoard[];
  filter: CollectionFilter;
  summary: CollectionsSummary;
};

function getFilterHref(filterKey: CollectionFilter): {
  pathname: RoutePath;
  query?: {
    filter: Exclude<CollectionFilter, "all">;
  };
} {
  if (filterKey === "all") {
    return {
      pathname: routes.collections
    };
  }

  return {
    pathname: routes.collections,
    query: {
      filter: filterKey
    }
  };
}

function formatBoardCount(itemCount: number) {
  return `${itemCount} item${itemCount === 1 ? "" : "s"}`;
}

export function CollectionsScreen({
  boards,
  filter,
  summary
}: CollectionsScreenProps) {
  const emptyStateTitle =
    filter === "private"
      ? "No private boards yet"
      : filter === "organized"
        ? "No organized boards yet"
        : "No boards found";

  const emptyStateDescription =
    filter === "private"
      ? "Create a private board to keep your saved memes out of the public grid."
      : filter === "organized"
        ? "Boards with tags show up here. Start by creating a new board and organizing it later."
        : "Create your first board to start saving memes into real app data.";

  return (
    <div className="min-h-screen bg-background font-body-md text-on-background">
      <DesktopPageShell
        active="collections"
        description="Desktop collections focus on board management and visibility; mobile keeps the compact save-and-browse flow."
        title="Collections"
        toolbar={
          <>
            <button
              className="rounded-full border border-outline-variant/40 bg-white px-5 py-3 font-label-sm text-on-surface transition-colors hover:bg-surface-container"
              type="button"
            >
              Import board
            </button>
            <CollectionsCreateBoardButton
              buttonClassName="flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-label-sm text-on-primary shadow-lg shadow-primary/20"
              buttonLabel="New board"
            />
          </>
        }
      >
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-[28px] border border-white/30 bg-white/75 p-6 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-label-sm uppercase tracking-[0.24em] text-on-surface-variant">
                  {summary.boardCount} boards &bull; {summary.totalItemCount} saved memes
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.map((item) => (
                  <Link
                    className={[
                      "whitespace-nowrap rounded-full px-4 py-2 font-label-sm transition-colors",
                      item.key === filter
                        ? "bg-primary-container text-on-primary-container"
                        : "bg-surface-container text-on-surface-variant"
                    ].join(" ")}
                    href={getFilterHref(item.key)}
                    key={item.key}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {boards.length > 0 ? (
              <div className="grid grid-cols-2 gap-gutter 2xl:grid-cols-3">
                {boards.map((board) => (
                  <div className="group flex flex-col gap-3" key={board.id}>
                    <Link
                      className="grid aspect-[4/3] grid-cols-3 grid-rows-2 gap-1 overflow-hidden rounded-3xl shadow-sm transition-all duration-300 group-hover:shadow-xl"
                      href={routes.detail}
                    >
                      <div className="col-span-2 row-span-2 overflow-hidden">
                        <AppImage
                          alt={board.title}
                          className="h-full w-full object-cover"
                          sizes="(max-width: 1536px) 50vw, 33vw"
                          src={board.previewImages[0]}
                        />
                      </div>
                      {board.previewImages[1] ? (
                        <div className="overflow-hidden">
                          <AppImage
                            alt={`${board.title} preview`}
                            className="h-full w-full object-cover"
                            sizes="33vw"
                            src={board.previewImages[1]}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center overflow-hidden bg-surface-container-highest">
                          <MaterialIcon className="text-on-surface-variant">image</MaterialIcon>
                        </div>
                      )}
                      {board.previewImages[2] ? (
                        <div className="overflow-hidden">
                          <AppImage
                            alt={`${board.title} preview`}
                            className="h-full w-full object-cover"
                            sizes="33vw"
                            src={board.previewImages[2]}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center overflow-hidden bg-surface-container-highest">
                          <MaterialIcon className="text-on-surface-variant">image</MaterialIcon>
                        </div>
                      )}
                    </Link>
                    <div className="flex items-center justify-between px-1">
                      <div>
                        <div className="flex items-center gap-1">
                          <h3 className="text-lg font-headline-md text-on-surface">{board.title}</h3>
                          {board.visibility === "private" ? (
                            <MaterialIcon className="text-[16px] text-zinc-400">lock</MaterialIcon>
                          ) : null}
                        </div>
                        <p className="font-label-sm text-on-surface-variant">
                          {formatBoardCount(board.itemCount)}
                        </p>
                      </div>
                      <button
                        className="rounded-full p-2 text-outline transition-colors hover:bg-surface-variant"
                        type="button"
                      >
                        <MaterialIcon>more_vert</MaterialIcon>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-outline-variant/40 bg-background/60 px-6 py-12 text-center">
                <p className="text-lg font-bold text-on-surface">{emptyStateTitle}</p>
                <p className="mx-auto mt-2 max-w-md text-sm text-on-surface-variant">
                  {emptyStateDescription}
                </p>
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <section className="rounded-[28px] border border-white/30 bg-white/75 p-6 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl">
              <h2 className="font-headline-md text-on-surface">Board tools</h2>
              <div className="mt-5 space-y-3">
                <button
                  className="flex w-full items-center justify-between rounded-2xl bg-background/80 px-4 py-4 text-left"
                  type="button"
                >
                  <span>
                    <span className="block font-semibold text-on-surface">Reorder boards</span>
                    <span className="text-sm text-on-surface-variant">Adjust board priority</span>
                  </span>
                  <MaterialIcon className="text-primary">reorder</MaterialIcon>
                </button>
                <button
                  className="flex w-full items-center justify-between rounded-2xl bg-background/80 px-4 py-4 text-left"
                  type="button"
                >
                  <span>
                    <span className="block font-semibold text-on-surface">Rename boards</span>
                    <span className="text-sm text-on-surface-variant">Clean up board labels</span>
                  </span>
                  <MaterialIcon className="text-primary">drive_file_rename_outline</MaterialIcon>
                </button>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/30 bg-gradient-to-br from-primary-container via-white to-white p-6 shadow-[0_18px_50px_rgba(129,39,207,0.08)]">
              <p className="font-label-sm uppercase tracking-[0.24em] text-primary">Collection health</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/80 p-4">
                  <span className="block text-2xl font-black text-on-surface">
                    {summary.taggedBoardPercentage}%
                  </span>
                  <span className="text-sm text-on-surface-variant">Boards tagged</span>
                </div>
                <div className="rounded-2xl bg-white/80 p-4">
                  <span className="block text-2xl font-black text-on-surface">
                    {summary.privateBoardCount}
                  </span>
                  <span className="text-sm text-on-surface-variant">Private saves</span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </DesktopPageShell>

      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 shadow-[0_8px_32px_rgba(168,85,247,0.08)] backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/80 md:hidden">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
          <Link className="flex items-center gap-base" href={routes.search}>
            <MaterialIcon className="text-purple-600 dark:text-purple-400">search</MaterialIcon>
          </Link>
          <Link href={routes.home}>
            <h1 className="text-2xl font-black tracking-tighter text-purple-600 dark:text-purple-400">
              Memetrest
            </h1>
          </Link>
          <Link className="h-8 w-8 overflow-hidden rounded-full border-2 border-primary-fixed-dim transition-transform duration-200 hover:scale-105" href={routes.profile}>
            <AppImage
              alt="high-quality studio portrait of a stylish young adult with colorful creative lighting and a minimalist background"
              className="h-full w-full object-cover"
              height={32}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWiZLF0pwI1N0hoijga6jBdhTh0ZmffK-ATM1SNvX-wiL5-nlrPCxg47vqX60NXKw38t7ncWi0k6gCFHGpy2pWbJef7fAmEl42oH3QCboqCNhwYbz15SsIKZ2ONEAYfaFXwsVXqxQ4usU_bukokqhWDeTWOxEbWlB1ZbSchxzT26xulsPDaff0f3aTAcSO5R-CDZn9uqxwm508JZ1vIeG-3iud0bMn5NFw9fFANdAl3hmUypZduxfKe00viLwbLFeNaTog5PSOVDqu"
              width={32}
            />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 md:hidden">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">Collections</h2>
            <p className="mt-1 font-label-sm text-on-surface-variant">
              {summary.boardCount} boards &bull; {summary.totalItemCount} saved memes
            </p>
          </div>
          <CollectionsCreateBoardButton
            buttonClassName="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg shadow-primary/20 transition-transform hover:scale-105"
            buttonLabel="Create board"
            iconOnly
          />
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {filters.map((item) => (
            <Link
              className={[
                "whitespace-nowrap rounded-full px-4 py-2 font-label-sm transition-colors",
                item.key === filter
                  ? "bg-primary-container text-on-primary-container"
                  : "bg-surface-container text-on-surface-variant"
              ].join(" ")}
              href={getFilterHref(item.key)}
              key={item.key}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {boards.length > 0 ? (
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
            {boards.map((board) => (
              <div className="group flex flex-col gap-3" key={board.id}>
                <Link
                  className="grid aspect-[4/3] grid-cols-3 grid-rows-2 gap-1 overflow-hidden rounded-3xl shadow-sm transition-all duration-300 group-hover:shadow-xl"
                  href={routes.detail}
                >
                  <div className="col-span-2 row-span-2 overflow-hidden">
                    <AppImage
                      alt={board.title}
                      className="h-full w-full object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      src={board.previewImages[0]}
                    />
                  </div>
                  {board.previewImages[1] ? (
                    <div className="overflow-hidden">
                      <AppImage alt={`${board.title} preview`} className="h-full w-full object-cover" sizes="33vw" src={board.previewImages[1]} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center overflow-hidden bg-surface-container-highest">
                      <MaterialIcon className="text-on-surface-variant">image</MaterialIcon>
                    </div>
                  )}
                  {board.previewImages[2] ? (
                    <div className="overflow-hidden">
                      <AppImage alt={`${board.title} preview`} className="h-full w-full object-cover" sizes="33vw" src={board.previewImages[2]} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center overflow-hidden bg-surface-container-highest">
                      <MaterialIcon className="text-on-surface-variant">image</MaterialIcon>
                    </div>
                  )}
                </Link>
                <div className="flex items-center justify-between px-1">
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="text-lg font-headline-md text-on-surface">{board.title}</h3>
                      {board.visibility === "private" ? (
                        <MaterialIcon className="text-[16px] text-zinc-400">lock</MaterialIcon>
                      ) : null}
                    </div>
                    <p className="font-label-sm text-on-surface-variant">
                      {formatBoardCount(board.itemCount)}
                    </p>
                  </div>
                  <button className="rounded-full p-2 text-outline transition-colors hover:bg-surface-variant" type="button">
                    <MaterialIcon>more_vert</MaterialIcon>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-outline-variant/40 bg-background/60 px-6 py-12 text-center">
            <p className="text-lg font-bold text-on-surface">{emptyStateTitle}</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-on-surface-variant">
              {emptyStateDescription}
            </p>
          </div>
        )}

        <div className="glass-card fixed bottom-24 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-full border border-white/40 px-6 py-3 shadow-2xl">
          <span className="font-label-sm text-primary">Edit Mode</span>
          <div className="h-4 w-px bg-outline/20" />
          <div className="flex gap-4">
            <button className="flex items-center gap-1 text-on-surface-variant transition-colors hover:text-primary" type="button">
              <MaterialIcon className="text-[20px]">reorder</MaterialIcon>
              <span className="text-[12px] font-semibold">Reorder</span>
            </button>
            <button className="flex items-center gap-1 text-on-surface-variant transition-colors hover:text-primary" type="button">
              <MaterialIcon className="text-[20px]">drive_file_rename_outline</MaterialIcon>
              <span className="text-[12px] font-semibold">Rename</span>
            </button>
          </div>
        </div>
      </main>

      <MobileBottomNav active="collections" className="md:hidden" />
    </div>
  );
}
