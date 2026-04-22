import React from "react";
import { PrefetchLink } from "@/components/navigation/prefetch-link";
import { routes } from "@/lib/routes";
import { MaterialIcon } from "@/components/ui/material-icon";

type DesktopSidebarProps = {
  active: "home" | "explore" | "collections" | "profile";
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

export function DesktopSidebar({ active }: DesktopSidebarProps) {
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
        <button className="flex w-full items-center justify-center rounded-2xl bg-primary py-4 font-bold text-on-primary shadow-[0_8px_20px_rgba(129,39,207,0.3)] transition-all hover:scale-105 active:scale-95">
          <MaterialIcon className="lg:mr-2">add_circle</MaterialIcon>
          <span className="hidden lg:block">Post Meme</span>
        </button>
      </div>
    </aside>
  );
}
