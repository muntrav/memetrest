"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import type { RoutePath } from "@/lib/routes";

type BackButtonProps = {
  fallbackHref: RoutePath;
  className?: string;
  children: ReactNode;
};

export function BackButton({ fallbackHref, className, children }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      className={className}
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
          return;
        }

        router.push(fallbackHref);
      }}
      type="button"
    >
      {children}
    </button>
  );
}
