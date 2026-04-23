"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/ui/material-icon";

type BoardItemRemoveButtonProps = {
  boardId: string;
  postId: string;
  className?: string;
};

export function BoardItemRemoveButton({
  boardId,
  postId,
  className
}: BoardItemRemoveButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRemove() {
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/v1/me/boards/${encodeURIComponent(boardId)}/items/${encodeURIComponent(postId)}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Could not remove this meme from the board.");
      }

      startTransition(() => {
        router.refresh();
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <button
      className={className}
      disabled={isPending || isSubmitting}
      onClick={() => void handleRemove()}
      type="button"
    >
      <MaterialIcon className="text-lg">{isPending || isSubmitting ? "hourglass_top" : "close"}</MaterialIcon>
      <span>{isPending || isSubmitting ? "Removing..." : "Remove"}</span>
    </button>
  );
}
