import { RouteLoadingScreen } from "@/components/ui/route-loading-screen";

export default function BoardDetailLoading() {
  return (
    <RouteLoadingScreen
      accent="from-primary-container/50 via-white to-secondary/20"
      title="Loading board"
    />
  );
}
