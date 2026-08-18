import type { Metadata } from "next";

import HomePage from "@/modules/home/components/HomePage";
import { getPublicCategories } from "@/modules/category/category.api";
import { getPublicServices } from "@/modules/service/service.api";

export const revalidate = 300;

export const metadata: Metadata = {
  title:
    "Coworking & Virtual Office in Gurugram | i-VANTAGE Business Hub",

  description:
    "i-VANTAGE Business Hub offers coworking spaces, virtual offices, professional business addresses and business support services in Welldone Tech Park, Sector 48, Sohna Road, Gurugram, Haryana.",

  keywords: [
    "coworking space in Gurugram",
    "coworking space in Gurgaon",
    "coworking space Sector 48 Gurgaon",
    "coworking space Sohna Road Gurgaon",
    "coworking space in Sector 48 Gurugram",
    "virtual office in Gurugram",
    "virtual office in Gurgaon",
    "virtual office Sector 48 Gurgaon",
    "virtual office Sohna Road Gurgaon",
    "virtual office Welldone Tech Park",
    "business address in Gurgaon",
    "professional business address Gurgaon",
    "shared office space Gurgaon",
    "office space in Sector 48 Gurgaon",
    "flexible office space Gurgaon",
    "managed office Gurgaon",
    "meeting room Gurgaon",
    "business support services Gurgaon",
    "i-VANTAGE Business Hub",
  ],

  alternates: {
    canonical: "https://i-vantage.in/",
  },

  openGraph: {
    title:
      "Coworking & Virtual Office in Gurugram | i-VANTAGE Business Hub",

    description:
      "Flexible coworking spaces, virtual offices, professional business addresses and business support services at Welldone Tech Park, Sector 48, Sohna Road, Gurugram.",

    url: "https://i-vantage.in/",
    siteName: "i-VANTAGE Business Hub",
    locale: "en_IN",
    type: "website",

    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "i-VANTAGE Business Hub - Coworking & Virtual Office in Gurugram",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Coworking & Virtual Office in Gurugram | i-VANTAGE Business Hub",

    description:
      "Coworking spaces, virtual offices, professional business addresses and business support services in Sector 48, Sohna Road, Gurugram.",

    images: ["/logo.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default async function Page() {
  const categories = await getPublicCategories();
  const services = await getPublicServices();

  return (
    <HomePage
      categories={categories}
      services={services}
    />
  );
}