export const routes = {
  home: "/",
  search: "/search_discovery",
  collections: "/collections",
  profile: "/profile_page",
  detail: "/meme_detail_view"
} as const;

export type RoutePath = (typeof routes)[keyof typeof routes];
