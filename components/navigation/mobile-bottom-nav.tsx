import React from "react";
import { PrefetchLink } from "@/components/navigation/prefetch-link";
import { routes, type RoutePath } from "@/lib/routes";
import { MaterialIcon } from "@/components/ui/material-icon";

type NavKey = "home" | "explore" | "collections" | "profile";

type MobileBottomNavProps = {
  active: NavKey;
  homeRoute?: RoutePath;
  showLabels?: boolean;
  asFooter?: boolean;
  className?: string;
};

export function MobileBottomNav({
  active,
  homeRoute = routes.home,
  showLabels = false,
  asFooter = false,
  className
}: MobileBottomNavProps) {
  const items = [
    { key: "home", href: homeRoute, icon: "home", label: "Home" },
    { key: "explore", href: routes.search, icon: "explore", label: "Explore" },
    {
      key: "collections",
      href: routes.collections,
      icon: "collections_bookmark",
      label: "Saved"
    },
    { key: "profile", href: routes.profile, icon: "person", label: "Profile" }
  ] as const;

  const Wrapper = asFooter ? "footer" : "nav";

  return (
    <Wrapper
      className={[
        "fixed bottom-0 left-0 z-50 w-full rounded-t-2xl border-t border-white/20 bg-white/80 shadow-[0_-8px_32px_rgba(168,85,247,0.12)] backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/80",
        className
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex h-20 w-full items-center justify-around px-6 pb-safe">
        {items.map((item) => {
          const isActive = item.key === active;
          return (
            <PrefetchLink
              aria-label={item.label}
              className={[
                "p-2 transition-colors flex items-center",
                showLabels ? "flex-col" : "",
                isActive
                  ? "scale-110 rounded-xl bg-purple-100/50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300"
                  : "text-zinc-400 hover:bg-purple-50 dark:text-zinc-500 dark:hover:bg-zinc-800"
              ].join(" ")}
              href={item.href}
              key={item.key}
            >
              <MaterialIcon filled={isActive}>{item.icon}</MaterialIcon>
              {showLabels ? (
                <span className="font-['Plus_Jakarta_Sans'] text-[10px] font-semibold">
                  {item.label}
                </span>
              ) : null}
            </PrefetchLink>
          );
        })}
      </div>
    </Wrapper>
  );
}
