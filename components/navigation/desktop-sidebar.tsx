import React from "react";
import Link from "next/link";
import { PrefetchLink } from "@/components/navigation/prefetch-link";
import { routes } from "@/lib/routes";
import { MaterialIcon } from "@/components/ui/material-icon";
import { AppImage } from "@/components/ui/app-image";
import { LogoutButton } from "@/components/auth/logout-button";
import type { ViewerSummary } from "@/lib/auth/viewer";
import { buildAuthHref } from "@/lib/auth/navigation";

type DesktopSidebarProps = {
  active: "home" | "explore" | "collections" | "profile";
  viewer?: ViewerSummary | null;
};

const items = [
  { key: "home", href: routes.home, label: "Home", icon: "home" },
  { key: "explore", href: routes.search, label: "Explore", icon: "explore" },
  {
    key: "collections",
    href: routes.collections,
    label: "Collections",
    icon: "collections_bookmark"
  },
  { key: "profile", href: routes.profile, label: "Profile", icon: "person" }
] as const;

export function DesktopSidebar({ active, viewer = null }: DesktopSidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-full w-24 flex-col border-r border-white/20 bg-white/80 p-6 backdrop-blur-xl md:flex lg:w-64 dark:bg-zinc-900/80">
      <div className="mb-10 lg:px-4">
        <PrefetchLink className="inline-block" href={routes.home}>
          <span className="bg-clip-text text-2xl font-black tracking-tighter text-purple-600 dark:text-purple-400">
            Memetrest
          </span>
        </PrefetchLink>
      </div>
      <nav className="flex flex-col gap-4">
        {items.map((item) => {
          const isActive = item.key === active;
          return (
            <PrefetchLink
              aria-label={item.label}
              className={[
                "group flex items-center gap-4 rounded-2xl p-3 transition-all",
                isActive
                  ? "bg-purple-100/50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300"
                  : "text-zinc-400 hover:bg-purple-50 dark:text-zinc-500 dark:hover:bg-zinc-800"
              ].join(" ")}
              href={item.href}
              key={item.key}
            >
              <MaterialIcon
                className={[
                  "text-2xl",
                  isActive ? "" : "transition-transform group-hover:scale-110"
                ].join(" ")}
                filled={isActive}
              >
                {item.icon}
              </MaterialIcon>
              <span className="hidden text-body-lg font-headline-md lg:block">
                {item.label}
              </span>
            </PrefetchLink>
          );
        })}
      </nav>
      <div className="mt-auto lg:px-4">
        {viewer ? (
          <div className="rounded-[28px] border border-white/30 bg-white/75 p-4 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl">
            <PrefetchLink className="flex items-center gap-3" href={routes.profile}>
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-primary-container text-primary">
                {viewer.avatarUrl ? (
                  <AppImage
                    alt={viewer.displayName}
                    className="h-full w-full object-cover"
                    height={48}
                    src={viewer.avatarUrl}
                    width={48}
                  />
                ) : (
                  <span className="text-sm font-black">
                    {viewer.displayName.slice(0, 1).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="hidden min-w-0 lg:block">
                <p className="truncate font-semibold text-on-surface">{viewer.displayName}</p>
                <p className="truncate text-sm text-on-surface-variant">@{viewer.username}</p>
              </div>
            </PrefetchLink>

            <div className="mt-4 hidden gap-2 lg:flex">
              <PrefetchLink
                className="flex-1 rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-on-primary shadow-lg shadow-primary/20"
                href={routes.profile}
              >
                Account
              </PrefetchLink>
              <LogoutButton
                className="rounded-full border border-outline-variant/40 px-4 py-3 text-sm font-semibold text-on-surface"
                label="Sign out"
              />
            </div>
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/30 bg-white/75 p-4 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl">
            <p className="hidden text-sm font-semibold text-on-surface lg:block">
              Sign in to save memes, manage boards, and unlock your account dashboard.
            </p>
            <div className="mt-0 hidden gap-2 lg:mt-4 lg:flex">
              <Link
                className="flex-1 rounded-full border border-outline-variant/40 px-4 py-3 text-center text-sm font-semibold text-on-surface"
                href={buildAuthHref(routes.login, routes.profile)}
              >
                Sign in
              </Link>
              <Link
                className="flex-1 rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-on-primary shadow-lg shadow-primary/20"
                href={buildAuthHref(routes.signup, routes.profile)}
              >
                Join
              </Link>
            </div>
            <Link
              aria-label="Create account"
              className="flex w-full items-center justify-center rounded-2xl bg-primary py-4 font-bold text-on-primary shadow-[0_8px_20px_rgba(129,39,207,0.3)] transition-all hover:scale-105 active:scale-95 lg:hidden"
              href={buildAuthHref(routes.signup, routes.profile)}
            >
              <MaterialIcon>person_add</MaterialIcon>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
