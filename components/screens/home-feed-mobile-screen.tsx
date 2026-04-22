import React, { type ReactNode } from "react";
import Link from "next/link";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { AppImage } from "@/components/ui/app-image";
import { MaterialIcon } from "@/components/ui/material-icon";
import { routes } from "@/lib/routes";

const categories = ["Trending", "Stickers", "Reaction Memes", "Dark Humor", "Wholesome"];

type MobileCard = {
  image: string;
  alt: string;
  ratio: string;
  header?: ReactNode;
  overlay?: ReactNode;
  footer?: ReactNode;
};

const cards: MobileCard[] = [
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAWLLaLrNmdcOH5uN-QEspmSvhyEUHxx8XM0mOvRlwEb-rrhqyd5q873uaPt2wmTYX5BP2i6_TljiK0a6W8kx_2PR8DvAzeajpnQkr7ZN0DceLUpqHdOjdYhdsevIL_ekBv7fvj-02fXyFT_KON89T0uCsBRaqYStWyZ_gQivAcWt19jBgEWSvZNNbfCKtfWjX2CbsZ9Zoke6TuGj1Kc6OHzKkvHUiiZcsSvosTSXR7N7We7_eaAtTc2PtVnOqEUomonKI_j4PspQtn",
    alt: "Funny colorful digital illustration of a confused cartoon cat with vibrant neon colors and expressive eyes",
    ratio: "aspect-[3/4]",
    overlay: (
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-base opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex items-center justify-between">
          <div className="flex gap-xs">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md">
              <MaterialIcon className="text-[18px]">favorite</MaterialIcon>
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md">
              <MaterialIcon className="text-[18px]">share</MaterialIcon>
            </span>
          </div>
          <span className="rounded-full bg-primary px-3 py-1 font-label-sm text-white">
            Save
          </span>
        </div>
      </div>
    )
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBsGVXOLz0pMYDiuD44QpRDWak4DEEOtg24rmuK_4ZVsIqPLgpLNXUBE2sHjRd55nppZ4UolF2UcXkdeHnyN8Ktw_3Rmqk6BrU_8UM_rr9nOKHbNhSr_lKQGGOGuiW6u1WM7WINC-qH6sFmU2BkmJo421hurv2y2FS80yNhQHl5SEX-45--OoFSO4l7FoFp0A69xZkAD_sga9HVs9XGcbNMoSg_BJIk7QlrHKKpMcjWjpUrvTELocjGFmLnDrnFPyzpoGWycbIgI2y0",
    alt: "Vibrant abstract gradient artwork with swirling shades of purple, magenta and cyan reflecting a digital high-dopamine aesthetic",
    ratio: "aspect-[1/1]",
    overlay: (
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-base opacity-100 transition-opacity md:opacity-0 group-hover:opacity-100">
        <div className="flex items-center justify-between">
          <div className="flex gap-xs">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md">
              <MaterialIcon className="text-[18px]">favorite</MaterialIcon>
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md">
              <MaterialIcon className="text-[18px]">share</MaterialIcon>
            </span>
          </div>
          <span className="rounded-full bg-primary px-3 py-1 font-label-sm text-white">
            Save
          </span>
        </div>
      </div>
    )
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD3lnKJQSVK9mGPiJ3UIAcVVNOCBGVKstdL2FgRs-dckzB2-6DCvRSQ3HFnCpc3-w4xJLvQERhgBbiCSVhoQhnIuxF1Sc3p0odrq_kdCOnKuNJEWseKPVb2s-OekodkJj6tYFQeI6ZNOszYKxU-AjrzWf8ZGc2_bE7Hu5QjBtDchczdj0pxTE6J6HnpnWcVw8YlQpMMOEPU0vowD6_agvepKnqCkUXJt9hmUeDaV_VI6chimfHkd1abtiZmW0xYK78etYDjD0lza6Jf",
    alt: "A 3D render of a glossy bright pink plastic toy figure in a dynamic action pose against a solid purple background",
    ratio: "aspect-[2/3]",
    footer: (
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-3">
        <div className="flex items-center justify-between text-white">
          <span className="flex items-center gap-1 font-label-sm">
            <MaterialIcon className="text-sm">favorite</MaterialIcon> 12.4k
          </span>
          <span className="flex items-center gap-1 font-label-sm">
            <MaterialIcon className="text-sm">bookmark</MaterialIcon> 2.1k
          </span>
        </div>
      </div>
    )
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDMPT4D8tdgfiaFE-8mpP9opniljwEsiI5FALoIEteWOQmF3F-KLgIZW5pKOMt5-ad9L7ig4AIK5usfZjT3ZGqCfB5ENq64yVOlr2nWCLeqPVRbT6apvC_HRkrtJC8U8HzJvyXFjUNtiR4nTb4EYhl5bAHVIJhY3wfeZ3xWScOEbyrvnpCxFtE1F0tKd-Cr5VAQhXNJDK5BilS3XAdCD1aoGohexzRevhZ4mB-_mPlAKc9H6fU7CkfnUHUJ8jCbV45_FvFOFgansa8q",
    alt: "Soft ethereal gradient background blending warm peach and cool mint green colors in a dreamlike foggy texture",
    ratio: "aspect-[4/5]",
    header: (
      <div className="absolute right-2 top-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xl">
          <MaterialIcon className="text-lg">more_horiz</MaterialIcon>
        </span>
      </div>
    )
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAkjRwxZoNkGkySHnjWW7SC0h1WTgI5P-VIe6k7tBa49OlrwbkDUWs8pYpcYbSW5c8OXvFExZ4lHfN-j_PD3JJSJ9Wfo1TmYRtAOkFEqEI0oNkAnlfCPEE-zp7ZqEUS_JBvm0u0kO9lkH0-zBmnhbTd6cIVAnrYLe5hHbd23H79W5XfyD0XvDnLlE0cA8GhBAftTlcKrkd4XJqJXP65afuw5wHmoYzV5XMA1TBEmP4UJwXJ3BWLXbpiKp35tQprFmP-UTm0xEyn7gRT",
    alt: "Close-up of a high-resolution colorful sticker of a pixel-art style Shiba Inu dog with a joyful expression",
    ratio: "aspect-[1/1]",
    overlay: (
      <div className="absolute inset-0 flex items-center justify-center bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="rounded-full bg-white px-6 py-2 font-bold text-primary shadow-xl">
          View Details
        </span>
      </div>
    )
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQ8U8edoXI_8kslnBB00sxXJ0kbD1gxXbBJGsKPukmPXLh39W3_sc71YIsG9GTdIs92oix4RBSMuPyDd4L6JX40F2p6TT-lgcfvIwTdYQBp0-wdyl7gJIprS-RcVNy8gAuMIY80DHKod55CBi6F7Kiqhpdks1JhScwKH5lila8Hqf4sS81xhrJfj3ihOVE_nIj3nzYTICpjiWdJYbL9BMa_ejkk2LaSQ0mMJ0MPIsMLGosKdFg_GJlJZrr8twjYUEXaq4n7W4CRlgm",
    alt: "Abstract 3D flowing shapes in metallic chrome and neon violet floating in a clean minimal white void",
    ratio: "aspect-[3/4]",
    footer: (
      <div className="absolute bottom-3 left-3 flex gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white bg-white/80">
          <MaterialIcon className="text-[14px] text-primary" filled>
            bolt
          </MaterialIcon>
        </div>
        <span className="flex items-center rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
          HOT
        </span>
      </div>
    )
  }
] as const;

