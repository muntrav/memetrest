import React from "react";

type RouteLoadingScreenProps = {
  title: string;
  accent?: string;
};

export function RouteLoadingScreen({
  title,
  accent = "from-primary/20 via-primary-container/40 to-secondary/20"
}: RouteLoadingScreenProps) {
  return (
    <div className="min-h-screen bg-background text-on-background">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8 lg:px-10">
        <div className={`mb-8 rounded-[32px] border border-white/30 bg-gradient-to-r ${accent} px-6 py-6 shadow-[0_20px_60px_rgba(129,39,207,0.08)]`}>
          <div className="h-4 w-32 animate-pulse rounded-full bg-white/60" />
          <div className="mt-4 h-10 w-56 animate-pulse rounded-full bg-white/80" />
          <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded-full bg-white/55" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <section className="space-y-6">
            <div className="rounded-[28px] border border-white/30 bg-white/75 p-6 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl">
              <div className="h-12 animate-pulse rounded-full bg-surface-container" />
              <div className="mt-5 flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div className="h-9 w-24 animate-pulse rounded-full bg-surface-container" key={`${title}-chip-${index}`} />
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/30 bg-white/75 p-6 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl">
              <div className="h-6 w-36 animate-pulse rounded-full bg-surface-container" />
              <div className="mt-5 space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div className="h-20 animate-pulse rounded-2xl bg-surface-container" key={`${title}-list-${index}`} />
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/30 bg-white/75 p-6 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div className="h-6 w-40 animate-pulse rounded-full bg-surface-container" />
              <div className="h-4 w-32 animate-pulse rounded-full bg-surface-container" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  className="aspect-[4/5] animate-pulse rounded-[24px] bg-surface-container"
                  key={`${title}-card-${index}`}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
