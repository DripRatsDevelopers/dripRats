import { Metadata } from "next";
import LandingPage from "./LandingPage";

export const metadata: Metadata = {
  title: "Search | Driprats",
  description: "Find futuristic jewelry collections from Driprats.",
  robots: {
    index: false,
    follow: true,
  },
};

const ShopPage = () => {
  return <LandingPage />;
};

export default ShopPage;
