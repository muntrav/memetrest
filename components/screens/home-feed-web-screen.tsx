"use client";

import React, { type ReactNode, useState, useMemo } from "react";
import Link from "next/link";
import { DesktopSidebar } from "@/components/navigation/desktop-sidebar";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { AppImage } from "@/components/ui/app-image";
import { MaterialIcon } from "@/components/ui/material-icon";
import { routes } from "@/lib/routes";

type WebCard = {
  image: string;
  alt: string;
  ratio: string;
  overlay?: ReactNode;
  footer?: ReactNode;
};

const cards: WebCard[] = [
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCTCJUpbipBbz5VmSmfY-Afd5SjfMVNJU1Bd3FjKzhhj7_iSZsOsBBCqHohUAWNCM_7AnzfobItLa4XABTMWc2KRVR_TBGV3vtXrtLFkLivclcV_6NQOk9lziBDqZdXDo-QkaXmL737n_t5hXamdu4R0sdbByAblm5zJ-DPxJu7WICw6X6bTlLzsrZsw6iX-9CX8CPNbwcHVj1r_KAU-HswN4g0jYgVPbi9uQEB6rwi3woxgSA82OfLboSuZKPs0jFVpQeqFL9asUPM",
    alt:
      "whimsical orange tabby cat sitting on a plush velvet sofa with dramatic studio lighting and high contrast neon orange backglow",
    ratio: "aspect-[4/5]",
    overlay: (
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white">
              <AppImage
                alt="close-up portrait of a cheerful person with glowing skin and soft bokeh city lights background"
                className="h-full w-full object-cover"
                height={32}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcBwXy7mgDUHRz5KHlF_b5JOIxhDj3pWq1Jmi6q3rf6V56MMuYOMoYlIJ1AWCktw05_kYwqCTmzRk98PYg3hV3RVDtviukyJleXoxNIyexc9m3Vtupq3D2rLWEaIhLoxTsLQ8qo_hMrouMuMjFNetu63uaPjBgsLuNEWOttfkLLDxZRjPB8LRKaKykFWkZd0aHDSr4sJ2i_pxf4Dg2AIA2FxgEbl5jGVYsgBukyn_Y0CqEkuvzeoV9d_2E9gOKv1u9Mpm7gpuKJ0Ak"
                width={32}
              />
            </div>
            <span className="text-sm font-bold text-white">CatMaster99</span>
          </div>
          <span className="rounded-xl bg-white/20 p-2 text-white backdrop-blur-md">
            <MaterialIcon>favorite</MaterialIcon>
          </span>
        </div>
        <div className="flex gap-2 overflow-hidden">
          <span className="rounded-lg bg-white/30 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
            #classic
          </span>
          <span className="rounded-lg bg-white/30 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
            #cats
          </span>
        </div>
      </div>
    )
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzNiStkKY7HfbbyEW8537uBL_GMWE2_1YuQjmWHF3p59npT_Yrl4sw8hJoc3Qp0xZuRozl-eik1A2j5BqlMMA-i9Gdh-M_Zsp77WsQgJB87VWSDv9md5ab9knzhLbA2B1-LWXxmbwHdyFnpcFgBLyXFru0aPvhStU2nhMDIx3fzbfPFG_yayfwinA91KYKo4-I2fV7cuyHGgy1MKHC0urPe2zOGoYuFyzPhqdTXHRzKSPOp-z_nvW9mZ-oF1Dp480xUw29SuF-APkw",
    alt:
      "digital code scrolling on a futuristic screen with deep blue and purple bioluminescent neon color palette",
    ratio: "aspect-[1/1]",
    overlay: (
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <p className="mb-4 font-bold text-white">
          When you fix one bug and five more appear 🤡
        </p>
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            <div className="h-6 w-6 rounded-full border-2 border-white bg-blue-500" />
            <div className="h-6 w-6 rounded-full border-2 border-white bg-green-500" />
            <div className="h-6 w-6 rounded-full border-2 border-white bg-red-500" />
          </div>
          <span className="text-xs font-medium text-white/80">12.4k Likes</span>
        </div>
      </div>
    )
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCcqH79lrU74CVXrU32Q5U7dWm5XgsUz93SylN5UsqqSMF2gkJLajsfX1kF3MrRQclw6Z7iMEg4yeN_KBYEJ_fKVJlA4vNK2t_Ukt9yAKnVFFOd4o27vqHVDtJ8_atqGIc9rqS-ASHNfkGPne4d2Ry89nIFoHMJyJpHqWF5n6kSSYP08WVQcvI-tpLGEJoNjdp8iXbjFM5n-dLMSfBk4TqB18yLmMK_idNqb5cBBXsE-4yExnX85ZgKOzKOSBac4CsgnfrxPbvG6XAs",
    alt:
      "abstract flowing 3d shapes in vibrant magenta and cyan with smooth glassmorphism textures and floating particles",
    ratio: "aspect-[3/4]",
    overlay: (
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="mb-2 flex items-center gap-2">
          <MaterialIcon className="text-purple-400" filled>
            star
          </MaterialIcon>
          <span className="font-bold text-white">Featured Aesthetic</span>
        </div>
        <span className="w-full rounded-xl bg-white py-2 text-center font-bold text-primary">
          Remix This
        </span>
      </div>
    )
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAk0pUFOa5T_8lQAQsaYZauRl1S6j3CBYWIZR_R1mXuaVEBb5_fnzotYtmQslHP5qK3v5vU1CaU7HoJRzrr30RhVnzUX9_K7pKuScBy-QVHW9AhtsQrIidkX3PZ6lTLmdD-i3e9QFVutCJ6aYpDAAi-Fv_FS-S1JVDl9sJ_t8POzmNZG81eujsMTibY04oYkbYzdhTSUKDA3m63Oc6bpXTFfjlfJTgg0tZnhGkcSwLbAmDaqM9pxUgQZ0UkpEauA9sHSq0hu78_K4Ik",
    alt:
      "vintage desktop computer setup with retro gaming accessories and colorful aesthetic neon lighting in a vaporwave style",
    ratio: "aspect-[4/5]",
    overlay: (
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="text-lg font-bold text-white">Nostalgia Hits Different</span>
      </div>
    )
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBqgshsIWSNsqFd8I_Ceo5ru9E4RlLJZzCGSzN10Fu1o3eSNEyqbSpMJlux5h61DmU49t5s-nBn8oSIFS3UIkXYCF0XlP9gpiHTl-WXVfGLqpt_uwwb165fSFkmb7XGw-8ZDUkVZSmsOmpVrbk6KSEyE0vDwRfyPRkAynMRyCJ9GSpQmvxwwBPjWIirmHoPiF3HWCc5HJvtAOJvTJNNoxE8W1OPtq3RuPHaaNoyrFGzamm7QUk_Am-5T_6NKDvPEZ3jN34CJ49HKlxd",
    alt:
      "hyper-realistic wide-eyed golden retriever puppy looking up at the camera with innocent expression in soft natural lighting",
    ratio: "aspect-[1/1]",
    overlay: (
      <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/80 via-transparent to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="font-black italic text-white">Mood.</span>
        <span className="rounded-full bg-white/20 p-2">
          <MaterialIcon className="text-white">bookmark</MaterialIcon>
        </span>
      </div>
    )
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC7RQdAFsni5zvBm2kePpstBl52xAyS7yRb6-DDphzqwgTGLyEgAlrQT7dhTPmqPWk2P1WBklUWtFn-ShDIboK4OQXmzlaeqa372ssh5ZeNSyL8Ge-iPAFaQdNId_sVvKSF0ArY8_bGHjvjws9e8glIq41cypiLnPvlos__ehmfGjyau-1DHt_37mwRDBYHylf-oeArEx3f2xLRLEE-2cuugy1LlzgcXctA5H4Zxyv1uqV94G3ry2_ZBjOyPQpPMAJnU2CHcuMiLy7c",
    alt:
      "cinematic shot of an old film camera on a wooden table with soft morning sunlight streaming through a window",
    ratio: "aspect-[3/4]",
    overlay: (
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="mb-1 text-xs text-white/60">Uploaded by VisualVibes</span>
        <span className="font-bold text-white">Cinema Core</span>
      </div>
    ),
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
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCGpPPhGcUS5o1MFIbVtNXMYyAT5vdjOdD004pWnyxUHmNyNUHgClx-6aCF70Tit99H_7u14klb4ZxwWOYQz4vTLGue2BxhiXIfDOH_rXiHhQuDarFNR59WMvr9_3sjk3JhS0gIOc3366HmnmTG5mNadHgCRkJogZ3-H6oz2kGJFNnEs71E6ld2SfYYrQDQeY9W6lqh-1qFCw7mLEmjlOBKxMuM084x_PC1-_uPwmx9PbGAFaoAicmOo0TVVErYkuEYifDG8nSDG6Bu",
    alt:
      "abstract digital matrix with glowing green binary numbers flowing in vertical streams on a deep black background",
    ratio: "aspect-[3/4]"
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDE05BISAKuMzZkM00JWrGPoBJQgXjirBdJpSFNO7uTsq5OxYnP0u7pUlKpNXDIBgYgVY-70CNyWPidlh___MfUpmk24rJHgkE_lqTgd54FxC_aNNQ-27PuKQ0J0AOrNACt-49KS2JDYI21g6-lnTJJWIFwiPdBkY0TMftu82SUfnkzSlSpcIUpAwy64osqWd9aFvmepsSxdl-XNQNOlxDPPZlqAfYapk11KGGBsA94TkC1LwdCrQYLgt7A4kSb62pMmdOMIy-yn2x8",
    alt:
      "majestic mountain peak at sunset with vibrant pink and orange clouds and snow capped summit",
    ratio: "aspect-[3/4]"
  }
] as const;

