import { HomeFeedMobileScreen } from "@/components/screens/home-feed-mobile-screen";
import { HomeFeedWebScreen } from "@/components/screens/home-feed-web-screen";

export default function HomePage() {
  return (
    <>
      <div className="hidden md:block">
        <HomeFeedWebScreen />
      </div>
      <div className="md:hidden">
        <HomeFeedMobileScreen />
      </div>
    </>
  );
}
