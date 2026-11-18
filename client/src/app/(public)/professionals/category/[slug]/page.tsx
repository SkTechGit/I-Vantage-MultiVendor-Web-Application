import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/common/Container";
import DirectoryExplorer from "@/components/professionals/listing/DirectoryExplorer";
import { professionalsApi } from "@/lib/professionals.api";
import { ChevronRight, ShieldCheck } from "lucide-react";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string; city?: string; q?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let categoryName = "Professionals";
  let categoryDesc = "";
  try {
    const categories = await professionalsApi.getCategories();
    const found = categories?.find((c: any) => c.slug === slug);
    if (found) {
      categoryName = found.label || found.name;
      categoryDesc = found.description || "";
    }
  } catch (err) {
    // fallback
  }

  const title = `Top Verified ${categoryName} in India | i-VANTAGE Network`;
  const description =
    categoryDesc ||
    `Connect directly with vetted ${categoryName} across India. Verified credentials, transparent advisory fee ranges, and boardroom consultations with zero brokerage.`;

  return {
    title,
    description: description.slice(0, 160),
    alternates: {
      canonical: `https://i-vantage.in/professionals/category/${slug}`,
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
      description: description.slice(0, 160),
      url: `https://i-vantage.in/professionals/category/${slug}`,
      siteName: "i-VANTAGE Business Hub",
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description.slice(0, 160),
    },
  };
}

export default async function CategoryProfessionalsPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sParams = searchParams ? await searchParams : {};
  const initialPage = Math.max(1, parseInt(sParams?.page || "1", 10) || 1);

  let categories: any[] = [];
  let currentCategory: any = null;
  let initialProfessionals: any[] = [];
  let initialTotal = 0;
  let facets = { cities: ["Gurugram", "Delhi", "Noida", "Bengaluru", "Mumbai"] };

  try {
    const [catRes, listRes, facetRes] = await Promise.all([
      professionalsApi.getCategories(),
      professionalsApi.list({
        category: slug,
        limit: 12,
        page: initialPage,
        city: sParams?.city,
        q: sParams?.q,
      }),
      professionalsApi.getFacets().catch(() => null),
    ]);

    categories = catRes || [];
    currentCategory = categories.find((c: any) => c.slug === slug);
    if (!currentCategory) {
      // If slug doesn't match any category, still show directory with slug filter or 404
      // Let's fallback gracefully
    }

    if (listRes && listRes.data) {
      initialProfessionals = listRes.data;
      initialTotal = listRes.meta?.total ?? listRes.total ?? listRes.data.length ?? 0;
    }
    if (facetRes) {
      facets = facetRes;
    }
  } catch (err) {
    console.error("Error fetching category professionals:", err);
  }

  const categoryTitle = currentCategory?.label || currentCategory?.name || slug.replace(/-/g, " ").toUpperCase();
  const categoryDesc = currentCategory?.description || `Explore top vetted ${categoryTitle} across India with verified credentials and transparent consultation pricing.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `https://i-vantage.in/professionals/category/${slug}`,
        name: `Verified ${categoryTitle} in India`,
        description: categoryDesc,
        url: `https://i-vantage.in/professionals/category/${slug}`,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: initialProfessionals.map((item, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            url: `https://i-vantage.in/professionals/${item.slug}`,
            name: item.fullName,
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
            name: categoryTitle,
            item: `https://i-vantage.in/professionals/category/${slug}`,
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
      {/* Category Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/20 to-[#F8FAFC] border-b border-slate-200/70 pt-8 pb-12 sm:pt-10 sm:pb-14">
        <Container>
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
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
                {categoryTitle}
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50/80 px-3 py-1 text-xs font-bold text-[#1E5BFF]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>VERIFIED CATEGORY DIRECTORY</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0A1F66] tracking-tight">
              Verified {categoryTitle}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              {categoryDesc}
            </p>
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
          defaultCategorySlug={slug}
          initialPage={initialPage}
        />
      </Container>
    </div>
  );
}
