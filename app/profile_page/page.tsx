import type { Metadata } from "next";
import { ProfilePageScreen } from "@/components/screens/profile-page-screen";
import { getOptionalServerSession } from "@/lib/auth/server-session";
import { getCollectionsSnapshotForViewer } from "@/lib/collections/snapshot";

export const metadata: Metadata = {
  title: "Memetrest - Profile"
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const authSession = await getOptionalServerSession();
  const collectionsSnapshot = await getCollectionsSnapshotForViewer("recent");

  return (
    <ProfilePageScreen
      authSession={authSession}
      collectionsSummary={collectionsSnapshot.summary}
      recentBoards={collectionsSnapshot.boards}
    />
  );
}
