"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { routes } from "@/lib/routes";

const warmRoutes = [
  routes.home,
  routes.search,
  routes.collections,
  routes.profile,
  routes.detail,
  routes.login,
  routes.signup
] as const;

export function RouteWarmup() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const warm = () => {
      if (cancelled) {
        return;
      }

      warmRoutes.forEach((route) => {
        router.prefetch(route);
      });
    };

    if ("requestIdleCallback" in globalThis) {
      const idleId = globalThis.requestIdleCallback(warm, {
        timeout: 2000
      });

      return () => {
        cancelled = true;
        globalThis.cancelIdleCallback(idleId);
      };
    }

    const timeoutId = globalThis.setTimeout(warm, 600);

    return () => {
      cancelled = true;
      globalThis.clearTimeout(timeoutId);
    };
  }, [router]);

  return null;
}
