import React from "react";
import Link from "next/link";
import { DesktopPageShell } from "@/components/navigation/desktop-page-shell";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { AppImage } from "@/components/ui/app-image";
import { MaterialIcon } from "@/components/ui/material-icon";
import { routes } from "@/lib/routes";

const savedItems = [
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBzwxUAfy_s7aD-rVdm_18eNL42oSqRRX0DgTS9CWRWGLyrkC-HeE5JQPjdpQA6rkctVUXegdUs6F5SLmGDfQNZZzIPpAzbEJNiEEfGZLvjxMa-24E6H1rUGF_IOrgniUQ5kF0oFiFju7umAphOA9eIyg9ATbqbWtlu28d2KwhuwFcV-yq_VKnbX9CzyQ0nqzbZJx8N4aFXH_OFrPhF7aKmxrlJWITBpxZWoN_ixs_e_eNlbUahcoaKMZmsorNBcp3SOOFxJTsz4Fr3",
    alt: "funny pug dog wearing oversized sunglasses and a colorful Hawaiian shirt sitting on a beach chair under a bright sun",
    ratio: "aspect-[4/5]",
    label: 'Saved to "Animals"'
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBhX86VbHA_yPfPjmwOW13dH6gI1S1-p8k44XuJGPSpdijoA-NZrVWIhLuc0E67xxgipBq7madmteiw9WwZKM7WAXHGunmH3YIiTBPoNbLNY_4mrnOOtRTi8waE-SVaD7K1oriaFZfCawGcZO47ztrZLV6-5jHlOBP642oFouJSPc32PsQrKUXaqpB6ctkdieR6IUKtohbA03VA_etw7Kn4f4bvDthAg1xJlKWWWLrk0oLLoYdrItXZ6EXVEXXPN6nZ_CeUuZHLABpW",
    alt: "vintage 90s aesthetic computer setup with neon vaporwave lighting and retro gaming hardware on a desk",
    ratio: "aspect-[1/1]",
    label: 'Saved to "Tech Nostalgia"'
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBSXMFY1_DvsGZ9qTm9u3FcRaat0OUHe8GJdLUG18cdDvkQclT5amrtEMn9W5x8GfUCY1hhVFGpakDo7dystdYEqBaV5pXfKl7qrIE5h0GO2r_917OwoejYdCTWILx2n_59x5Ey-41Q7WJ9PwTxSAUT2LKNBmQrjtOyGsSS74VnL4r0bSf5q1qoyiaC4TXDt3BswfSbu_eldvWJhOiQZqQlHwAaLi2P5_cIf6B_Rq3D0YAO-Z4WKaf_pInJyKO9M8tP-H2MXeFBEnRp",
    alt: "abstract digital art with flowing geometric shapes in vibrant neon purple and pink gradients with grainy texture",
    ratio: "aspect-[3/4]",
    label: 'Saved to "Mood"'
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCMB1QNNoyEXzK3oDgtzOTrih28pZAJeDHhUlTDf1Z26M0_G3Bzr7T3byJuvTq-ShYPmtMf7taW118w0VLZMSbyiAW2zs9wM8by5arVhQz3EeFLgeewOavDAzJtuXDGGgr1N1YVdu_gy4nDkIoBDngOhwc8VOvnZ8oIYzMCDhsJOHBuvArBefgEMnVWpAHgDFTgtVFOZQn2FcESMFuWoefd4mRonEFdx6Rn7e2uTQaxr6xud_0CDSX39ce1pVLhmjFwT0om75t2-sgx",
    alt: "surprised ginger cat looking directly at camera with wide eyes and open mouth in high resolution close up",
    ratio: "aspect-[4/5]",
    label: 'Saved to "Reactions"'
  }
] as const;

