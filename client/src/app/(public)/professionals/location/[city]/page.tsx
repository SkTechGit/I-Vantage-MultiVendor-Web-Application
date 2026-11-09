import { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/common/Container";
import DirectoryExplorer from "@/components/professionals/listing/DirectoryExplorer";
import { professionalsApi } from "@/lib/professionals.api";
import { ChevronRight, MapPin, ShieldCheck, Award, Building2, Globe2, Sparkles } from "lucide-react";

export const revalidate = 60;

interface Props {
  params: Promise<{ city: string }>;
}

const POPULAR_HUBS = [
  { name: "Gurugram", slug: "gurugram" },
  { name: "Delhi", slug: "delhi" },
  { name: "Noida", slug: "noida" },
  { name: "Bengaluru", slug: "bengaluru" },
  { name: "Mumbai", slug: "mumbai" },
  { name: "Hyderabad", slug: "hyderabad" },
  { name: "Pune", slug: "pune" },
  { name: "Ahmedabad", slug: "ahmedabad" },
  { name: "Chennai", slug: "chennai" },
  { name: "Kolkata", slug: "kolkata" },
];

function formatCityName(raw: string): string {
  const decoded = decodeURIComponent(raw).replace(/[-_]+/g, " ").trim();
  return decoded
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const cityName = formatCityName(city);

  const title = `Top Verified Chartered Accountants, Lawyers & Advisors in ${cityName} | i-VANTAGE`;
  const description = `Connect directly with vetted Chartered Accountants, corporate advocates, tax consultants, and HR advisors in ${cityName}. Statutorily verified credentials, boardrooms, and zero brokerage on i-VANTAGE.`.slice(0, 160);

  const canonicalUrl = `https://i-vantage.in/professionals/location/${city.toLowerCase()}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
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
      title,
      description,
      url: canonicalUrl,
      siteName: "i-VANTAGE Business Hub",
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function LocationProfessionalsPage({ params }: Props) {
  const { city } = await params;
  const cityName = formatCityName(city);

  let categories: any[] = [];
  let initialProfessionals: any[] = [];
  let initialTotal = 0;
  let isFallbackOnline = false;
  let facets = { cities: ["Gurugram", "Delhi", "Noida", "Bengaluru", "Mumbai"] };

  try {
    const [catRes, listRes, facetRes] = await Promise.all([
      professionalsApi.getCategories(),
      professionalsApi.list({ city: cityName, limit: 12 }),
      professionalsApi.getFacets().catch(() => null),
    ]);

    categories = catRes || [];
    if (listRes && listRes.data && listRes.data.length > 0) {
      initialProfessionals = listRes.data;
      initialTotal = listRes.total || listRes.data.length;
    } else {
      // Graceful fallback: If no local practitioners are registered yet in this city,
      // load verified practitioners offering Pan-India online consultation for clients in this city!
      const onlineFallbackRes = await professionalsApi.list({ limit: 12, mode: "ONLINE" }).catch(() => null);
      if (onlineFallbackRes && onlineFallbackRes.data && onlineFallbackRes.data.length > 0) {
        initialProfessionals = onlineFallbackRes.data;
        initialTotal = onlineFallbackRes.total || onlineFallbackRes.data.length;
        isFallbackOnline = true;
      }
    }

    if (facetRes) {
      facets = facetRes;
    }
  } catch (err) {
    console.error("Error fetching location professionals:", err);
  }

  // Schema.org Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `https://i-vantage.in/professionals/location/${city.toLowerCase()}`,
        name: `Verified Professionals in ${cityName}`,
        description: `Directory of vetted Chartered Accountants, corporate lawyers, tax advisors, and company secretaries practicing in ${cityName}.`,
        url: `https://i-vantage.in/professionals/location/${city.toLowerCase()}`,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: initialProfessionals.map((item, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            url: `https://i-vantage.in/professionals/${item.slug}`,
            name: `${item.fullName} - ${item.categoryId?.label || "Professional"} in ${cityName}`,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
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
          {
            "@type": "ListItem",
            position: 3,
            name: `${cityName} Hub`,
            item: `https://i-vantage.in/professionals/location/${city.toLowerCase()}`,
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

      {/* Location Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/20 to-[#F8FAFC] border-b border-slate-200/70 pt-8 pb-12 sm:pt-10 sm:pb-14">
        <Container>
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1.5 text-xs text-slate-500 font-medium flex-wrap">
              <li>
                <Link href="/" className="hover:text-[#1E5BFF] transition-colors">
                  Home
                </Link>
              </li>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <li>
                <Link href="/professionals" className="hover:text-[#1E5BFF] transition-colors">
                  Professionals
                </Link>
              </li>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <li className="text-[#0A1F66] font-bold truncate max-w-[200px]">
                {cityName}
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50/80 px-3 py-1 text-xs font-bold text-[#1E5BFF]">
              <MapPin className="h-3.5 w-3.5 text-[#1E5BFF]" />
              <span>LOCAL VERIFIED PROFESSIONAL NETWORK • {cityName.toUpperCase()}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0A1F66] tracking-tight">
              Verified Professionals in {cityName}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl font-normal">
              Connect directly with vetted Chartered Accountants, corporate advocates, tax consultants, company secretaries, and HR advisors in {cityName}. ICAI &amp; Bar Council verified with zero brokerage.
            </p>

            {/* Popular City Cross-linking Pills */}
            <div className="pt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 mr-1">Other Hubs:</span>
              {POPULAR_HUBS.map((hub) => (
                <Link
                  key={hub.slug}
                  href={`/professionals/location/${hub.slug}`}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition ${
                    hub.slug === city.toLowerCase()
                      ? "bg-[#0A1F66] text-white border-[#0A1F66]"
                      : "bg-white text-slate-600 hover:text-[#1E5BFF] border-slate-200 hover:border-blue-200"
                  }`}
                >
                  {hub.name}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content Area */}
      <Container className="mt-8">
        {isFallbackOnline && (
          <div className="mb-6 rounded-2xl border border-blue-200/80 bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-blue-50/90 p-4 sm:p-5 flex items-start gap-3.5 text-slate-700 shadow-2xs">
            <Globe2 className="w-5 h-5 text-[#1E5BFF] shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm space-y-1">
              <div className="font-bold text-[#0A1F66] flex items-center gap-2">
                <span>Pan-India Verified Advisors Available for Remote &amp; Virtual Consultation in {cityName}</span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1E5BFF] text-white">Online Active</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-xs">
                While local physical practitioners are onboarding in {cityName}, the empaneled Chartered Accountants and Corporate Advocates below serve clients in {cityName} via virtual boardroom consultations, online GST &amp; ROC filings, and pan-India compliance advisory.
              </p>
            </div>
          </div>
        )}

        <DirectoryExplorer
          initialProfessionals={initialProfessionals}
          initialTotal={initialTotal}
          categories={categories}
          facets={facets}
          defaultCity={isFallbackOnline ? "" : cityName}
        />
      </Container>
    </div>
  );
}
