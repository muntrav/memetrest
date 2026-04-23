import React from "react";
import Link from "next/link";
import { BackButton } from "@/components/navigation/back-button";
import { DesktopPageShell } from "@/components/navigation/desktop-page-shell";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { AppImage } from "@/components/ui/app-image";
import { MaterialIcon } from "@/components/ui/material-icon";
import { BoardItemRemoveButton } from "@/components/screens/board-item-remove-button";
import type { BoardDetail } from "@/lib/boards/types";
import { postDetailHref, routes } from "@/lib/routes";

type BoardDetailScreenProps = {
  board: BoardDetail | null;
  statusTitle?: string | null;
  statusDescription?: string | null;
};

function formatSavedDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

function BoardStatus({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-outline-variant/40 bg-background/60 px-6 py-12 text-center">
      <p className="text-lg font-bold text-on-surface">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-on-surface-variant">{description}</p>
      <div className="mt-6">
        <Link
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-label-sm text-on-primary shadow-lg shadow-primary/20"
          href={routes.collections}
        >
          <MaterialIcon>collections_bookmark</MaterialIcon>
          Back to collections
        </Link>
      </div>
    </div>
  );
}

function BoardItemCard({
  boardId,
  canEdit,
  item
}: {
  boardId: string;
  canEdit: boolean;
  item: BoardDetail["items"][number];
}) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-white/30 bg-white/80 shadow-[0_18px_50px_rgba(129,39,207,0.08)]">
      <div className="relative">
        <Link className="block" href={postDetailHref(item.post.id)} style={{ aspectRatio: "4 / 5" }}>
          <AppImage
            alt={item.post.caption || `${item.post.creator.displayName} meme`}
            className="h-full w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 33vw"
            src={item.post.asset.url}
          />
        </Link>
        {canEdit ? (
          <div className="absolute right-3 top-3">
            <BoardItemRemoveButton
              boardId={boardId}
              className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-on-surface shadow-lg"
              postId={item.post.id}
            />
          </div>
        ) : null}
      </div>

      <div className="space-y-3 p-4">
        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="line-clamp-1 font-semibold text-on-surface">
              {item.post.caption || item.post.overlayTextTop || item.post.overlayTextBottom || "Untitled meme"}
            </p>
            <span className="shrink-0 text-[11px] font-label-sm text-outline">
              {formatSavedDate(item.savedAt)}
            </span>
          </div>
          <p className="mt-1 text-sm text-on-surface-variant">
            by {item.post.creator.displayName} @{item.post.creator.username}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {item.post.tags.slice(0, 3).map((tag) => (
            <span
              className="rounded-full bg-surface-container px-3 py-1 text-[10px] font-label-sm text-on-surface-variant"
              key={`${item.post.id}-${tag}`}
            >
              #{tag}
            </span>
          ))}
          {item.post.tags.length === 0 ? (
            <span className="rounded-full bg-surface-container px-3 py-1 text-[10px] font-label-sm text-on-surface-variant">
              Saved meme
            </span>
          ) : null}
        </div>

        <div className="flex items-center justify-between text-xs text-on-surface-variant">
          <span>{item.post.metrics.saveCount} saves</span>
          <Link className="font-semibold text-primary" href={postDetailHref(item.post.id)}>
            Open meme
          </Link>
        </div>
      </div>
    </article>
  );
}

