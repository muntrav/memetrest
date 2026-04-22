import type { Metadata } from "next";
import { SearchDiscoveryScreen } from "@/components/screens/search-discovery-screen";

export const metadata: Metadata = {
  title: "Memetrest Search & Discovery"
};

export default function SearchDiscoveryPage() {
  return <SearchDiscoveryScreen />;
}
