import type { Metadata } from "next";
import ContactPage from "@/modules/lead/ContactPage";

export const metadata: Metadata = {
  title: "Contact i-VANTAGE | Coworking & Virtual Office in Gurugram",

  description:
    "Contact i-VANTAGE Business Hub for coworking spaces, virtual offices, professional business addresses and business support services at Welldone Tech Park, Sector 48, Sohna Road, Gurugram.",

  keywords: [
    "contact coworking space Gurgaon",
    "contact virtual office Gurgaon",
    "coworking space Sector 48 Gurgaon",
    "virtual office Sector 48 Gurgaon",
    "i-VANTAGE Business Hub contact",
    "business services Gurgaon",
    "Welldone Tech Park coworking",
    "Sohna Road coworking space",
  ],

  alternates: {
    canonical: "https://i-vantage.in/contact",
  },

  openGraph: {
    title: "Contact i-VANTAGE | Coworking & Virtual Office in Gurugram",

    description:
      "Get in touch with i-VANTAGE Business Hub for coworking, virtual office and business support solutions at Welldone Tech Park, Sector 48, Sohna Road, Gurugram.",

    url: "https://i-vantage.in/contact",
    siteName: "i-VANTAGE Business Hub",
    locale: "en_IN",
    type: "website",

    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Contact i-VANTAGE Business Hub",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Contact i-VANTAGE | Coworking & Virtual Office in Gurugram",

    description:
      "Contact i-VANTAGE Business Hub for coworking, virtual office and business support services in Sector 48, Sohna Road, Gurugram.",

    images: ["/logo.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <ContactPage />;
}