type CategoryChip = {
  label: string;
  active?: boolean;
};

const categoryChips: CategoryChip[] = [
  { label: "All Memes", active: true },
  { label: "🔥 Trending" },
  { label: "🎭 Surreal" },
  { label: "🎮 Gaming" },
  { label: "🐈 Cute Cats" },
  { label: "☕ Relatable" },
  { label: "💻 Dev Humour" }
] as const;

export function HomeFeedWebScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCards = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return cards;
    }

    return cards.filter((card) => card.alt.toLowerCase().includes(query));
  }, [searchQuery]);

  return (
    <div className="bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <DesktopSidebar active="home" />

      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/20 bg-white/80 px-4 backdrop-blur-xl md:hidden">
        <Link href={routes.home}>
          <span className="text-xl font-black tracking-tighter text-purple-600">
            Memetrest
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href={routes.search}>
            <MaterialIcon className="text-zinc-500">search</MaterialIcon>
          </Link>
          <Link className="h-8 w-8 rounded-full bg-primary-container" href={routes.profile}>
            <span className="sr-only">Go to profile</span>
          </Link>
        </div>
      </header>

      <main className="min-h-screen p-4 md:ml-24 md:p-8 lg:ml-64">
        <section className="sticky top-4 z-40 mx-auto mb-10 max-w-4xl">
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
              <MaterialIcon className="text-zinc-400 transition-colors group-focus-within:text-primary">
                search
              </MaterialIcon>
            </div>
            <input
              type="text"
              placeholder="Search for memes, stickers, or creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-3xl bg-white/90 py-4 pl-14 pr-4 text-body-lg font-medium shadow-[0_8px_32px_rgba(168,85,247,0.06)] backdrop-blur-md transition-all outline-none ring-2 ring-transparent focus:ring-primary"
            />
            <div className="absolute inset-y-0 right-4 flex items-center gap-2">
              <button className="rounded-xl p-2 transition-colors hover:bg-zinc-100" type="button">
                <MaterialIcon className="text-zinc-400">tune</MaterialIcon>
              </button>
            </div>
          </div>
        </section>

        <section className="mb-8 flex gap-3 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
          {categoryChips.map((chip) => (
            <span
              className={[
                "cursor-pointer rounded-full px-5 py-2 text-sm font-label-sm transition-colors",
                chip.active
                  ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
                  : "border border-zinc-100 bg-white text-zinc-600 hover:bg-purple-50"
              ].join(" ")}
              key={chip.label}
            >
              {chip.label}
            </span>
          ))}
        </section>

        {filteredCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <MaterialIcon className="text-6xl text-zinc-300">search_off</MaterialIcon>
            <p className="mt-4 text-lg text-zinc-500">
              No memes found for <span className="font-semibold text-zinc-700">{searchQuery}</span>
            </p>
          </div>
        ) : (
          <div className="[column-count:2] gap-4 md:[column-count:3] lg:[column-count:4] 2xl:[column-count:5]">
            {filteredCards.map((card) => (
              <div
                className="masonry-item group relative overflow-hidden rounded-3xl bg-zinc-200 shadow-sm transition-all hover:scale-[1.02] hover:shadow-xl"
                key={card.image}
              >
                <Link href={routes.detail}>
                  <AppImage
                    alt={card.alt}
                    className={`w-full object-cover ${card.ratio}`}
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    src={card.image}
                  />
                  {card.overlay ?? null}
                  {card.footer ?? null}
                </Link>
              </div>
            ))}
          </div>
        )}

        <button className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-2xl md:hidden">
          <MaterialIcon>add</MaterialIcon>
        </button>
      </main>

      <MobileBottomNav active="home" className="md:hidden" homeRoute={routes.home} />
    </div>
  );
}
