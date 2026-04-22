import React from "react";
import Link from "next/link";
import { DesktopPageShell } from "@/components/navigation/desktop-page-shell";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { AppImage } from "@/components/ui/app-image";
import { MaterialIcon } from "@/components/ui/material-icon";
import { routes } from "@/lib/routes";

const chips = ["#Trending", "#Savage", "#Cute", "#Reaction", "#Surreal", "#Dank"] as const;
const trendingItems = ["Confused Cat 2.0", "Monday Morning Vibes"] as const;

const cards = [
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA0H-bLNxoM8URYcTyFovRUKJ5FPx7XzfYBNbFSVcoixxZVvxuezXGxGDf_QWQuA4VA-h8trOq3UGncq5v2pBpVE5KDz4aL6U5AYoh3ZmkmKz4I2A-MjUoJd63dzejPyM8lxHKlUNUJPQLhfmIpvpouE3Il76jaaC4AmQdjqU6L7sLlJfZ7HZ5pjvE5GmlB1_MTauDX5DE9hTlXK2EsKwb5363XqHBj7wj0egbFdVxxCGHzCN9cAOJFy5144FjyD5jvy5X2VEIMIFgT",
    alt: "Funny close-up of a surprised orange tabby cat with wide eyes and open mouth, bright lighting, high resolution",
    ratio: "aspect-[4/5]",
    label: "POV: You forgot your password"
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBID-Am004yIMaMa8kGpjjY-8S6-4xpL3ndwe2taIf3UxUgyvAgvpibt2g7ae3QZxt4o6yQdtkl_xojOZayyJR3MM37zjKgu-l4W_Y7hTWedDdHWF86wDnDneScbPTrLuNxo4sDO7d7Q0sPeomwP2nkoIQc2eS_ovja0mm5Rm-KWYS8eT6H23cNgKL65ni6MOGf2V3L6eKlvx7Xd2E93U-pvSS60ssdHnTVECJexSqnKVGBOePVQBPrdKOW1ogkI1V4ePousC9XCA9k",
    alt: "Surreal digital art of a neon glowing dog floating in a cosmic purple nebula with stars and planets",
    ratio: "aspect-[4/6]",
    label: "Absolute Cinema"
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAZjuvydsT4peQATFrRm86MqpGhd5zgmoIlosT3XVR8mVmVW-LFeoHe--7xbIg_fbamsJryShnowHGyrTWbxNHfcP4k-TH3yCUgHTTKokxDwWw2BZWeWOUpHm623SyptFKmhNGuC2MKRXHnoCeVuABxO5q6vdhPDMg0IaWJVWkDWowmxWoEnTizhs-bFafRnrZkzI6aYaUkcZLToUPL1sCqqL-xm8e0VhHZbL9hnMLeM_H-ubgwcLpjhU6y2ZfkKe41ooosbL3wwU5W",
    alt: "Vibrant 3D abstract render of flowing liquid metal shapes in iridescent pink and blue hues",
    ratio: "aspect-[4/6]",
    label: "Brainrot Core"
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCiz9ZE1rejh9eXiFOOfE1qCAN_QR611-UjKOVDSR-aM0eSYHOa6lx-M7Mm0viLGAbV27C2RJ3tQjMBkdHJvN_-zjSDG9ayum4dA0KpvDyJtVt8FZaJOPn6MMMr3CAycESYymgTuZel5iCjoD0cSJjMD_o20B_UTYTgIpMKPBeh7__THWU_hoWgj3LEWYM-6H_mzETF2ERzVJQysseK3sciWCYXySdX7hm6gtvClO56PeU5fiZ8ur6kDT5gfyLA0yhSVFCkDpytIh-3",
    alt: "Sassy black cat wearing miniature sunglasses looking directly at camera, cool aesthetic, vibrant backdrop",
    ratio: "aspect-[4/5]",
    label: "Literally me fr"
  }
] as const;

