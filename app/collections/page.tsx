import type { Metadata } from "next";
import { Suspense } from "react";
import { CollectionsContent } from "@/components/screens/collections-content";
import { RouteLoadingScreen } from "@/components/ui/route-loading-screen";

export const metadata: Metadata = {
  title: "Memetrest - Collections"
};

type CollectionsPageProps = {
  searchParams: Promise<{
    filter?: string | string[];
  }>;
};

export default async function CollectionsPage({
  searchParams
}: CollectionsPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <Suspense
      fallback={
        <RouteLoadingScreen
          accent="from-primary-container/50 via-white to-secondary/20"
          title="Loading collections"
        />
      }
    >
      <CollectionsContent filterQuery={resolvedSearchParams.filter} />
    </Suspense>
  );
}
