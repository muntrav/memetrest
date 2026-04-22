import React from "react";
import Link from "next/link";
import { BackButton } from "@/components/navigation/back-button";
import { DesktopPageShell } from "@/components/navigation/desktop-page-shell";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { AppImage } from "@/components/ui/app-image";
import { MaterialIcon } from "@/components/ui/material-icon";
import { routes } from "@/lib/routes";

const relatedItems = [
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC45VlWRC-6SMrJlX69cvyqS7d-JTgy7py_i7SWkgX2Z29vqG--R4a97sfzmjPCcV28VFO-lBZAwSytre8VouclEQRrWLyhKtsoJMmWkPGm925hd_8LUwTVLP3lS8uwEgC8OPDEqhEC5q7KVwuznanjw2o8pWzVQIW4HNGBzcBqRNBZdcxU6q06I2F8hIzq05IvlL45EWFkK2VHG5RNHsYR75_rkCWptqNwcav-dypW0AapBEMyn4LXmbtfotpW5Tg3SSWDGpfmxUpx",
    alt: "funny internet meme featuring a cat with a surprised expression high contrast lighting colorful background",
    ratio: "aspect-[4/5]",
    likes: "12k"
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDGhOtj90sJcUqskRyxAmMMlw0f5RmiCM0cPB5oMHE2i26VN2dkz343PuKRFr4v_5O89l3wLraf-EfIL5HcaLvJsu0H243A2UZKZW7alZQvir91zJh7AGCRcnuniNZfnOEIYy8jqniaqzzx4qheioPNaMfwI3_0wX5_KVbZRSJ_ht-0SEdoLIFz9LiyD_NIYvFT9W8j72Ob6i123zL7l9zIV9PcKk-N6CdplFjKAbqq6EBIKN98Rd30-jwtGGKbE_3RdsKxTszByyis",
    alt: "trending meme illustration of a dog sitting in a burning room with fine text overlay",
    ratio: "aspect-[1/1]",
    likes: "8.4k"
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCyErgzYTvT2uogLKDCS5jvyj2N_5LrJ5a8eRDExNpp1q7vWvpdCknv6Jl1bAivzLARl85qUlWnpdwuUGfnkLLEzsdSSgkjnAAnGq78OgIvAcJRK7qTz0hY0g4gQfJdUCFaDw-BYQFpzCaStFXJZpY0F6Eo_Cz4UJuXlZQy89ySUs51Fqj0kx2LqAdNn-VeGKhPdeoncozdQ1HW_1CsufeMTPtG3wUMFkgOK8OVeOtht7m8uibs8Ffxvu6OGIURYc57rMmugXe9-LiW",
    alt: "vaporwave aesthetic meme with neon pink and blue grids and classic statues",
    ratio: "aspect-[3/4]",
    likes: "45k"
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCRqmxOxl6K2IeXSEJn9d_nQFCohgNo2F988OX325XgLsoaONgwz63hE0gYKBtqB0Cmd6HftMaJDUlxwnmRzhZhXmaNtpftt-SK0Nj01nX7D6v5vp3iaeAQXkjbq2PWX_qLBj0u4x9QRzwjUZY8gkpoPcBAgYGQkF47XYHBIbsYKeVtFIXhYGfJ4K4VeHcsDLmY6px1OjxPSZ6HDQKItfnOUr-4VGdyjZwWqDbL4dFi81gIsswA3ZAfJbW4q8AEX7zQzFgcYS3Jjzfs",
    alt: "wholesome meme featuring friendly woodland creatures and supportive captions soft warm lighting",
    ratio: "aspect-[4/5]",
    likes: "21k"
  }
] as const;

