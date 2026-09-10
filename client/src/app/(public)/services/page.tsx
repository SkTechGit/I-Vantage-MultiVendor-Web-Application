import type { Metadata } from "next";
import { ServicesView } from "@/modules/services";

export const metadata: Metadata = {
  title:
    "Services | Flexible Workspaces & Business Solutions in Gurgaon | i-VANTAGE",

  description:
    "Explore flexible workspace solutions (managed offices, coworking seats, private cabins, meeting rooms, virtual office) and comprehensive business support services (legal, accounting, HR, funding, marketing, AI automation) at Welldone Tech Park, Sohna Road, Gurgaon.",

  keywords: [
    "coworking space Gurgaon",
    "managed office Gurgaon",
    "private cabins Sohna Road",
    "dedicated workstations Gurgaon",
    "virtual office Gurgaon",
    "meeting rooms Welldone Tech Park",
    "conference room Gurgaon",
    "business support services Gurgaon",
    "legal compliance Gurgaon",
    "accounting and taxation services Gurgaon",
    "business funding support Gurgaon",
    "i-VANTAGE Business Hub",
    "Asset Sense Workspaces",
  ],

  alternates: {
    canonical: "https://i-vantage.in/services",
  },

  openGraph: {
    title:
      "Services | Flexible Workspaces & Business Solutions in Gurgaon | i-VANTAGE",

    description:
      "Explore flexible workspace solutions and integrated business support services at Welldone Tech Park, Sector 48, Sohna Road, Gurgaon.",

    url: "https://i-vantage.in/services",
    siteName: "i-VANTAGE Business Hub",
    locale: "en_IN",
    type: "website",

    images: [
      {
        url: "/images/workspace/conf1.webp",
        width: 1200,
        height: 630,
        alt: "i-VANTAGE Business Hub Workspace Solutions",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Services | Flexible Workspaces & Business Solutions in Gurgaon | i-VANTAGE",
    description:
      "Explore flexible workspace solutions and integrated business support services at Welldone Tech Park, Sector 48, Sohna Road, Gurgaon.",
    images: ["/images/workspace/conf1.webp"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <ServicesView />;
}