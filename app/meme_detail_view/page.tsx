import type { Metadata } from "next";
import { MemeDetailViewScreen } from "@/components/screens/meme-detail-view-screen";

export const metadata: Metadata = {
  title: "Memetrest - Meme Detail"
};

export default function MemeDetailViewPage() {
  return <MemeDetailViewScreen />;
}