export function BoardDetailScreen({
  board,
  statusTitle,
  statusDescription
}: BoardDetailScreenProps) {
  const resolvedStatusTitle = statusTitle ?? (board ? null : "Board unavailable");
  const resolvedStatusDescription =
    statusDescription ??
    (board ? null : "This board could not be loaded right now.");

  return (
    <div className="min-h-screen bg-background font-body-md text-on-background">
      <DesktopPageShell
        active="collections"
        description={
          board
            ? board.description || "A live board view with real saved memes and direct management controls."
            : "Board detail keeps saved items, visibility, and removal actions in one place."
        }
        title={board?.name ?? "Board detail"}
        toolbar={
          <>
            <BackButton
              className="rounded-full border border-outline-variant/40 bg-white px-5 py-3 font-label-sm text-on-surface transition-colors hover:bg-surface-container"
              fallbackHref={routes.collections}
            >
              Back to collections
            </BackButton>
            {board ? (
              <div className="rounded-full bg-primary-container px-4 py-3 text-sm font-semibold text-on-primary-container">
                {board.visibility === "private" ? "Private board" : "Public board"}
              </div>
            ) : null}
          </>
        }
      >
        {board ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <section className="rounded-[28px] border border-white/30 bg-white/75 p-6 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="font-label-sm uppercase tracking-[0.24em] text-on-surface-variant">
                    {board.itemCount} saved meme{board.itemCount === 1 ? "" : "s"}
                  </p>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Updated {formatSavedDate(board.updatedAt)}
                  </p>
                </div>
                {board.owner.avatarUrl ? (
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 overflow-hidden rounded-full border border-primary-container">
                      <AppImage
                        alt={board.owner.displayName}
                        className="h-full w-full object-cover"
                        height={44}
                        src={board.owner.avatarUrl}
                        width={44}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface">{board.owner.displayName}</p>
                      <p className="text-sm text-on-surface-variant">@{board.owner.username}</p>
                    </div>
                  </div>
                ) : null}
              </div>

              {board.items.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                  {board.items.map((item) => (
                    <BoardItemCard
                      boardId={board.id}
                      canEdit={board.canEdit}
                      item={item}
                      key={`${board.id}-${item.postId}`}
                    />
                  ))}
                </div>
              ) : (
                <BoardStatus
                  description={
                    board.canEdit
                      ? "Save memes from the detail view and they will appear here immediately."
                      : "This board has no visible memes yet."
                  }
                  title={board.canEdit ? "This board is empty" : "Nothing to show yet"}
                />
              )}
            </section>

            <aside className="space-y-6">
              <section className="rounded-[28px] border border-white/30 bg-white/75 p-6 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl">
                <h2 className="font-headline-md text-on-surface">Board summary</h2>
                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl bg-background/80 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-outline">Visibility</p>
                    <p className="mt-2 font-semibold text-on-surface">
                      {board.visibility === "private" ? "Private" : "Public"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-background/80 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-outline">Owner</p>
                    <p className="mt-2 font-semibold text-on-surface">{board.owner.displayName}</p>
                    <p className="text-sm text-on-surface-variant">@{board.owner.username}</p>
                  </div>
                  <div className="rounded-2xl bg-background/80 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-outline">Share path</p>
                    <p className="mt-2 break-all text-sm text-on-surface-variant">
                      /collections/{board.slug ?? board.id}
                    </p>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        ) : (
          <BoardStatus
            description={resolvedStatusDescription ?? "Board unavailable."}
            title={resolvedStatusTitle ?? "Board unavailable"}
          />
        )}
      </DesktopPageShell>

      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 shadow-[0_8px_32px_rgba(168,85,247,0.08)] backdrop-blur-xl md:hidden">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
          <BackButton
            className="text-zinc-500 transition-transform duration-200 hover:scale-105"
            fallbackHref={routes.collections}
          >
            <MaterialIcon>arrow_back</MaterialIcon>
          </BackButton>
          <Link href={routes.home}>
            <span className="text-2xl font-black tracking-tighter text-purple-600">Memetrest</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
            {board ? (board.visibility === "private" ? "Private" : "Public") : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 md:hidden">
        {board ? (
          <>
            <section className="rounded-[28px] border border-white/30 bg-white/75 p-5 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl">
              <p className="font-label-sm uppercase tracking-[0.24em] text-on-surface-variant">
                {board.itemCount} saved meme{board.itemCount === 1 ? "" : "s"}
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-on-surface">{board.name}</h1>
              <p className="mt-2 text-sm text-on-surface-variant">
                {board.description || "A mobile-first board view for browsing saved memes quickly."}
              </p>
            </section>

            <section className="mt-5 space-y-4">
              {board.items.length > 0 ? (
                board.items.map((item) => (
                  <BoardItemCard
                    boardId={board.id}
                    canEdit={board.canEdit}
                    item={item}
                    key={`${board.id}-mobile-${item.postId}`}
                  />
                ))
              ) : (
                <BoardStatus
                  description={
                    board.canEdit
                      ? "Save memes from the detail page and they will land here."
                      : "This board does not have visible memes yet."
                  }
                  title={board.canEdit ? "This board is empty" : "Nothing to show yet"}
                />
              )}
            </section>
          </>
        ) : (
          <BoardStatus
            description={resolvedStatusDescription ?? "Board unavailable."}
            title={resolvedStatusTitle ?? "Board unavailable"}
          />
        )}
      </main>

      <MobileBottomNav active="collections" className="md:hidden" />
    </div>
  );
}
