import type { Route } from "next";

export const routes = {
  home: "/",
  search: "/search_discovery",
  collections: "/collections",
  profile: "/profile_page",
  detail: "/meme_detail_view"
} as const;

export type RoutePath = (typeof routes)[keyof typeof routes];

export function postDetailHref(postId?: string): RoutePath | Route {
  if (!postId) {
    return routes.detail;
  }

  return `${routes.detail}?post=${encodeURIComponent(postId)}` as Route;
}
