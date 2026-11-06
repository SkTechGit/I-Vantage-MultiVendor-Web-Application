import { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/common/Container";
import DirectoryExplorer from "@/components/professionals/listing/DirectoryExplorer";
import { professionalsApi } from "@/lib/professionals.api";
import { ShieldCheck, Award, Building2, MapPin } from "lucide-react";

export const revalidate = 60; // ISR revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Verified CAs, Legal Consultants, Lawyers, Tax & HR Experts | i-VANTAGE Network",
  description:
    "Connect with vetted Chartered Accountants, Legal Consultants, Lawyers, Tax & GST advisors, and HR Professionals across India. Statutorily verified credentials, transparent pricing, and zero brokerage.",
  alternates: {
    canonical: "https://i-vantage.in/professionals",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Verified CAs, Legal Consultants, Lawyers, Tax & HR Experts | i-VANTAGE Network",
    description:
      "Connect with vetted Chartered Accountants, Legal Consultants, Lawyers, Tax & GST advisors, and HR Professionals across India.",
    url: "https://i-vantage.in/professionals",
    siteName: "i-VANTAGE Business Hub",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verified CAs, Legal Consultants, Lawyers, Tax & HR Experts | i-VANTAGE",
    description: "Connect directly with vetted Chartered Accountants, corporate advocates, and tax consultants in India.",
  },
};

export default async function ProfessionalsPage() {
  // Fetch initial directory data on server
  let initialProfessionals = [];
  let initialTotal = 0;
  let categories = [];
  let facets = { cities: ["Gurugram", "Delhi", "Noida", "Bengaluru", "Mumbai"] };

  try {
    const [listRes, catRes, facetRes] = await Promise.all([
      professionalsApi.list({ limit: 12 }),
      professionalsApi.getCategories(),
      professionalsApi.getFacets().catch(() => null),
    ]);

    if (listRes && listRes.data) {
      initialProfessionals = listRes.data;
      initialTotal = listRes.total || listRes.data.length;
    }
    if (catRes) {
      categories = catRes;
    }
    if (facetRes) {
      facets = facetRes;
    }
  } catch (err) {
    console.error("Error fetching professionals server-side:", err);
  }

  const topCities = [
    "Gurugram",
    "Delhi",
    "Noida",
    "Bengaluru",
    "Mumbai",
    "Hyderabad",
    "Pune",
    "Ahmedabad",
    "Chennai",
    "Kolkata",
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://i-vantage.in/professionals#webpage",
        url: "https://i-vantage.in/professionals",
        name: "Verified Chartered Accountants, Legal, Tax & HR Professionals Network | i-VANTAGE",
        description:
          "Connect directly with vetted Chartered Accountants, corporate advocates, tax consultants, and HR professionals across India.",
        breadcrumb: {
          "@id": "https://i-vantage.in/professionals#breadcrumb",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://i-vantage.in/professionals#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://i-vantage.in",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Professionals Network",
            item: "https://i-vantage.in/professionals",
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-24">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/20 to-[#F8FAFC] border-b border-slate-200/70 pt-12 pb-14 sm:pt-16 sm:pb-18">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-r from-blue-400/10 via-[#1E5BFF]/10 to-indigo-400/10 blur-3xl rounded-full"
        />

        <Container className="relative">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50/80 px-3.5 py-1 text-xs font-bold text-[#1E5BFF] shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>I-VANTAGE VERIFIED PROFESSIONALS NETWORK</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#0A1F66] leading-[1.15]">
              India&apos;s Verified Network of Chartered Accountants, Legal, Tax &amp; HR Professionals
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Connect directly with vetted Chartered Accountants, corporate lawyers, legal consultants, Tax &amp; GST advisors, and HR professionals. Statutorily verified practitioners with transparent pricing and zero brokerage.
            </p>

            {/* Trust Highlights Strip */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>100% Verified Credentials</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-[#C8942C]" />
                <span>Transparent Advisory Pricing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-[#1E5BFF]" />
                <span>Boardroom &amp; Virtual Consultations</span>
              </div>
            </div>

            {/* City Hub Quick Links (SEO & Discovery) */}
            <div className="pt-6 border-t border-slate-200/60 max-w-2xl mx-auto">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center justify-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#1E5BFF]" />
                <span>Explore Top Business Cities</span>
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {topCities.map((c) => (
                  <Link
                    key={c}
                    href={`/professionals/location/${c.toLowerCase()}`}
                    className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-white text-slate-700 border border-slate-200 hover:border-[#1E5BFF] hover:text-[#1E5BFF] hover:bg-blue-50/50 transition-all shadow-2xs"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content Area */}
      <Container className="mt-8">
        <DirectoryExplorer
          initialProfessionals={initialProfessionals}
          initialTotal={initialTotal}
          categories={categories}
          facets={facets}
        />
      </Container>
    </div>
  );
}
