import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CollectionsScreen } from "@/components/screens/collections-screen";
import { HomeFeedMobileScreen } from "@/components/screens/home-feed-mobile-screen";
import { HomeFeedWebScreen } from "@/components/screens/home-feed-web-screen";
import { MemeDetailViewScreen } from "@/components/screens/meme-detail-view-screen";
import type { CollectionBoard, CollectionsSummary } from "@/lib/collections/types";
import { routes } from "@/lib/routes";

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

describe("screen routing", () => {
  it("renders desktop home navigation routes", () => {
    render(<HomeFeedWebScreen />);

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
    render(<HomeFeedMobileScreen />);

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

    const image = screen.getByAltText(
      /confused cartoon cat with vibrant neon colors/i
    );
    expect(image.closest("a")).toHaveAttribute("href", routes.detail);
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
    render(<MemeDetailViewScreen />);

    expect(
      screen
        .getAllByRole("link", { name: /save to board/i })
        .some((element) => element.getAttribute("href") === routes.collections)
    ).toBe(true);

    expect(
      screen
        .getAllByAltText(/professional minimalist 3D avatar of a digital artist/i)
        .some((element) => element.closest("a")?.getAttribute("href") === routes.profile)
    ).toBe(true);
  });
});
