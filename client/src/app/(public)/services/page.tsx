import type { Metadata } from "next";
import ServicesPage from "@/modules/service/components/ServicesPage";

export const metadata: Metadata = {
  title: "Business Services in Gurugram | i-VANTAGE Business Hub",

  description:
    "Explore business services from i-VANTAGE Business Hub in Gurugram, including business setup, legal, finance, technology, marketing, HR, coworking, virtual office and business support solutions.",

  keywords: [
    "business services in Gurugram",
    "business services in Gurgaon",
    "business support services Gurgaon",
    "business setup services Gurgaon",
    "business consultancy Gurgaon",
    "legal services for businesses Gurgaon",
    "finance services Gurgaon",
    "HR services Gurgaon",
    "marketing services Gurgaon",
    "technology services Gurgaon",
    "coworking services Gurgaon",
    "virtual office services Gurgaon",
    "business solutions Gurgaon",
    "i-VANTAGE Business Hub",
  ],

  alternates: {
    canonical: "https://i-vantage.in/services",
  },

  openGraph: {
    title: "Business Services in Gurugram | i-VANTAGE Business Hub",

    description:
      "Business setup, legal, finance, technology, marketing, HR, coworking, virtual office and other business support services in Gurugram.",

    url: "https://i-vantage.in/services",
    siteName: "i-VANTAGE Business Hub",
    locale: "en_IN",
    type: "website",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "i-VANTAGE Business Hub Business Services",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Business Services in Gurugram | i-VANTAGE Business Hub",
    description:
      "Business setup, legal, finance, technology, marketing, HR, coworking, virtual office and business support services in Gurugram.",
    images: ["/logo.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <ServicesPage />;
}