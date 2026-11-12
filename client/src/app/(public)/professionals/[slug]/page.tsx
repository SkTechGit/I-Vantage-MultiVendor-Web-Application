import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import ProfileHero from "@/components/professionals/profile/ProfileHero";
import ProfileDetailView from "@/components/professionals/profile/ProfileDetailView";
import { professionalsApi, ProfessionalProfileItem } from "@/lib/professionals.api";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim();

  if (decodedSlug === "location" || decodedSlug === "category") {
    return { title: "Verified Professionals Directory | i-VANTAGE" };
  }

  try {
    const p = await professionalsApi.getBySlug(decodedSlug);
    if (!p) return { title: "Professional Not Found | i-VANTAGE" };

    const categoryName = p.categoryId?.label || p.categoryId?.name || "Professional";
    const categorySlug = p.categoryId?.slug || "";
    const isTaxOrGST = categorySlug.includes("tax") || categorySlug.includes("gst") || Boolean(p.gstin);
    const roleTitle = p.designation || (isTaxOrGST ? "GST & Taxation Consultant" : categoryName);
    
    // Exact SEO format: {Role} in {City} – {FullName} | i-VANTAGE
    const title = `${roleTitle} in ${p.city} – ${p.fullName} | i-VANTAGE`;
    
    // Dynamic high-converting SEO description
    const servicesSummary = Array.isArray(p.services) && p.services.length > 0
      ? p.services.map((s) => s.title).slice(0, 4).join(", ")
      : Array.isArray(p.specializations) && p.specializations.length > 0
      ? p.specializations.slice(0, 4).join(", ")
      : p.headline;

    const description = `${servicesSummary} in ${p.city}. Consult ${p.fullName}${p.firmName ? ` (${p.firmName})` : ""}, verified ${categoryName} on i-VANTAGE. Direct advisory, verified statutory credentials, and zero brokerage.`.slice(0, 160);

    const canonicalUrl = `https://i-vantage.in/professionals/${decodedSlug}`;
    const ogImages = p.photoUrl
      ? [{ url: p.photoUrl, width: 800, height: 800, alt: `${p.fullName} - Verified ${categoryName} in ${p.city}` }]
      : [];

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
        type: "profile",
        images: ogImages,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: p.photoUrl ? [p.photoUrl] : [],
      },
    };
  } catch {
    return {
      title: "Verified Professional Profile | i-VANTAGE",
      description: "Consult verified chartered accountants, corporate lawyers, tax consultants, and advisors on i-VANTAGE.",
    };
  }
}

