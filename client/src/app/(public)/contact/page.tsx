import type { Metadata } from "next";
import { ContactView } from "@/modules/contact";

export const metadata: Metadata = {
  title: "Contact i-VANTAGE Business Hub | Workspace & Business Solutions",

  description:
    "Get in touch with i-VANTAGE Business Hub for coworking spaces, virtual offices, private cabins, meeting rooms and business support solutions in Gurgaon.",

  keywords: [
    "contact i-VANTAGE Business Hub",
    "coworking space Gurgaon contact",
    "virtual office Gurgaon contact",
    "Welldone Tech Park coworking",
    "Sohna Road workspace",
    "private cabin Gurgaon",
    "meeting rooms Gurgaon",
    "GST registration Gurgaon",
    "Asset Sense Workspaces",
  ],

  alternates: {
    canonical: "https://i-vantage.in/contact",
  },

  openGraph: {
    title: "Contact i-VANTAGE Business Hub | Workspace & Business Solutions",

    description:
      "Get in touch with i-VANTAGE Business Hub for coworking spaces, virtual offices, private cabins, meeting rooms and business support solutions in Gurgaon.",

    url: "https://i-vantage.in/contact",
    siteName: "i-VANTAGE Business Hub",
    locale: "en_IN",
    type: "website",

    images: [
      {
        url: "/images/workspace/conf1.webp",
        width: 1200,
        height: 630,
        alt: "Contact i-VANTAGE Business Hub",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Contact i-VANTAGE Business Hub | Workspace & Business Solutions",
    description:
      "Get in touch with i-VANTAGE Business Hub for coworking spaces, virtual offices, private cabins, meeting rooms and business support solutions in Gurgaon.",
    images: ["/images/workspace/conf1.webp"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <ContactView />;
}