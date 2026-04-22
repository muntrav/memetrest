"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { type ComponentPropsWithoutRef, type ReactNode } from "react";
import type { RoutePath } from "@/lib/routes";

type PrefetchLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & {
  href: RoutePath;
  children: ReactNode;
};

export function PrefetchLink({
  href,
  onMouseEnter,
  onFocus,
  onTouchStart,
  children,
  ...props
}: PrefetchLinkProps) {
  const router = useRouter();

  function warmRoute() {
    router.prefetch(href);
  }

  return (
    <Link
      {...props}
      href={href}
      onFocus={(event) => {
        warmRoute();
        onFocus?.(event);
      }}
      onMouseEnter={(event) => {
        warmRoute();
        onMouseEnter?.(event);
      }}
      onTouchStart={(event) => {
        warmRoute();
        onTouchStart?.(event);
      }}
      prefetch
    >
      {children}
    </Link>
  );
}