export function SearchDiscoveryScreen() {
  return (
    <div className="min-h-screen bg-background font-body-md text-on-background">
      <DesktopPageShell
        active="explore"
        description="Find memes by trend, tag, or creator without carrying the mobile navigation chrome into the desktop view."
        title="Search Discovery"
        toolbar={
          <Link
            className="h-12 w-12 overflow-hidden rounded-full border-2 border-primary/20"
            href={routes.profile}
          >
            <AppImage
              alt="Close up portrait of a smiling young person with clear skin and soft lighting, high-end photography style"
              className="h-full w-full rounded-full object-cover"
              height={48}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxuHpjqMMrJA3gntL0h5T8DvMghYq_uTZBPYfu7Q9s9NILKGvvsMRnJS43-NIQeooCUyq7naOV9erSgTxqECVDZty-lHITZV7ICKUnJ-RJ3q3xqfZhuCwJp5UcJtDZzsY1BjBpkd10gQXdRnlsPLWFJhAz2X-HgKH7ksoqUMPWzjraU3zC7g_uQw_VLOcOl3pTHsiicGpjwZK4Omkm2WbjYO0KLhUrJk-rmlIh_x-Bjpf3YNc_tz-bV6vjkiNeoCgOmaQCvDM8B1GZ"
              width={48}
            />
          </Link>
        }
      >
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-6">
            <section className="rounded-[28px] border border-white/30 bg-white/75 p-6 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl">
              <Link className="group relative block" href={routes.search}>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400">
                  <MaterialIcon>search</MaterialIcon>
                </div>
                <span className="block w-full rounded-full bg-background py-4 pl-12 pr-4 text-zinc-400 shadow-sm transition-colors group-hover:text-zinc-500">
                  Search memes, stickers, or chaos...
                </span>
              </Link>
              <div className="mt-6 flex flex-wrap gap-2">
                {chips.map((chip, index) => (
                  <div
                    className={[
                      "rounded-full px-md py-xs font-label-sm transition-colors",
                      index === 0
                        ? "bg-primary-container text-on-primary-container shadow-sm"
                        : "border border-outline-variant/30 bg-surface-container text-on-surface-variant"
                    ].join(" ")}
                    key={chip}
                  >
                    {chip}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-white/30 bg-white/75 p-6 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-base font-headline-md text-on-surface">
                  <MaterialIcon className="text-primary">trending_up</MaterialIcon>
                  Trending
                </h2>
                <button className="font-label-sm text-primary" type="button">
                  View all
                </button>
              </div>
              <div className="space-y-3">
                {trendingItems.map((item, index) => (
                  <Link
                    className="group flex items-center justify-between rounded-2xl bg-background/70 p-4 transition-all hover:bg-white"
                    href={routes.detail}
                    key={item}
                  >
                    <div className="flex items-center gap-sm">
                      <span className="text-xl font-bold text-primary/40">{`0${index + 1}`}</span>
                      <span className="font-body-lg font-bold">{item}</span>
                    </div>
                    <MaterialIcon className="text-zinc-300 transition-colors group-hover:text-primary">
                      north_east
                    </MaterialIcon>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <section className="rounded-[28px] border border-white/30 bg-white/75 p-6 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-headline-md text-on-surface">Explore Ideas</h2>
              <span className="text-sm text-on-surface-variant">Curated for larger screens</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {cards.map((card, index) => (
                <Link
                  className={[
                    "relative overflow-hidden rounded-[24px] bg-white shadow-[0_8px_32px_rgba(168,85,247,0.06)] transition-transform duration-300 hover:scale-[1.02]",
                    index === 0 ? "md:col-span-2" : "",
                    card.ratio
                  ].join(" ")}
                  href={routes.detail}
                  key={card.image}
                >
                  <AppImage
                    alt={card.alt}
                    className="h-full w-full object-cover"
                    sizes="(max-width: 1536px) 50vw, 33vw"
                    src={card.image}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-sm">
                    <p className="truncate font-label-sm text-white">{card.label}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </DesktopPageShell>

      <nav className="sticky top-0 z-50 border-b border-white/20 bg-white/80 shadow-[0_8px_32px_rgba(168,85,247,0.08)] backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/80 md:hidden">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link className="text-purple-600 dark:text-purple-400" href={routes.search}>
              <MaterialIcon>search</MaterialIcon>
            </Link>
            <Link href={routes.home}>
              <span className="bg-clip-text text-lg font-bold tracking-tight text-purple-600 dark:text-purple-400">
                Memetrest
              </span>
            </Link>
          </div>
          <Link className="h-10 w-10 rounded-full border-2 border-primary/20" href={routes.profile}>
            <AppImage
              alt="Close up portrait of a smiling young person with clear skin and soft lighting, high-end photography style"
              className="h-full w-full rounded-full object-cover"
              height={40}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxuHpjqMMrJA3gntL0h5T8DvMghYq_uTZBPYfu7Q9s9NILKGvvsMRnJS43-NIQeooCUyq7naOV9erSgTxqECVDZty-lHITZV7ICKUnJ-RJ3q3xqfZhuCwJp5UcJtDZzsY1BjBpkd10gQXdRnlsPLWFJhAz2X-HgKH7ksoqUMPWzjraU3zC7g_uQw_VLOcOl3pTHsiicGpjwZK4Omkm2WbjYO0KLhUrJk-rmlIh_x-Bjpf3YNc_tz-bV6vjkiNeoCgOmaQCvDM8B1GZ"
              width={40}
            />
          </Link>
        </div>
      </nav>

      <main className="pb-24 md:hidden">
        <section className="px-margin-mobile pb-gutter pt-sm">
          <Link className="group relative block" href={routes.search}>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400">
              <MaterialIcon>search</MaterialIcon>
            </div>
            <span className="block w-full rounded-full bg-white py-4 pl-12 pr-4 text-zinc-400 shadow-sm dark:bg-zinc-800">
              Search memes, stickers, or chaos...
            </span>
          </Link>
        </section>

        <section className="mb-gutter flex gap-base overflow-x-auto whitespace-nowrap px-margin-mobile hide-scrollbar">
          {chips.map((chip, index) => (
            <div
              className={[
                "rounded-full px-md py-xs font-label-sm transition-colors",
                index === 0
                  ? "scale-105 bg-primary-container text-on-primary-container shadow-sm"
                  : "border border-outline-variant/30 bg-surface-container text-on-surface-variant hover:bg-white"
              ].join(" ")}
              key={chip}
            >
              {chip}
            </div>
          ))}
        </section>

        <section className="mb-lg px-margin-mobile">
          <div className="mb-sm flex items-center justify-between">
            <h2 className="flex items-center gap-base font-headline-md text-on-surface">
              <MaterialIcon className="text-primary">trending_up</MaterialIcon>
              Trending
            </h2>
            <button className="font-label-sm text-primary" type="button">
              View all
            </button>
          </div>
          <div className="grid grid-cols-1 gap-base">
            {trendingItems.map((item, index) => (
              <Link
                className="group flex items-center justify-between rounded-xl bg-white/40 p-sm backdrop-blur-sm transition-all hover:bg-white"
                href={routes.detail}
                key={item}
              >
                <div className="flex items-center gap-sm">
                  <span className="text-xl font-bold text-primary/40">{`0${index + 1}`}</span>
                  <span className="font-body-lg font-bold">{item}</span>
                </div>
                <MaterialIcon className="text-zinc-300 transition-colors group-hover:text-primary">
                  north_east
                </MaterialIcon>
              </Link>
            ))}
          </div>
        </section>

        <section className="px-margin-mobile">
          <h2 className="mb-sm font-headline-md text-on-surface">Explore Ideas</h2>
          <div className="grid grid-cols-2 gap-4">
            {cards.map((card) => (
              <Link
                className={`relative overflow-hidden rounded-xl bg-white shadow-[0_8px_32px_rgba(168,85,247,0.06)] transition-transform duration-300 hover:scale-[1.02] ${card.ratio}`}
                href={routes.detail}
                key={card.image}
              >
                <AppImage
                  alt={card.alt}
                  className="h-full w-full object-cover"
                  sizes="50vw"
                  src={card.image}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-sm">
                  <p className="truncate font-label-sm text-white">{card.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <MobileBottomNav active="explore" asFooter className="md:hidden" />
    </div>
  );
}
