"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CollectionVisibility } from "@/lib/collections/types";
import { MaterialIcon } from "@/components/ui/material-icon";

type CollectionsCreateBoardButtonProps = {
  buttonClassName: string;
  buttonLabel: string;
  iconOnly?: boolean;
};

export function CollectionsCreateBoardButton({
  buttonClassName,
  buttonLabel,
  iconOnly = false
}: CollectionsCreateBoardButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState<CollectionVisibility>("public");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, visibility })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error ?? "Could not create board.");
        return;
      }

      setTitle("");
      setVisibility("public");
      setIsOpen(false);

      startTransition(() => {
        router.refresh();
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button className={buttonClassName} onClick={() => setIsOpen(true)} type="button">
        <MaterialIcon>{iconOnly ? "add" : "add_circle"}</MaterialIcon>
        {iconOnly ? <span className="sr-only">{buttonLabel}</span> : <span>{buttonLabel}</span>}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-white/30 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black tracking-tight text-on-surface">Create board</h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Boards are now persisted in the app data store and available after refresh.
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

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-on-surface">Board name</span>
                <input
                  className="w-full rounded-2xl border border-outline-variant/40 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
                  maxLength={60}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Reaction Vault"
                  value={title}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-on-surface">Visibility</span>
                <select
                  className="w-full rounded-2xl border border-outline-variant/40 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
                  onChange={(event) => setVisibility(event.target.value as CollectionVisibility)}
                  value={visibility}
                >
                  <option value="public">Public board</option>
                  <option value="private">Private board</option>
                </select>
              </label>

              {error ? (
                <p className="rounded-2xl bg-error/10 px-4 py-3 text-sm text-error">{error}</p>
              ) : null}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  className="rounded-full border border-outline-variant/40 px-4 py-2 font-label-sm text-on-surface"
                  onClick={() => setIsOpen(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="rounded-full bg-primary px-5 py-2 font-label-sm text-on-primary shadow-lg shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isPending || isSubmitting}
                  type="submit"
                >
                  {isPending || isSubmitting ? "Creating..." : "Create board"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