export default async function ProfessionalProfilePage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim();

  if (decodedSlug === "location" || decodedSlug === "category") {
    redirect("/professionals");
  }

  let professional: ProfessionalProfileItem | null = null;
  let relatedProfessionals: ProfessionalProfileItem[] = [];

  try {
    const [proData, relatedData] = await Promise.all([
      professionalsApi.getBySlug(decodedSlug),
      professionalsApi.getRelated(decodedSlug).catch(() => []),
    ]);

    professional = proData;
    relatedProfessionals = relatedData || [];
  } catch (err) {
    console.error("Failed to load professional profile:", err);
  }

  if (!professional) {
    notFound();
  }

  const p = professional;
  const categoryName = p.categoryId?.label || p.categoryId?.name || "Professional";
  const categorySlug = p.categoryId?.slug || "";

  const isAccounting =
    categorySlug.includes("accountant") ||
    categorySlug.includes("tax") ||
    categorySlug.includes("cfo") ||
    categorySlug.includes("cma");
  const isLegal =
    categorySlug.includes("legal") ||
    categorySlug.includes("lawyer") ||
    categorySlug.includes("secretary") ||
    categorySlug.includes("attorney") ||
    categorySlug.includes("insolvency");

  const serviceType = isAccounting
    ? "AccountingService"
    : isLegal
    ? "LegalService"
    : "ProfessionalService";

  // Comprehensive Schema.org Graph (Person + Specialized Service + Breadcrumbs)
  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `https://i-vantage.in/professionals/${p.slug}#person`,
        name: p.fullName,
        jobTitle: p.headline || categoryName,
        honorificPrefix: p.designation || undefined,
        description: p.summary || p.aboutMd?.slice(0, 300),
        image: p.photoUrl || undefined,
        telephone: p.contactPhone || undefined,
        email: p.contactEmail || undefined,
        url: `https://i-vantage.in/professionals/${p.slug}`,
        sameAs: [p.linkedinUrl, p.websiteUrl, p.caConnectUrl].filter(Boolean),
        knowsAbout: p.specializations || [],
        address: {
          "@type": "PostalAddress",
          addressLocality: p.city,
          addressRegion: p.state,
          postalCode: p.pincode || undefined,
          addressCountry: "IN",
        },
        hasCredential: p.registrationNumber
          ? {
              "@type": "EducationalOccupationalCredential",
              credentialCategory: "Professional License",
              recognizedBy: {
                "@type": "Organization",
                name: p.registrationBody || "Statutory Professional Regulatory Body",
              },
            }
          : undefined,
      },
      {
        "@type": serviceType,
        "@id": `https://i-vantage.in/professionals/${p.slug}#service`,
        name: `${p.fullName} — ${categoryName}`,
        description: p.summary,
        url: `https://i-vantage.in/professionals/${p.slug}`,
        image: p.photoUrl || undefined,
        provider: {
          "@id": `https://i-vantage.in/professionals/${p.slug}#person`,
        },
        priceRange: p.consultationFeeInr
          ? `₹${p.consultationFeeInr}${p.consultationFeeMaxInr ? ` - ₹${p.consultationFeeMaxInr}` : ""}`
          : "₹₹",
        currenciesAccepted: "INR",
        paymentAccepted: Array.isArray(p.acceptedPaymentMethods)
          ? p.acceptedPaymentMethods.join(", ")
          : undefined,
        areaServed:
          Array.isArray(p.servesAreas) && p.servesAreas.length > 0
            ? p.servesAreas.map((area) => ({
                "@type": "AdministrativeArea",
                name: area,
              }))
            : { "@type": "City", name: p.city },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Professional Advisory Services",
          itemListElement: (Array.isArray(p.services) && p.services.length > 0 ? p.services : (p.specializations || []).slice(0, 4).map(s => ({ title: s, description: `Statutory compliance and advisory for ${s}`, priceInr: p.consultationFeeInr }))).map((s: any, idx: number) => ({
            "@type": "Offer",
            position: idx + 1,
            itemOffered: {
              "@type": "Service",
              name: s.title,
              description: s.description,
              provider: {
                "@id": `https://i-vantage.in/professionals/${p.slug}#person`,
              },
            },
            price: s.priceInr || p.consultationFeeInr,
            priceCurrency: "INR",
          })),
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: p.officeAddress || undefined,
          addressLocality: p.city,
          addressRegion: p.state,
          postalCode: p.pincode || undefined,
          addressCountry: "IN",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://i-vantage.in/professionals/${p.slug}#breadcrumbs`,
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
          ...(categorySlug
            ? [
                {
                  "@type": "ListItem",
                  position: 3,
                  name: categoryName,
                  item: `https://i-vantage.in/professionals/category/${categorySlug}`,
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: p.fullName,
                  item: `https://i-vantage.in/professionals/${p.slug}`,
                },
              ]
            : [
                {
                  "@type": "ListItem",
                  position: 3,
                  name: p.fullName,
                  item: `https://i-vantage.in/professionals/${p.slug}`,
                },
              ]),
        ],
      },
    ],
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />

      {/* Hero Header Section */}
      <ProfileHero professional={p} />

      {/* Interactive Detail Body View */}
      <ProfileDetailView
        professional={p}
        relatedProfessionals={relatedProfessionals}
      />
    </div>
  );
}
