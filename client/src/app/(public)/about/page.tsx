import type { Metadata } from "next";
import AboutPage from "@/components/layout/AboutPage";

export const metadata: Metadata = {
  title: "About i-VANTAGE | Coworking & Virtual Office in Gurugram",

  description:
    "Learn about i-VANTAGE Business Hub, a coworking and virtual office provider at Welldone Tech Park, Sector 48, Sohna Road, Gurugram, offering flexible workspaces and business support solutions.",

  keywords: [
    "i-VANTAGE Business Hub",
    "coworking space Gurgaon",
    "virtual office Gurgaon",
    "coworking space Sector 48 Gurgaon",
    "virtual office Sector 48 Gurgaon",
    "business support services Gurgaon",
    "workspace solutions Gurgaon",
    "Welldone Tech Park coworking",
    "Sohna Road coworking",
  ],

  alternates: {
    canonical: "https://i-vantage.in/about",
  },

  openGraph: {
    title: "About i-VANTAGE | Coworking & Virtual Office in Gurugram",

    description:
      "Discover i-VANTAGE Business Hub and our coworking, virtual office, workspace and business support solutions in Sector 48, Sohna Road, Gurugram.",

    url: "https://i-vantage.in/about",
    siteName: "i-VANTAGE Business Hub",
    locale: "en_IN",
    type: "website",

    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "i-VANTAGE Business Hub",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "About i-VANTAGE | Coworking & Virtual Office in Gurugram",

    description:
      "Learn about i-VANTAGE Business Hub, offering coworking, virtual office and business support solutions in Sector 48, Sohna Road, Gurugram.",

    images: ["/logo.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <AboutPage />;
}