export function HomeFeedMobileScreen() {
  return (
    <div className="min-h-screen bg-background font-body-md text-on-background selection:bg-primary-fixed md:px-6 md:py-8">
      <div className="relative mx-auto min-h-screen max-w-[430px] bg-background md:min-h-[820px] md:overflow-hidden md:rounded-[32px] md:border md:border-white/40 md:bg-white/70 md:shadow-[0_20px_60px_rgba(129,39,207,0.12)] md:backdrop-blur-xl">
        <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 shadow-[0_8px_32px_rgba(168,85,247,0.08)] backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/80">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
            <div className="flex items-center gap-base">
              <Link href={routes.home}>
                <span className="bg-clip-text text-2xl font-black tracking-tighter text-purple-600 dark:text-purple-400">
                  Memetrest
                </span>
              </Link>
            </div>
            <div className="flex-1 px-4">
              <Link className="group relative flex items-center" href={routes.search}>
                <MaterialIcon className="absolute left-3 text-zinc-400 transition-colors group-focus-within:text-primary">
                  search
                </MaterialIcon>
                <span className="glass-blur h-10 w-full rounded-full bg-surface-container-low pl-10 pr-4 leading-10 text-on-surface text-zinc-500">
                  Search memes...
                </span>
              </Link>
            </div>
            <Link
              className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary-fixed transition-transform duration-200 hover:scale-105"
              href={routes.profile}
            >
              <AppImage
                alt="Close-up portrait of a friendly smiling young man with clean features against a soft blue studio background"
                className="h-full w-full object-cover"
                height={40}
                priority
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoj2x6FIvFxgeHJZeoT-ou0ARCNt8ymh4LZ894llMqVc4QFAzQPA0IzHurbTn_qW2gWKUuldxi1pzSRjk89N5o-OPZI29zYOYgZeZnHElXf-gzswrlQI6ciyLjGNj233OSA6ohh_S3tjmx7tU_ny80WklpxfjMZzqoVGEEF5OAx_cs92YsfLHNuCqg5forN87ULeMBAbrQjWB4kUU_xxS5hYshFrHiHmewYYgbkoEotG4jebajmMG8ShBcHE6GoR777T1AxRRR6bhK"
                width={40}
              />
            </Link>
          </div>
        </header>

        <nav className="sticky top-16 z-40 overflow-x-auto border-b border-surface-variant/30 bg-white/80 py-sm backdrop-blur-xl no-scrollbar">
          <div className="flex min-w-max items-center gap-sm px-margin-mobile">
            {categories.map((category, index) => (
              <button
                className={[
                  "rounded-full px-md py-xs font-label-sm transition-colors",
                  index === 0
                    ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
                ].join(" ")}
                key={category}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>
        </nav>

        <main className="mx-auto max-w-7xl pb-24">
          <div className="grid grid-cols-2 gap-4 p-4">
            {cards.map((card) => (
              <div
                className="group relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm transition-all duration-300 hover:shadow-xl"
                key={card.image}
              >
                <Link href={routes.detail}>
                  <AppImage
                    alt={card.alt}
                    className={`w-full object-cover ${card.ratio}`}
                    priority={card.image === cards[0].image}
                    sizes="50vw"
                    src={card.image}
                  />
                  {card.header ?? null}
                  {card.overlay ?? null}
                  {card.footer ?? null}
                </Link>
              </div>
            ))}
          </div>

          <div className="flex justify-center py-lg">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          </div>
        </main>

        <button className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-2xl md:absolute md:bottom-24 md:right-6">
          <MaterialIcon className="text-3xl">add</MaterialIcon>
        </button>

        <MobileBottomNav
          active="home"
          className="md:absolute md:inset-x-0 md:bottom-0 md:left-0 md:w-auto"
          homeRoute={routes.home}
          showLabels
        />
      </div>
    </div>
  );
}
