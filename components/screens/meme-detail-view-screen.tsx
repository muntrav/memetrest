import React from "react";
import Link from "next/link";
import { BackButton } from "@/components/navigation/back-button";
import { DesktopPageShell } from "@/components/navigation/desktop-page-shell";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { AppImage } from "@/components/ui/app-image";
import { MaterialIcon } from "@/components/ui/material-icon";
import type { FeedCardViewModel } from "@/lib/posts/presentation";
import { routes } from "@/lib/routes";

type MemeDetailScreenPost = FeedCardViewModel & {
  savedBoardCount: number;
  followerCountLabel: string | null;
};

type MemeDetailViewScreenProps = {
  post: MemeDetailScreenPost | null;
  relatedItems: FeedCardViewModel[];
  statusTitle: string | null;
  statusDescription: string | null;
};

function DetailStatus({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-outline-variant/40 bg-background/60 px-6 py-12 text-center">
      <p className="text-lg font-bold text-on-surface">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-on-surface-variant">{description}</p>
      <div className="mt-6">
        <Link
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-label-sm text-on-primary shadow-lg shadow-primary/20"
          href={routes.home}
        >
          <MaterialIcon>arrow_back</MaterialIcon>
          Back to feed
        </Link>
      </div>
    </div>
  );
}