export function ProfilePageScreen() {
  return (
    <div className="min-h-screen bg-background font-body-md text-on-background">
      <DesktopPageShell
        active="profile"
        description="Desktop profile uses a creator dashboard layout with stats and saved collections surfaced beside the content grid."
        title="@meme_lord_99"
        toolbar={
          <>
            <button
              className="rounded-full border border-outline-variant/40 bg-white px-5 py-3 font-label-sm text-on-surface transition-colors hover:bg-surface-container"
              type="button"
            >
              Share profile
            </button>
            <button
              className="rounded-full bg-primary px-5 py-3 font-label-sm text-on-primary shadow-lg shadow-primary/20"
              type="button"
            >
              Edit profile
            </button>
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
                      <div className="h-full w-full overflow-hidden rounded-full border-4 border-white">
                        <AppImage
                          alt="Close up of a stylized digital avatar with a trendy haircut and cheerful expression for a social profile"
                          className="h-full w-full object-cover"
                          height={112}
                          priority
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvwQ5-zVZmYqYGiBuswp2eQVgR0us-sSpv6Ls2cvjz7eK-293U8Vh7QTokMnyjDf_tLMWmRLsXZ4RU06o1JfnmdhEs3NryJAZ8re8BCkNSf3AD6uyJVgW9ZuTBsqy1q_ov5N7UUWyHmZj3y_EOPoxN0w-838wJD7V3HwXdqdMRb78oyrk7z4hpOgPieQiIHXHo0Q-hc1xRrcuA5h7rVweox_h3BoPPKzXAA3foTZTm0o0SKfY5o4cq-d1NeRDAZx5vdeEOxXMkrn9h"
                          width={112}
                        />
                      </div>
                    </div>
                    <div className="absolute bottom-1 right-1 rounded-full border-2 border-white bg-primary p-2 text-white">
                      <MaterialIcon filled className="text-[16px]">
                        add
                      </MaterialIcon>
                    </div>
                  </div>

                  <div className="max-w-2xl">
                    <p className="font-label-sm uppercase tracking-[0.24em] text-primary">
                      Creator dashboard
                    </p>
                    <h2 className="mt-2 text-3xl font-black tracking-tight text-on-surface">
                      @meme_lord_99
                    </h2>
                    <p className="mt-3 text-on-surface-variant">
                      Curating the finest digital artifacts for the terminally online.
                    </p>
                  </div>
                </div>

                <div className="grid min-w-[320px] grid-cols-3 gap-sm rounded-3xl border border-outline-variant/30 bg-surface-container-low p-sm shadow-sm">
                  <div className="flex flex-col items-center py-xs">
                    <span className="font-headline-md text-primary">12.4k</span>
                    <span className="font-label-sm uppercase tracking-wider text-on-surface-variant">
                      Followers
                    </span>
                  </div>
                  <div className="flex flex-col items-center border-x border-outline-variant/50 py-xs">
                    <span className="font-headline-md text-primary">842</span>
                    <span className="font-label-sm uppercase tracking-wider text-on-surface-variant">
                      Saved
                    </span>
                  </div>
                  <div className="flex flex-col items-center py-xs">
                    <span className="font-headline-md text-primary">156</span>
                    <span className="font-label-sm uppercase tracking-wider text-on-surface-variant">
                      Uploads
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[32px] border border-white/30 bg-white/75 p-6 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl">
              <nav className="mb-6 flex items-center gap-3 border-b border-outline-variant/20 pb-4">
                <button
                  className="rounded-full bg-primary-container px-5 py-3 font-label-sm text-primary"
                  type="button"
                >
                  Saved
                </button>
                <button
                  className="rounded-full px-5 py-3 font-label-sm text-on-surface-variant"
                  type="button"
                >
                  Uploaded
                </button>
                <button
                  className="rounded-full px-5 py-3 font-label-sm text-on-surface-variant"
                  type="button"
                >
                  Boards
                </button>
              </nav>

              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {savedItems.map((item) => (
                  <Link
                    className="group overflow-hidden rounded-[24px] bg-white shadow-[0_8px_32px_rgba(168,85,247,0.08)] transition-transform duration-200 hover:scale-[1.02]"
                    href={routes.detail}
                    key={item.image}
                  >
                    <div className="relative">
                      <AppImage
                        alt={item.alt}
                        className={`w-full object-cover ${item.ratio}`}
                        sizes="(max-width: 1536px) 50vw, 33vw"
                        src={item.image}
                      />
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-sm opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="font-semibold text-white">{item.label}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[28px] border border-white/30 bg-white/75 p-6 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl">
              <h2 className="font-headline-md text-on-surface">Profile highlights</h2>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-background/80 p-4">
                  <p className="font-semibold text-on-surface">Top board</p>
                  <p className="mt-1 text-sm text-on-surface-variant">Reactions updated 2h ago</p>
                </div>
                <div className="rounded-2xl bg-background/80 p-4">
                  <p className="font-semibold text-on-surface">Growth</p>
                  <p className="mt-1 text-sm text-on-surface-variant">+324 followers this week</p>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/30 bg-gradient-to-br from-secondary-container via-white to-white p-6 shadow-[0_18px_50px_rgba(129,39,207,0.08)]">
              <h2 className="font-headline-md text-on-surface">Quick actions</h2>
              <div className="mt-5 space-y-3">
                <button
                  className="flex w-full items-center justify-between rounded-2xl bg-white/80 px-4 py-4 text-left"
                  type="button"
                >
                  <span className="font-semibold text-on-surface">Create board</span>
                  <MaterialIcon className="text-primary">collections_bookmark</MaterialIcon>
                </button>
                <button
                  className="flex w-full items-center justify-between rounded-2xl bg-white/80 px-4 py-4 text-left"
                  type="button"
                >
                  <span className="font-semibold text-on-surface">Upload meme</span>
                  <MaterialIcon className="text-primary">upload</MaterialIcon>
                </button>
              </div>
            </section>
          </aside>
        </div>
      </DesktopPageShell>

      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 shadow-[0_8px_32px_rgba(168,85,247,0.08)] backdrop-blur-xl md:hidden">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
          <Link className="flex items-center gap-base" href={routes.search}>
            <MaterialIcon className="text-purple-600 transition-transform duration-200 hover:scale-105">search</MaterialIcon>
          </Link>
          <Link href={routes.home}>
            <h1 className="text-lg font-bold tracking-tight text-purple-600">Memetrest</h1>
          </Link>
          <div className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-primary/20">
            <AppImage
              alt="vibrant 3D avatar of a stylish young creator with purple glasses and a friendly expression on a soft pastel background"
              className="h-full w-full object-cover"
              height={32}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLnPxQf5_YHTvHLRILSFNw19HdGkpTaga2dJtIyMLDHVxIZkm4XYZ5L3Y2d7W7Bol35QT7Tv8iRfAMh5DSHOdGA5gH9DoeOdAL9ZRZqZHXf1h3038NinRUAajeQyjTvgkAMIfKHZCHBpMdI-yeEuUOFua_qDrI5bDGyjgZ9hvnVSdogLSAEHdzQIebunrjM-PZWWbPD-7bg9Prve5jwQF4q5BSL9nE_ZagVP-V03NxWeiaC86UW4HnIKx3dZVPOIGCmkhTno5TBXfQ"
              width={32}
            />
          </div>
        </div>
      </header>

      <main className="pb-24 md:hidden">
        <section className="flex flex-col items-center px-margin-mobile pb-md pt-lg">
          <div className="relative mb-md">
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary to-tertiary p-1 shadow-lg">
              <div className="h-full w-full overflow-hidden rounded-full border-4 border-white">
                <AppImage
                  alt="Close up of a stylized digital avatar with a trendy haircut and cheerful expression for a social profile"
                  className="h-full w-full object-cover"
                  height={96}
                  priority
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvwQ5-zVZmYqYGiBuswp2eQVgR0us-sSpv6Ls2cvjz7eK-293U8Vh7QTokMnyjDf_tLMWmRLsXZ4RU06o1JfnmdhEs3NryJAZ8re8BCkNSf3AD6uyJVgW9ZuTBsqy1q_ov5N7UUWyHmZj3y_EOPoxN0w-838wJD7V3HwXdqdMRb78oyrk7z4hpOgPieQiIHXHo0Q-hc1xRrcuA5h7rVweox_h3BoPPKzXAA3foTZTm0o0SKfY5o4cq-d1NeRDAZx5vdeEOxXMkrn9h"
                  width={96}
                />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-primary p-1 text-white">
              <MaterialIcon filled className="text-[16px]">add</MaterialIcon>
            </div>
          </div>

          <div className="mb-lg text-center">
            <h2 className="mb-xs text-headline-md font-headline-md text-on-surface">@meme_lord_99</h2>
            <p className="px-lg font-body-md text-on-surface-variant">
              Curating the finest digital artifacts for the terminally online.
            </p>
          </div>

          <div className="grid w-full max-w-md grid-cols-3 gap-sm rounded-2xl border border-outline-variant/30 bg-surface-container-low p-sm shadow-sm">
            <div className="flex flex-col items-center py-xs">
              <span className="font-headline-md text-primary">12.4k</span>
              <span className="font-label-sm uppercase tracking-wider text-on-surface-variant">Followers</span>
            </div>
            <div className="flex flex-col items-center border-x border-outline-variant/50 py-xs">
              <span className="font-headline-md text-primary">842</span>
              <span className="font-label-sm uppercase tracking-wider text-on-surface-variant">Saved</span>
            </div>
            <div className="flex flex-col items-center py-xs">
              <span className="font-headline-md text-primary">156</span>
              <span className="font-label-sm uppercase tracking-wider text-on-surface-variant">Uploads</span>
            </div>
          </div>
        </section>

        <nav className="sticky top-16 z-40 mb-gutter border-b border-outline-variant/20 bg-background/90 px-margin-mobile backdrop-blur-md">
          <div className="mx-auto flex max-w-md justify-between">
            <button className="flex-1 border-b-2 border-primary py-md font-label-sm text-primary" type="button">Saved</button>
            <button className="flex-1 border-b-2 border-transparent py-md font-label-sm text-on-surface-variant" type="button">Uploaded</button>
            <button className="flex-1 border-b-2 border-transparent py-md font-label-sm text-on-surface-variant" type="button">Boards</button>
          </div>
        </nav>

        <section className="px-margin-mobile">
          <div className="grid grid-cols-2 gap-4">
            {savedItems.map((item) => (
              <Link className="group overflow-hidden rounded-xl bg-white shadow-[0_8px_32px_rgba(168,85,247,0.08)] transition-transform duration-200 hover:scale-[1.02]" href={routes.detail} key={item.image}>
                <div className="relative">
                  <AppImage alt={item.alt} className={`w-full object-cover ${item.ratio}`} sizes="50vw" src={item.image} />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-sm opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="font-semibold text-white">{item.label}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <MobileBottomNav active="profile" className="md:hidden" />

      <div className="pointer-events-none fixed bottom-24 right-4 flex flex-col gap-sm opacity-40 md:hidden">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/40 backdrop-blur">
          <MaterialIcon className="text-purple-600">rocket_launch</MaterialIcon>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/40 backdrop-blur">
          <MaterialIcon className="text-purple-600">auto_awesome</MaterialIcon>
        </div>
      </div>
    </div>
  );
}
