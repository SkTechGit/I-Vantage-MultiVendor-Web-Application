import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import "./globals.css";

import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {

  metadataBase: new URL("https://i-vantage.in"),

  title: {
    default:
      "i-VANTAGE Business Hub | Business Services, Workspace & Business Support",
    template: "%s | i-VANTAGE Business Hub",
  },

  description:
    "i-VANTAGE Business Hub provides 100+ business support services including business setup, legal, finance, technology, marketing, HR, workspace, administration, and business growth solutions.",

  keywords: [
    "i-VANTAGE Business Hub",
    "i-VANTAGE",
    "business support services",
    "business setup services",
    "company registration",
    "GST registration",
    "virtual office",
    "coworking space",
    "workspace solutions",
    "legal business services",
    "finance services",
    "accounting services",
    "marketing services",
    "digital marketing",
    "technology services",
    "IT services",
    "HR services",
    "business growth services",
    "business consulting",
    "business administration",
  ],

  authors: [
    {
      name: "i-VANTAGE Business Hub",
    },
  ],

  creator: "i-VANTAGE Business Hub",
  publisher: "i-VANTAGE Business Hub",

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

 openGraph: {
  title: "i-VANTAGE Business Hub | Business Services & Business Support",
  description:
    "100+ business support services including business setup, legal, finance, technology, marketing, HR, workspace, and business growth solutions.",
  url: "https://i-vantage.in/",
  siteName: "i-VANTAGE Business Hub",
  images: [
    {
      url: "/logo.png",
      width: 1200,
      height: 630,
      alt: "i-VANTAGE Business Hub",
    },
  ],
  locale: "en_IN",
  type: "website",
},

  twitter: {
    card: "summary_large_image",

    title:
      "i-VANTAGE Business Hub | Business Services & Business Support",

    description:
      "100+ business support services including business setup, legal, finance, technology, marketing, HR, workspace, and business growth solutions.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="beforeInteractive"
        >
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-P9VBR7S4');
          `}
        </Script>

        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P9VBR7S4"
            height="0"
            width="0"
            style={{
              display: "none",
              visibility: "hidden",
            }}
          />
        </noscript>

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}