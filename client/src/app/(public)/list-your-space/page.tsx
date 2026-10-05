import { Metadata } from "next";
import ListYourSpaceView from "@/modules/marketplace/components/ListYourSpaceView";

export const metadata: Metadata = {
  title: "List Your Space | Partner with i-VANTAGE Marketplace",
  description:
    "Partner with i-VANTAGE to showcase your coworking center, managed offices, and executive meeting rooms to hundreds of verified startup and enterprise clients daily.",
  openGraph: {
    title: "List Your Space | Partner with i-VANTAGE Marketplace",
    description:
      "Showcase your workspace to high-intent enterprise clients across Gurugram and Delhi NCR. Zero upfront listing fees.",
  },
};

export default function ListYourSpacePage() {
  return <ListYourSpaceView />;
}
