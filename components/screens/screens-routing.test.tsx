import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CollectionsScreen } from "@/components/screens/collections-screen";
import { HomeFeedMobileScreen } from "@/components/screens/home-feed-mobile-screen";
import { HomeFeedWebScreen } from "@/components/screens/home-feed-web-screen";
import { MemeDetailViewScreen } from "@/components/screens/meme-detail-view-screen";
import type { CollectionBoard, CollectionsSummary } from "@/lib/collections/types";
import type { FeedCardViewModel, FeedLaneViewModel } from "@/lib/posts/presentation";
import { postDetailHref, routes } from "@/lib/routes";

const collectionBoards: CollectionBoard[] = [
  {
    id: "board-funny-reactions",
    title: "Funny Reactions",
    itemCount: 128,
    previewImages: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDemufbxXbh1ujMa_6jfTyoosrkb8DTaYiNYhVUorX-p8YwhSSOHwWXs0VWa6ISvhj3EOtqQhCLTDYsp0cIGrZwxRV6V1wJte6Hj8Khie4E622H9FPZOhgwdfdLsXQwyh1FlkfzsICth0kVXr5GftlPegJtVQQD9mnJI4XTqFndGMO75S7qELDlg1kvsYir4dU8Udz0ooa7wIgn3IsNVG6ECRWo_nBFyjzYNkUHO5rQNT_zboMJ8WONGPTkWDg26TV2hDM-pCckjJoS"
    ],
    visibility: "public",
    tags: ["reactions"],
    updatedAt: "2026-04-22T09:00:00.000Z"
  }
];

const collectionsSummary: CollectionsSummary = {
  boardCount: 1,
  totalItemCount: 128,
  privateBoardCount: 0,
  taggedBoardPercentage: 100
};

const homeCards: FeedCardViewModel[] = [
  {
    id: "post-cat",
    href: postDetailHref("post-cat"),
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAWLLaLrNmdcOH5uN-QEspmSvhyEUHxx8XM0mOvRlwEb-rrhqyd5q873uaPt2wmTYX5BP2i6_TljiK0a6W8kx_2PR8DvAzeajpnQkr7ZN0DceLUpqHdOjdYhdsevIL_ekBv7fvj-02fXyFT_KON89T0uCsBRaqYStWyZ_gQivAcWt19jBgEWSvZNNbfCKtfWjX2CbsZ9Zoke6TuGj1Kc6OHzKkvHUiiZcsSvosTSXR7N7We7_eaAtTc2PtVnOqEUomonKI_j4PspQtn",
    imageAlt: "Confused cartoon cat by Meme Artist",
    aspectRatio: "3 / 4",
    headline: "Confused cartoon cat",
    supportingText: "When the deploy works locally",
    creatorName: "Meme Artist",
    creatorUsername: "@meme_artist",
    creatorAvatarUrl: null,
    tags: ["cats", "deploy"],
    saveCountLabel: "12k"
  },
  {
    id: "post-mountain",
    href: postDetailHref("post-mountain"),
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDE05BISAKuMzZkM00JWrGPoBJQgXjirBdJpSFNO7uTsq5OxYnP0u7pUlKpNXDIBgYgVY-70CNyWPidlh___MfUpmk24rJHgkE_lqTgd54FxC_aNNQ-27PuKQ0J0AOrNACt-49KS2JDYI21g6-lnTJJWIFwiPdBkY0TMftu82SUfnkzSlSpcIUpAwy64osqWd9aFvmepsSxdl-XNQNOlxDPPZlqAfYapk11KGGBsA94TkC1LwdCrQYLgt7A4kSb62pMmdOMIy-yn2x8",
    imageAlt: "Majestic mountain peak meme by Summit Poster",
    aspectRatio: "3 / 4",
    headline: "Majestic mountain peak at sunset",
    supportingText: "Weekend energy",
    creatorName: "Summit Poster",
    creatorUsername: "@summit",
    creatorAvatarUrl: null,
    tags: ["nature"],
    saveCountLabel: "840"
  }
];

