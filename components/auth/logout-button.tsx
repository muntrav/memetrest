"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";

type LogoutButtonProps = {
  className: string;
  label?: string;
};

export function LogoutButton({ className, label = "Log out" }: LogoutButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/v1/auth/logout", {
        method: "POST"
      });

      if (!response.ok && response.status !== 204) {
        throw new Error("Could not log out.");
      }

      startTransition(() => {
        router.replace(routes.home);
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
      onClick={() => void handleLogout()}
      type="button"
    >
      {isPending || isSubmitting ? "Logging out..." : label}
    </button>
  );
}
