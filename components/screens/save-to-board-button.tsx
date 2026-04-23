"use client";

import Link from "next/link";
import React, { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/ui/material-icon";
import { boardDetailHref, routes } from "@/lib/routes";
import type { Board } from "@/lib/boards/types";

type SaveToBoardButtonProps = {
  postId: string;
  initialSavedBoardIds: string[];
  buttonClassName: string;
};

type BoardsResponse = {
  items: Board[];
};

function formatButtonLabel(savedBoardIds: string[]) {
  if (savedBoardIds.length === 0) {
    return "Save to Board";
  }

  return `Saved to ${savedBoardIds.length} board${savedBoardIds.length === 1 ? "" : "s"}`;
}

export function SaveToBoardButton({
  postId,
  initialSavedBoardIds,
  buttonClassName
}: SaveToBoardButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [boards, setBoards] = useState<Board[]>([]);
  const [savedBoardIds, setSavedBoardIds] = useState(initialSavedBoardIds);
  const [loadingBoards, setLoadingBoards] = useState(false);
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState(false);

  useEffect(() => {
    setSavedBoardIds(initialSavedBoardIds);
  }, [initialSavedBoardIds]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let cancelled = false;

    async function loadBoards() {
      setLoadingBoards(true);
      setError(null);
      setAuthRequired(false);

      try {
        const response = await fetch("/api/v1/me/boards", {
          method: "GET",
          cache: "no-store"
        });

        if (response.status === 401) {
          if (!cancelled) {
            setBoards([]);
            setAuthRequired(true);
          }
          return;
        }

        if (!response.ok) {
          throw new Error("Could not load your boards.");
        }

        const payload = (await response.json()) as BoardsResponse;

        if (!cancelled) {
          setBoards(payload.items ?? []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Could not load your boards.");
        }
      } finally {
        if (!cancelled) {
          setLoadingBoards(false);
        }
      }
    }

    void loadBoards();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  async function toggleBoard(boardId: string, isSaved: boolean) {
    setActiveBoardId(boardId);
    setError(null);

    try {
      const response = await fetch(
        `/api/v1/me/boards/${encodeURIComponent(boardId)}/items${isSaved ? `/${encodeURIComponent(postId)}` : ""}`,
        {
          method: isSaved ? "DELETE" : "POST",
          headers: isSaved
            ? undefined
            : {
                "Content-Type": "application/json"
              },
          body: isSaved ? undefined : JSON.stringify({ postId })
        }
      );

      if (response.status === 401) {
        setAuthRequired(true);
        return;
      }

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: { message?: string } }
          | null;
        throw new Error(payload?.error?.message ?? "Could not update this board.");
      }

      setSavedBoardIds((current) =>
        isSaved ? current.filter((id) => id !== boardId) : [...current, boardId]
      );

      startTransition(() => {
        router.refresh();
      });
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : "Could not update this board.");
    } finally {
      setActiveBoardId(null);
    }
  }

  return (
    <>
      <button className={buttonClassName} onClick={() => setIsOpen(true)} type="button">
        <MaterialIcon>{savedBoardIds.length > 0 ? "bookmark_added" : "bookmark"}</MaterialIcon>
        <span>{formatButtonLabel(savedBoardIds)}</span>
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] border border-white/30 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black tracking-tight text-on-surface">Save to board</h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Choose exactly where this meme should live in your collection.
                </p>
              </div>
              <button
                className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                <MaterialIcon>close</MaterialIcon>
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {loadingBoards ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    className="h-20 animate-pulse rounded-2xl bg-surface-container"
                    key={`board-loading-${index}`}
                  />
                ))
              ) : null}

              {!loadingBoards && authRequired ? (
                <div className="rounded-2xl border border-dashed border-outline-variant/40 bg-background/60 px-4 py-6 text-center">
                  <p className="font-semibold text-on-surface">Sign in required</p>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Your saved boards are tied to an account session.
                  </p>
                </div>
              ) : null}

              {!loadingBoards && !authRequired && boards.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-outline-variant/40 bg-background/60 px-4 py-6 text-center">
                  <p className="font-semibold text-on-surface">Create your first board</p>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Boards are live now. Create one in Collections, then come back and save this meme.
                  </p>
                  <Link
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 font-label-sm text-on-primary shadow-lg shadow-primary/20"
                    href={routes.collections}
                    onClick={() => setIsOpen(false)}
                  >
                    <MaterialIcon>collections_bookmark</MaterialIcon>
                    Open Collections
                  </Link>
                </div>
              ) : null}

              {!loadingBoards && !authRequired
                ? boards.map((board) => {
                    const isSaved = savedBoardIds.includes(board.id);
                    const isMutating = activeBoardId === board.id;

                    return (
                      <div
                        className="flex items-center justify-between gap-4 rounded-2xl bg-surface-container-low px-4 py-4"
                        key={board.id}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate font-semibold text-on-surface">{board.name}</p>
                            {board.visibility === "private" ? (
                              <MaterialIcon className="text-sm text-outline">lock</MaterialIcon>
                            ) : null}
                          </div>
                          <p className="text-sm text-on-surface-variant">
                            {board.itemCount} saved meme{board.itemCount === 1 ? "" : "s"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            className="rounded-full border border-outline-variant/40 px-3 py-2 text-xs font-semibold text-on-surface"
                            href={boardDetailHref(board.slug ?? board.id)}
                            onClick={() => setIsOpen(false)}
                          >
                            View
                          </Link>
                          <button
                            className={[
                              "rounded-full px-4 py-2 text-xs font-semibold transition-colors",
                              isSaved
                                ? "bg-surface-container-high text-on-surface"
                                : "bg-primary text-on-primary shadow-lg shadow-primary/20"
                            ].join(" ")}
                            disabled={isPending || isMutating}
                            onClick={() => void toggleBoard(board.id, isSaved)}
                            type="button"
                          >
                            {isMutating ? "Updating..." : isSaved ? "Remove" : "Save"}
                          </button>
                        </div>
                      </div>
                    );
                  })
                : null}

              {error ? (
                <p className="rounded-2xl bg-error/10 px-4 py-3 text-sm text-error">{error}</p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
