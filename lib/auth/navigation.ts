import type { Route } from "next";
import { routes } from "@/lib/routes";

export function normalizeAuthNextPath(
  value: string | string[] | undefined,
  fallback: string = routes.profile
): string {
  const normalized = (Array.isArray(value) ? value[0] : value)?.trim();

  if (!normalized) {
    return fallback;
  }

  if (!normalized.startsWith("/") || normalized.startsWith("//")) {
    return fallback;
  }

  return normalized;
}

export function buildAuthHref(basePath: string, nextPath?: string): Route {
  if (!nextPath) {
    return basePath as Route;
  }

  return `${basePath}?next=${encodeURIComponent(nextPath)}` as Route;
}
