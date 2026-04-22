import type { Metadata } from "next";
import { ProfilePageScreen } from "@/components/screens/profile-page-screen";

export const metadata: Metadata = {
  title: "Memetrest - Profile"
};

export default function ProfilePage() {
  return <ProfilePageScreen />;
}
