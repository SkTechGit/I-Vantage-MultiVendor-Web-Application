import type { Metadata } from "next";
import { AboutView } from "@/modules/about";

export const metadata: Metadata = {
  title: "About i-VANTAGE | Flexible Workspaces & Business Solutions in Gurgaon",

  description:
    "Discover i-VANTAGE's flexible workspace solutions in Gurgaon, including managed offices, coworking workstations, private cabins, meeting spaces and virtual office services.",

  keywords: [
    "i-VANTAGE Business Hub",
    "About i-VANTAGE",
    "coworking space Gurgaon",
    "managed offices Gurgaon",
    "private cabins Sohna Road",
    "boss cabin Gurgaon",
    "virtual office Gurgaon",
    "Welldone Tech Park coworking",
    "meeting room Sohna Road",
    "conference room Gurgaon",
    "flexible workspace Sector 48 Gurgaon",
    "ASW Asset Sense Workspaces",
  ],

  alternates: {
    canonical: "https://i-vantage.in/about",
  },

  openGraph: {
    title:
      "About i-VANTAGE | Flexible Workspaces & Business Solutions in Gurgaon",

    description:
      "Discover i-VANTAGE's flexible workspace solutions in Gurgaon, including managed offices, coworking workstations, private cabins, meeting spaces and virtual office services.",

    url: "https://i-vantage.in/about",
    siteName: "i-VANTAGE Business Hub",
    locale: "en_IN",
    type: "website",

    images: [
      {
        url: "/images/workspace/reception1.webp",
        width: 1200,
        height: 630,
        alt: "i-VANTAGE Business Hub at Welldone Tech Park, Gurgaon",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "About i-VANTAGE | Flexible Workspaces & Business Solutions in Gurgaon",

    description:
      "Discover i-VANTAGE's flexible workspace solutions in Gurgaon, including managed offices, coworking workstations, private cabins, meeting spaces and virtual office services.",

    images: ["/images/workspace/reception1.webp"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <AboutView />;
}