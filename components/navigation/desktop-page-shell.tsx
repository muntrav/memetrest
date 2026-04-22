import React, { type ReactNode } from "react";
import { DesktopSidebar } from "@/components/navigation/desktop-sidebar";

type DesktopPageShellProps = {
  active: "home" | "explore" | "collections" | "profile";
  title: string;
  description?: string;
  toolbar?: ReactNode;
  children: ReactNode;
};

export function DesktopPageShell({
  active,
  title,
  description,
  toolbar,
  children
}: DesktopPageShellProps) {
  return (
    <div className="hidden min-h-screen bg-background text-on-background md:block">
      <DesktopSidebar active={active} />
      <main className="md:ml-24 lg:ml-64">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <header className="mb-8 flex flex-wrap items-start justify-between gap-4 rounded-[32px] border border-white/30 bg-white/70 px-6 py-6 shadow-[0_20px_60px_rgba(129,39,207,0.08)] backdrop-blur-xl">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-black tracking-tight text-on-surface">{title}</h1>
              {description ? (
                <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">{description}</p>
              ) : null}
            </div>
            {toolbar ? <div className="flex flex-wrap items-center gap-3">{toolbar}</div> : null}
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}