export function MemeDetailViewScreen() {
  return (
    <div className="min-h-screen bg-background font-body-md text-on-background">
      <DesktopPageShell
        active="explore"
        description="Desktop detail view prioritizes the meme canvas and creator metadata side by side, instead of reusing the stacked mobile composition."
        title="Meme Detail"
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
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_380px]">
          <section className="rounded-[32px] border border-white/30 bg-white/75 p-6 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl">
            <div className="relative overflow-hidden rounded-[28px] bg-surface-container-lowest">
              <div className="relative flex aspect-[4/5] w-full items-center justify-center bg-zinc-100">
                <AppImage
                  alt="high resolution relatable internet meme with bold white sans-serif text on a vibrant cinematic colorful background with soft focus"
                  className="h-full w-full object-contain"
                  priority
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmo7m3sCx_lQYF5E70vquH3cv9j2p3MyiLr0jOgA7d-pLWUJhzTkexjF2q4zcRy27yTi-SC2dA2OCTlU1KML57s-7ALZtfaf4ytWhGBtgg7jdLcQeSy3zUoh3qObxZD8_9g_CJqOOesDCZ6LIo0jbJ5PDvsKN0N7Us87k66nm4dx7t8gPSV9l-_jIx2fS6cqVFFFoSfAW80gAeaEvXyaduTGTp6xzSDbgJtkHp3R4cZlVQth8ZSCVrhG_vxY7PStvEvLMh-Kojp3GN"
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
              <div className="grid gap-4 md:grid-cols-3">
                {relatedItems.map((item) => (
                  <Link
                    className={`relative overflow-hidden rounded-[24px] bg-white shadow-sm ${item.ratio}`}
                    href={routes.detail}
                    key={item.image}
                  >
                    <AppImage
                      alt={item.alt}
                      className="h-full w-full object-cover"
                      sizes="(max-width: 1536px) 33vw, 25vw"
                      src={item.image}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-xs">
                      <div className="flex items-center gap-xs">
                        <MaterialIcon className="text-sm text-white" filled>
                          favorite
                        </MaterialIcon>
                        <span className="text-[10px] font-label-sm text-white">{item.likes}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[32px] border border-white/30 bg-white/75 p-6 shadow-[0_18px_50px_rgba(129,39,207,0.08)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <Link className="flex items-center gap-sm" href={routes.profile}>
                  <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-primary-container">
                    <AppImage
                      alt="professional minimalist 3D avatar of a digital artist with bright purple background neon lighting"
                      className="h-full w-full object-cover"
                      height={48}
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtBWnvhKlNgL26auVZOhoZPpv5UnUuMa1wy2Qnu01s0jWJlhBNdjNcxkg13M5t5WdhCzg5GGuQQscM1uZfdjjEj9wst5XCeRez7Vf30j44RjSkEWFU4IkLwHYWQK6Qc1RoPuhM8sBdvOd7tr5MakpD4UK3INioxyGPzIOkU5AM42yvYxKQ98zmlM0OyKVZ8jCgMN_erWCLXTs64FhxTTkA59iCty_-Ws1QSEqDIxXX1yHtyeg3Kwfpu1M8YY-_qCDDu_LqfR3cRLLm"
                      width={48}
                    />
                  </div>
                  <div>
                    <h3 className="font-headline-md text-body-md text-on-surface">MemeLord_99</h3>
                    <p className="text-[11px] font-label-sm text-outline">2.4M followers</p>
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
                <h1 className="font-headline-md leading-tight text-on-surface">
                  When the coffee hits different at 3 AM
                </h1>
                <div className="flex flex-wrap gap-xs">
                  <span className="rounded-full bg-primary-fixed-dim px-sm py-1 text-[10px] font-label-sm text-on-primary-fixed-variant">
                    #relatable
                  </span>
                  <span className="rounded-full bg-surface-variant px-sm py-1 text-[10px] font-label-sm text-on-surface-variant">
                    #nightowl
                  </span>
                  <span className="rounded-full bg-surface-variant px-sm py-1 text-[10px] font-label-sm text-on-surface-variant">
                    #gaming
                  </span>
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
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${item.bg} ${item.text ?? "text-white"} shadow-lg transition-transform group-hover:scale-105`}>
                      <MaterialIcon className="text-2xl">{item.icon}</MaterialIcon>
                    </div>
                    <span className="text-[10px] font-label-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </DesktopPageShell>

      <nav className="sticky top-0 z-50 border-b border-white/20 bg-white/80 shadow-[0_8px_32px_rgba(168,85,247,0.08)] backdrop-blur-xl md:hidden">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
          <BackButton className="text-zinc-500 transition-transform duration-200 hover:scale-105" fallbackHref={routes.home}>
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
        <section className="w-full overflow-hidden bg-surface-container-lowest">
          <div className="relative flex aspect-[3/4] w-full items-center justify-center bg-zinc-100">
            <AppImage
              alt="high resolution relatable internet meme with bold white sans-serif text on a vibrant cinematic colorful background with soft focus"
              className="h-full w-full object-contain"
              priority
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmo7m3sCx_lQYF5E70vquH3cv9j2p3MyiLr0jOgA7d-pLWUJhzTkexjF2q4zcRy27yTi-SC2dA2OCTlU1KML57s-7ALZtfaf4ytWhGBtgg7jdLcQeSy3zUoh3qObxZD8_9g_CJqOOesDCZ6LIo0jbJ5PDvsKN0N7Us87k66nm4dx7t8gPSV9l-_jIx2fS6cqVFFFoSfAW80gAeaEvXyaduTGTp6xzSDbgJtkHp3R4cZlVQth8ZSCVrhG_vxY7PStvEvLMh-Kojp3GN"
            />
            <div className="absolute bottom-4 right-4 flex flex-col gap-4">
              <button className="glass-blur flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-error shadow-xl transition-all active:scale-95" type="button">
                <MaterialIcon className="text-3xl" filled>favorite</MaterialIcon>
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-md px-margin-mobile pt-sm">
          <div className="flex items-center justify-between">
            <Link className="flex items-center gap-sm" href={routes.profile}>
              <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary-container">
                <AppImage
                  alt="professional minimalist 3D avatar of a digital artist with bright purple background neon lighting"
                  className="h-full w-full object-cover"
                  height={40}
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtBWnvhKlNgL26auVZOhoZPpv5UnUuMa1wy2Qnu01s0jWJlhBNdjNcxkg13M5t5WdhCzg5GGuQQscM1uZfdjjEj9wst5XCeRez7Vf30j44RjSkEWFU4IkLwHYWQK6Qc1RoPuhM8sBdvOd7tr5MakpD4UK3INioxyGPzIOkU5AM42yvYxKQ98zmlM0OyKVZ8jCgMN_erWCLXTs64FhxTTkA59iCty_-Ws1QSEqDIxXX1yHtyeg3Kwfpu1M8YY-_qCDDu_LqfR3cRLLm"
                  width={40}
                />
              </div>
              <div>
                <h3 className="font-headline-md text-body-md text-on-surface">MemeLord_99</h3>
                <p className="text-[11px] font-label-sm text-outline">2.4M followers</p>
              </div>
            </Link>
            <button className="rounded-full bg-primary px-gutter py-2 font-label-sm text-on-primary shadow-lg shadow-primary/20 transition-transform active:scale-95" type="button">Follow</button>
          </div>

          <div className="space-y-xs">
            <h1 className="font-headline-md leading-tight text-on-surface">When the coffee hits different at 3 AM</h1>
            <div className="flex flex-wrap gap-xs">
              <span className="rounded-full bg-primary-fixed-dim px-sm py-1 text-[10px] font-label-sm text-on-primary-fixed-variant">#relatable</span>
              <span className="rounded-full bg-surface-variant px-sm py-1 text-[10px] font-label-sm text-on-surface-variant">#nightowl</span>
              <span className="rounded-full bg-surface-variant px-sm py-1 text-[10px] font-label-sm text-on-surface-variant">#gaming</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <Link className="flex items-center justify-center gap-xs rounded-xl bg-secondary py-md font-label-sm text-on-secondary shadow-md transition-all active:scale-95" href={routes.collections}>
              <MaterialIcon>bookmark</MaterialIcon>
              Save to Board
            </Link>
            <button className="flex items-center justify-center gap-xs rounded-xl bg-surface-container-high py-md font-label-sm text-on-secondary-container transition-all active:scale-95" type="button">
              <MaterialIcon>download</MaterialIcon>
              Download
            </button>
          </div>

          <div className="space-y-sm">
            <p className="text-[10px] font-label-sm uppercase tracking-wider text-outline">Share with your squad</p>
            <div className="flex gap-md">
              {[
                { label: "WhatsApp", bg: "bg-[#25D366]", icon: "chat" },
                { label: "Telegram", bg: "bg-[#0088cc]", icon: "send" },
                { label: "Copy", bg: "bg-zinc-200", icon: "link", text: "text-zinc-600" }
              ].map((item) => (
                <button className="group flex flex-col items-center gap-xs" key={item.label} type="button">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${item.bg} ${item.text ?? "text-white"} shadow-lg transition-transform group-active:scale-90`}>
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
          <div className="grid grid-cols-2 gap-4">
            {relatedItems.map((item) => (
              <Link className={`relative overflow-hidden rounded-xl bg-white shadow-sm ${item.ratio}`} href={routes.detail} key={item.image}>
                <AppImage alt={item.alt} className="h-full w-full object-cover" sizes="50vw" src={item.image} />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-xs">
                  <div className="flex items-center gap-xs">
                    <MaterialIcon className="text-sm text-white" filled>favorite</MaterialIcon>
                    <span className="text-[10px] font-label-sm text-white">{item.likes}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex justify-center py-lg">
            <div className="flex gap-xs">
              <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
            </div>
          </div>
        </section>
      </main>

      <MobileBottomNav active="explore" asFooter className="md:hidden" />
    </div>
  );
}