export function MemeDetailViewScreen({
  post,
  relatedItems,
  statusTitle,
  statusDescription
}: MemeDetailViewScreenProps) {
  const resolvedTitle = post?.headline ?? "Meme Detail";
  const resolvedStatusTitle = statusTitle ?? (post ? null : "No meme selected yet");
  const resolvedStatusDescription =
    statusDescription ??
    (post
      ? null
      : "Open any meme from the home feed or discovery page and its live detail view will render here.");

  return (
    <div className="min-h-screen bg-background font-body-md text-on-background">
      <DesktopPageShell
        active="explore"
        description="Desktop detail view prioritizes the meme canvas and creator metadata side by side, instead of reusing the stacked mobile composition."
        title={resolvedTitle}
        toolbar={
          <>
            <BackButton
              className="rounded-full border border-outline-variant/40 bg-white px-5 py-3 font-label-sm text-on-surface transition-colors hover:bg-surface-container"
              fallbackHref={routes.home}
            >
              Back to feed
            </BackButton>
            <button
              className="rounded-full bg-primary px-5 py-3 font-label-sm text-on-primary shadow-lg shadow-primary/20"
              type="button"
            >
              Follow creator
            </button>
          </>
        }
      >
        {post ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_380px]">
            <section className="rounded-[32px] border border-white/30 bg-white/75 p-6 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl">
              <div className="relative overflow-hidden rounded-[28px] bg-surface-container-lowest">
                <div className="relative w-full bg-zinc-100" style={{ aspectRatio: post.aspectRatio }}>
                  <AppImage
                    alt={post.imageAlt}
                    className="h-full w-full object-contain"
                    priority
                    src={post.imageUrl}
                  />
                  <div className="absolute bottom-5 right-5 flex gap-3">
                    <button
                      className="glass-blur flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-error shadow-xl transition-all hover:scale-105"
                      type="button"
                    >
                      <MaterialIcon className="text-3xl" filled>
                        favorite
                      </MaterialIcon>
                    </button>
                    <button
                      className="glass-blur flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-on-surface shadow-xl transition-all hover:scale-105"
                      type="button"
                    >
                      <MaterialIcon className="text-3xl">share</MaterialIcon>
                    </button>
                  </div>
                </div>
              </div>

              <section className="mt-6">
                <h2 className="mb-4 font-headline-md text-on-surface">More like this</h2>
                {relatedItems.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-3">
                    {relatedItems.map((item) => (
                      <Link
                        className="relative overflow-hidden rounded-[24px] bg-white shadow-sm"
                        href={item.href}
                        key={item.id}
                        style={{ aspectRatio: item.aspectRatio }}
                      >
                        <AppImage
                          alt={item.imageAlt}
                          className="h-full w-full object-cover"
                          sizes="(max-width: 1536px) 33vw, 25vw"
                          src={item.imageUrl}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-xs">
                          <div className="flex items-center gap-xs">
                            <MaterialIcon className="text-sm text-white" filled>
                              favorite
                            </MaterialIcon>
                            <span className="text-[10px] font-label-sm text-white">
                              {item.saveCountLabel}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-on-surface-variant">
                    Related memes will appear here once more live content exists.
                  </p>
                )}
              </section>
            </section>

            <aside className="space-y-6">
              <section className="rounded-[32px] border border-white/30 bg-white/75 p-6 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <Link className="flex items-center gap-sm" href={routes.profile}>
                    <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-primary-container bg-surface-container-high">
                      {post.creatorAvatarUrl ? (
                        <AppImage
                          alt={post.creatorName}
                          className="h-full w-full object-cover"
                          height={48}
                          src={post.creatorAvatarUrl}
                          width={48}
                        />
                      ) : null}
                    </div>
                    <div>
                      <h3 className="font-headline-md text-body-md text-on-surface">
                        {post.creatorName}
                      </h3>
                      <p className="text-[11px] font-label-sm text-outline">
                        {post.followerCountLabel
                          ? `${post.followerCountLabel} followers`
                          : post.creatorUsername}
                      </p>
                    </div>
                  </Link>
                  <button
                    className="rounded-full bg-primary px-gutter py-2 font-label-sm text-on-primary shadow-lg shadow-primary/20"
                    type="button"
                  >
                    Follow
                  </button>
                </div>

                <div className="mt-6 space-y-xs">
                  <h1 className="font-headline-md leading-tight text-on-surface">{post.headline}</h1>
                  <p className="text-sm text-on-surface-variant">{post.supportingText}</p>
                  <div className="flex flex-wrap gap-xs">
                    {post.tags.length > 0 ? (
                      post.tags.map((tag, index) => (
                        <span
                          className={[
                            "rounded-full px-sm py-1 text-[10px] font-label-sm",
                            index === 0
                              ? "bg-primary-fixed-dim text-on-primary-fixed-variant"
                              : "bg-surface-variant text-on-surface-variant"
                          ].join(" ")}
                          key={tag}
                        >
                          #{tag}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full bg-surface-variant px-sm py-1 text-[10px] font-label-sm text-on-surface-variant">
                        Live post
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-sm">
                  <Link
                    className="flex items-center justify-center gap-xs rounded-xl bg-secondary py-md font-label-sm text-on-secondary shadow-md"
                    href={routes.collections}
                  >
                    <MaterialIcon>bookmark</MaterialIcon>
                    Save to Board
                  </Link>
                  <button
                    className="flex items-center justify-center gap-xs rounded-xl bg-surface-container-high py-md font-label-sm text-on-secondary-container"
                    type="button"
                  >
                    <MaterialIcon>download</MaterialIcon>
                    Download
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-on-surface-variant">
                  <span>{post.saveCountLabel} saves</span>
                  <span>{post.savedBoardCount} of your boards</span>
                </div>
              </section>

              <section className="rounded-[32px] border border-white/30 bg-white/75 p-6 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl">
                <p className="text-[10px] font-label-sm uppercase tracking-wider text-outline">
                  Share with your squad
                </p>
                <div className="mt-4 flex gap-md">
                  {[
                    { label: "WhatsApp", bg: "bg-[#25D366]", icon: "chat" },
                    { label: "Telegram", bg: "bg-[#0088cc]", icon: "send" },
                    { label: "Copy", bg: "bg-zinc-200", icon: "link", text: "text-zinc-600" }
                  ].map((item) => (
                    <button className="group flex flex-col items-center gap-xs" key={item.label} type="button">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full ${item.bg} ${item.text ?? "text-white"} shadow-lg transition-transform group-hover:scale-105`}
                      >
                        <MaterialIcon className="text-2xl">{item.icon}</MaterialIcon>
                      </div>
                      <span className="text-[10px] font-label-sm">{item.label}</span>
                    </button>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        ) : (
          <DetailStatus
            description={resolvedStatusDescription ?? "No live content available yet."}
            title={resolvedStatusTitle ?? "No meme selected yet"}
          />
        )}
      </DesktopPageShell>

      <nav className="sticky top-0 z-50 border-b border-white/20 bg-white/80 shadow-[0_8px_32px_rgba(168,85,247,0.08)] backdrop-blur-xl md:hidden">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
          <BackButton
            className="text-zinc-500 transition-transform duration-200 hover:scale-105"
            fallbackHref={routes.home}
          >
            <MaterialIcon>arrow_back</MaterialIcon>
          </BackButton>
          <Link href={routes.home}>
            <span className="text-2xl font-black tracking-tighter text-purple-600">Memetrest</span>
          </Link>
          <div className="flex items-center gap-4">
            <MaterialIcon className="text-zinc-500">more_vert</MaterialIcon>
          </div>
        </div>
      </nav>

      <main className="pb-24 md:hidden">
        {post ? (
          <>
            <section className="w-full overflow-hidden bg-surface-container-lowest">
              <div className="relative w-full bg-zinc-100" style={{ aspectRatio: post.aspectRatio }}>
                <AppImage
                  alt={post.imageAlt}
                  className="h-full w-full object-contain"
                  priority
                  src={post.imageUrl}
                />
                <div className="absolute bottom-4 right-4 flex flex-col gap-4">
                  <button
                    className="glass-blur flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-error shadow-xl transition-all active:scale-95"
                    type="button"
                  >
                    <MaterialIcon className="text-3xl" filled>
                      favorite
                    </MaterialIcon>
                  </button>
                </div>
              </div>
            </section>

            <section className="space-y-md px-margin-mobile pt-sm">
              <div className="flex items-center justify-between">
                <Link className="flex items-center gap-sm" href={routes.profile}>
                  <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary-container bg-surface-container-high">
                    {post.creatorAvatarUrl ? (
                      <AppImage
                        alt={post.creatorName}
                        className="h-full w-full object-cover"
                        height={40}
                        src={post.creatorAvatarUrl}
                        width={40}
                      />
                    ) : null}
                  </div>
                  <div>
                    <h3 className="font-headline-md text-body-md text-on-surface">
                      {post.creatorName}
                    </h3>
                    <p className="text-[11px] font-label-sm text-outline">
                      {post.followerCountLabel
                        ? `${post.followerCountLabel} followers`
                        : post.creatorUsername}
                    </p>
                  </div>
                </Link>
                <button
                  className="rounded-full bg-primary px-gutter py-2 font-label-sm text-on-primary shadow-lg shadow-primary/20 transition-transform active:scale-95"
                  type="button"
                >
                  Follow
                </button>
              </div>

              <div className="space-y-xs">
                <h1 className="font-headline-md leading-tight text-on-surface">{post.headline}</h1>
                <p className="text-sm text-on-surface-variant">{post.supportingText}</p>
                <div className="flex flex-wrap gap-xs">
                  {post.tags.length > 0 ? (
                    post.tags.map((tag, index) => (
                      <span
                        className={[
                          "rounded-full px-sm py-1 text-[10px] font-label-sm",
                          index === 0
                            ? "bg-primary-fixed-dim text-on-primary-fixed-variant"
                            : "bg-surface-variant text-on-surface-variant"
                        ].join(" ")}
                        key={tag}
                      >
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full bg-surface-variant px-sm py-1 text-[10px] font-label-sm text-on-surface-variant">
                      Live post
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <Link
                  className="flex items-center justify-center gap-xs rounded-xl bg-secondary py-md font-label-sm text-on-secondary shadow-md transition-all active:scale-95"
                  href={routes.collections}
                >
                  <MaterialIcon>bookmark</MaterialIcon>
                  Save to Board
                </Link>
                <button
                  className="flex items-center justify-center gap-xs rounded-xl bg-surface-container-high py-md font-label-sm text-on-secondary-container transition-all active:scale-95"
                  type="button"
                >
                  <MaterialIcon>download</MaterialIcon>
                  Download
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span>{post.saveCountLabel} saves</span>
                <span>{post.savedBoardCount} of your boards</span>
              </div>

              <div className="space-y-sm">
                <p className="text-[10px] font-label-sm uppercase tracking-wider text-outline">
                  Share with your squad
                </p>
                <div className="flex gap-md">
                  {[
                    { label: "WhatsApp", bg: "bg-[#25D366]", icon: "chat" },
                    { label: "Telegram", bg: "bg-[#0088cc]", icon: "send" },
                    { label: "Copy", bg: "bg-zinc-200", icon: "link", text: "text-zinc-600" }
                  ].map((item) => (
                    <button className="group flex flex-col items-center gap-xs" key={item.label} type="button">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full ${item.bg} ${item.text ?? "text-white"} shadow-lg transition-transform group-active:scale-90`}
                      >
                        <MaterialIcon className="text-2xl">{item.icon}</MaterialIcon>
                      </div>
                      <span className="text-[10px] font-label-sm">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-lg px-margin-mobile">
              <h2 className="mb-gutter font-headline-md text-on-surface">More like this</h2>
              {relatedItems.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {relatedItems.map((item) => (
                    <Link
                      className="relative overflow-hidden rounded-xl bg-white shadow-sm"
                      href={item.href}
                      key={item.id}
                      style={{ aspectRatio: item.aspectRatio }}
                    >
                      <AppImage
                        alt={item.imageAlt}
                        className="h-full w-full object-cover"
                        sizes="50vw"
                        src={item.imageUrl}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-xs">
                        <div className="flex items-center gap-xs">
                          <MaterialIcon className="text-sm text-white" filled>
                            favorite
                          </MaterialIcon>
                          <span className="text-[10px] font-label-sm text-white">
                            {item.saveCountLabel}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant">
                  Related content will appear once more live memes are available.
                </p>
              )}
            </section>
          </>
        ) : (
          <section className="px-margin-mobile pt-6">
            <DetailStatus
              description={resolvedStatusDescription ?? "No live content available yet."}
              title={resolvedStatusTitle ?? "No meme selected yet"}
            />
          </section>
        )}
      </main>

      <MobileBottomNav active="explore" asFooter className="md:hidden" />
    </div>
  );
}
