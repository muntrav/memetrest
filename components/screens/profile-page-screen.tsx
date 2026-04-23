import React from "react";
import Link from "next/link";
import { AuthRequiredState } from "@/components/auth/auth-required-state";
import { LogoutButton } from "@/components/auth/logout-button";
import { DesktopPageShell } from "@/components/navigation/desktop-page-shell";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { AppImage } from "@/components/ui/app-image";
import { MaterialIcon } from "@/components/ui/material-icon";
import type { AuthSession } from "@/lib/auth/types";
import { toViewerSummary } from "@/lib/auth/viewer";
import type { CollectionBoard, CollectionsSummary } from "@/lib/collections/types";
import { boardDetailHref, routes } from "@/lib/routes";

type ProfilePageScreenProps = {
  authSession: AuthSession | null;
  recentBoards: CollectionBoard[];
  collectionsSummary: CollectionsSummary;
};

export function ProfilePageScreen({
  authSession,
  recentBoards,
  collectionsSummary
}: ProfilePageScreenProps) {
  const viewer = toViewerSummary(authSession);

  if (!authSession) {
    return (
      <div className="min-h-screen bg-background font-body-md text-on-background">
        <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
          <AuthRequiredState
            description="Your personal profile, boards, and account controls become available after sign-in."
            nextPath={routes.profile}
            title="Sign in to open your profile"
          />
        </div>
      </div>
    );
  }

  const { profile, user } = authSession;

  return (
    <div className="min-h-screen bg-background font-body-md text-on-background">
      <DesktopPageShell
        active="profile"
        description="Your live account dashboard now reads from the real session and account data instead of a mock creator profile."
        title={`@${profile.username}`}
        viewer={viewer}
        toolbar={
          <>
            <Link
              className="rounded-full border border-outline-variant/40 bg-white px-5 py-3 font-label-sm text-on-surface transition-colors hover:bg-surface-container"
              href={routes.collections}
            >
              Open boards
            </Link>
            <LogoutButton
              className="rounded-full bg-primary px-5 py-3 font-label-sm text-on-primary shadow-lg shadow-primary/20"
              label="Log out"
            />
          </>
        }
      >
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <section className="rounded-[32px] border border-white/30 bg-white/75 p-8 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="h-28 w-28 rounded-full bg-gradient-to-tr from-primary to-tertiary p-1 shadow-lg">
                      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-white bg-primary-container text-primary">
                        {profile.avatarUrl ? (
                          <AppImage
                            alt={profile.displayName}
                            className="h-full w-full object-cover"
                            height={112}
                            priority
                            src={profile.avatarUrl}
                            width={112}
                          />
                        ) : (
                          <span className="text-3xl font-black">
                            {profile.displayName.slice(0, 1).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="max-w-2xl">
                    <p className="font-label-sm uppercase tracking-[0.24em] text-primary">
                      Account dashboard
                    </p>
                    <h2 className="mt-2 text-3xl font-black tracking-tight text-on-surface">
                      {profile.displayName}
                    </h2>
                    <p className="mt-1 text-lg text-on-surface-variant">@{profile.username}</p>
                    <p className="mt-3 text-on-surface-variant">
                      {profile.bio || "Add a bio later. Your account is live and ready for boards, saves, and uploads."}
                    </p>
                  </div>
                </div>

                <div className="grid min-w-[320px] grid-cols-3 gap-sm rounded-3xl border border-outline-variant/30 bg-surface-container-low p-sm shadow-sm">
                  <div className="flex flex-col items-center py-xs">
                    <span className="font-headline-md text-primary">{profile.followerCount}</span>
                    <span className="font-label-sm uppercase tracking-wider text-on-surface-variant">
                      Followers
                    </span>
                  </div>
                  <div className="flex flex-col items-center border-x border-outline-variant/50 py-xs">
                    <span className="font-headline-md text-primary">{collectionsSummary.totalItemCount}</span>
                    <span className="font-label-sm uppercase tracking-wider text-on-surface-variant">
                      Saved
                    </span>
                  </div>
                  <div className="flex flex-col items-center py-xs">
                    <span className="font-headline-md text-primary">{profile.postCount}</span>
                    <span className="font-label-sm uppercase tracking-wider text-on-surface-variant">
                      Uploads
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[32px] border border-white/30 bg-white/75 p-6 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl">
              <nav className="mb-6 flex items-center gap-3 border-b border-outline-variant/20 pb-4">
                <div className="rounded-full bg-primary-container px-5 py-3 font-label-sm text-primary">
                  Boards
                </div>
                <div className="rounded-full px-5 py-3 font-label-sm text-on-surface-variant">
                  Session
                </div>
                <div className="rounded-full px-5 py-3 font-label-sm text-on-surface-variant">
                  Privacy
                </div>
              </nav>

              {recentBoards.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                  {recentBoards.slice(0, 6).map((board) => (
                    <Link
                      className="group overflow-hidden rounded-[24px] bg-white shadow-[0_8px_32px_rgba(168,85,247,0.08)] transition-transform duration-200 hover:scale-[1.02]"
                      href={boardDetailHref(board.slug ?? board.id)}
                      key={board.id}
                    >
                      <div className="relative">
                        <AppImage
                          alt={board.title}
                          className="aspect-[4/5] w-full object-cover"
                          sizes="(max-width: 1536px) 50vw, 33vw"
                          src={board.previewImages[0]}
                        />
                        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-sm opacity-100 transition-opacity">
                          <span className="font-semibold text-white">
                            {board.title} · {board.itemCount} items
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-[24px] border border-dashed border-outline-variant/40 bg-background/60 px-6 py-12 text-center">
                  <p className="text-lg font-bold text-on-surface">No boards yet</p>
                  <p className="mx-auto mt-2 max-w-md text-sm text-on-surface-variant">
                    Create your first board from Collections and saved memes will start showing here.
                  </p>
                  <Link
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-label-sm text-on-primary shadow-lg shadow-primary/20"
                    href={routes.collections}
                  >
                    <MaterialIcon>collections_bookmark</MaterialIcon>
                    Open Collections
                  </Link>
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[28px] border border-white/30 bg-white/75 p-6 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl">
              <h2 className="font-headline-md text-on-surface">Session details</h2>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-background/80 p-4">
                  <p className="font-semibold text-on-surface">Email</p>
                  <p className="mt-1 break-all text-sm text-on-surface-variant">{user.email}</p>
                </div>
                <div className="rounded-2xl bg-background/80 p-4">
                  <p className="font-semibold text-on-surface">Privacy</p>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {profile.visibility === "private" ? "Private profile" : "Public profile"}
                  </p>
                </div>
                <div className="rounded-2xl bg-background/80 p-4">
                  <p className="font-semibold text-on-surface">Boards</p>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {collectionsSummary.boardCount} total · {collectionsSummary.privateBoardCount} private
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/30 bg-gradient-to-br from-secondary-container via-white to-white p-6 shadow-[0_18px_50px_rgba(129,39,207,0.08)]">
              <h2 className="font-headline-md text-on-surface">Quick actions</h2>
              <div className="mt-5 space-y-3">
                <Link
                  className="flex w-full items-center justify-between rounded-2xl bg-white/80 px-4 py-4 text-left"
                  href={routes.collections}
                >
                  <span className="font-semibold text-on-surface">Manage boards</span>
                  <MaterialIcon className="text-primary">collections_bookmark</MaterialIcon>
                </Link>
                <LogoutButton
                  className="flex w-full items-center justify-between rounded-2xl bg-white/80 px-4 py-4 text-left font-semibold text-on-surface"
                  label="Sign out from this device"
                />
              </div>
            </section>
          </aside>
        </div>
      </DesktopPageShell>

      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 shadow-[0_8px_32px_rgba(168,85,247,0.08)] backdrop-blur-xl md:hidden">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
          <Link className="flex items-center gap-base" href={routes.search}>
            <MaterialIcon className="text-purple-600">search</MaterialIcon>
          </Link>
          <Link href={routes.home}>
            <h1 className="text-lg font-bold tracking-tight text-purple-600">Memetrest</h1>
          </Link>
          <LogoutButton
            className="rounded-full border border-outline-variant/40 px-3 py-2 text-xs font-semibold text-on-surface"
            label="Log out"
          />
        </div>
      </header>

      <main className="pb-24 md:hidden">
        <section className="flex flex-col items-center px-margin-mobile pb-md pt-lg">
          <div className="relative mb-md">
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary to-tertiary p-1 shadow-lg">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-white bg-primary-container text-primary">
                {profile.avatarUrl ? (
                  <AppImage
                    alt={profile.displayName}
                    className="h-full w-full object-cover"
                    height={96}
                    priority
                    src={profile.avatarUrl}
                    width={96}
                  />
                ) : (
                  <span className="text-2xl font-black">
                    {profile.displayName.slice(0, 1).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mb-lg text-center">
            <h2 className="mb-xs text-headline-md font-headline-md text-on-surface">
              {profile.displayName}
            </h2>
            <p className="text-sm text-on-surface-variant">@{profile.username}</p>
            <p className="mt-3 px-lg font-body-md text-on-surface-variant">
              {profile.bio || "Your account is live. Start saving memes and building boards."}
            </p>
          </div>

          <div className="grid w-full max-w-md grid-cols-3 gap-sm rounded-2xl border border-outline-variant/30 bg-surface-container-low p-sm shadow-sm">
            <div className="flex flex-col items-center py-xs">
              <span className="font-headline-md text-primary">{profile.followerCount}</span>
              <span className="font-label-sm uppercase tracking-wider text-on-surface-variant">Followers</span>
            </div>
            <div className="flex flex-col items-center border-x border-outline-variant/50 py-xs">
              <span className="font-headline-md text-primary">{collectionsSummary.totalItemCount}</span>
              <span className="font-label-sm uppercase tracking-wider text-on-surface-variant">Saved</span>
            </div>
            <div className="flex flex-col items-center py-xs">
              <span className="font-headline-md text-primary">{profile.postCount}</span>
              <span className="font-label-sm uppercase tracking-wider text-on-surface-variant">Uploads</span>
            </div>
          </div>
        </section>

        <section className="px-margin-mobile">
          {recentBoards.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {recentBoards.slice(0, 4).map((board) => (
                <Link
                  className="group overflow-hidden rounded-xl bg-white shadow-[0_8px_32px_rgba(168,85,247,0.08)] transition-transform duration-200 hover:scale-[1.02]"
                  href={boardDetailHref(board.slug ?? board.id)}
                  key={board.id}
                >
                  <div className="relative">
                    <AppImage alt={board.title} className="aspect-[4/5] w-full object-cover" sizes="50vw" src={board.previewImages[0]} />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-sm">
                      <span className="font-semibold text-white">{board.title}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-outline-variant/40 bg-background/60 px-6 py-12 text-center">
              <p className="text-lg font-bold text-on-surface">No boards yet</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-on-surface-variant">
                Open Collections to create your first board.
              </p>
            </div>
          )}
        </section>
      </main>

      <MobileBottomNav active="profile" className="md:hidden" />
    </div>
  );
}
