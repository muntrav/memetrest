"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { emitNavigationProgressStart } from "@/lib/navigation-progress";
import type { RoutePath } from "@/lib/routes";

type PrefetchLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & {
  href: RoutePath;
  children: ReactNode;
};

export function PrefetchLink({
  href,
  onClick,
  onMouseEnter,
  onFocus,
  onTouchStart,
  children,
  ...props
}: PrefetchLinkProps) {
  const router = useRouter();
  const pathname = usePathname();

  function warmRoute() {
    router.prefetch(href);
  }

  return (
    <Link
      {...props}
      href={href}
      onClick={(event) => {
        if (
          !event.defaultPrevented &&
          event.button === 0 &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.altKey &&
          !event.shiftKey &&
          pathname !== href
        ) {
          emitNavigationProgressStart();
        }

        onClick?.(event);
      }}
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