const homeLanes: FeedLaneViewModel[] = [
  {
    key: "all",
    label: "All Memes",
    cards: homeCards
  },
  {
    key: "trending",
    label: "Trending",
    cards: [homeCards[0]]
  }
];

const detailPost = {
  ...homeCards[0],
  savedBoardCount: 2,
  followerCountLabel: "2,400"
};

describe("screen routing", () => {
  it("renders desktop home navigation routes", () => {
    render(<HomeFeedWebScreen lanes={homeLanes} />);

    expect(
      screen
        .getAllByRole("link", { name: /memetrest/i })
        .some((element) => element.getAttribute("href") === routes.home)
    ).toBe(true);
    expect(
      screen
        .getAllByLabelText("Home")
        .some((element) => element.getAttribute("href") === routes.home)
    ).toBe(true);
    expect(
      screen
        .getAllByLabelText("Explore")
        .some((element) => element.getAttribute("href") === routes.search)
    ).toBe(true);
    expect(
      screen
        .getAllByLabelText("Collections")
        .some((element) => element.getAttribute("href") === routes.collections)
    ).toBe(true);
    expect(
      screen
        .getAllByLabelText("Profile")
        .some((element) => element.getAttribute("href") === routes.profile)
    ).toBe(true);
  });

  it("renders mobile home routes and detail links", () => {
    render(<HomeFeedMobileScreen lanes={homeLanes} />);

    expect(
      screen
        .getAllByRole("link", { name: /memetrest/i })
        .some((element) => element.getAttribute("href") === routes.home)
    ).toBe(true);
    expect(
      screen
        .getAllByLabelText("Home")
        .some((element) => element.getAttribute("href") === routes.home)
    ).toBe(true);
    expect(
      screen
        .getAllByLabelText("Explore")
        .some((element) => element.getAttribute("href") === routes.search)
    ).toBe(true);
    expect(
      screen
        .getAllByLabelText("Saved")
        .some((element) => element.getAttribute("href") === routes.collections)
    ).toBe(true);
    expect(
      screen
        .getAllByLabelText("Profile")
        .some((element) => element.getAttribute("href") === routes.profile)
    ).toBe(true);

    const image = screen.getByAltText(/confused cartoon cat by meme artist/i);
    expect(image.closest("a")).toHaveAttribute("href", `${routes.detail}?post=post-cat`);
  });

  it("filters desktop home cards with the inline search field", () => {
    render(<HomeFeedWebScreen lanes={homeLanes} />);

    fireEvent.change(screen.getByPlaceholderText(/search for memes, stickers, or creators/i), {
      target: { value: "mountain" }
    });

    expect(screen.getByAltText(/majestic mountain peak meme by summit poster/i)).toBeInTheDocument();
    expect(screen.queryByAltText(/confused cartoon cat by meme artist/i)).not.toBeInTheDocument();
  });

  it("shows the mobile empty state when search has no matches", () => {
    render(<HomeFeedMobileScreen lanes={homeLanes} />);

    fireEvent.change(screen.getByPlaceholderText(/search memes/i), {
      target: { value: "not-a-real-meme" }
    });

    expect(screen.getByText(/no memes found for/i)).toBeInTheDocument();
    expect(screen.getByText("not-a-real-meme")).toBeInTheDocument();
  });

  it("links collections boards to the detail route", () => {
    render(<CollectionsScreen boards={collectionBoards} filter="all" summary={collectionsSummary} />);

    expect(
      screen
        .getAllByAltText("Funny Reactions")
        .some((element) => element.closest("a")?.getAttribute("href") === routes.detail)
    ).toBe(true);
  });

  it("renders detail page cross-route links", () => {
    render(
      <MemeDetailViewScreen
        post={detailPost}
        relatedItems={[homeCards[1]]}
        statusDescription={null}
        statusTitle={null}
      />
    );

    expect(
      screen
        .getAllByRole("link", { name: /save to board/i })
        .some((element) => element.getAttribute("href") === routes.collections)
    ).toBe(true);

    expect(
      screen
        .getAllByText(/meme artist/i)
        .some((element) => element.closest("a")?.getAttribute("href") === routes.profile)
    ).toBe(true);
  });
});
