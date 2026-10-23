import { Metadata } from "next";
import { notFound } from "next/navigation";
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

  try {
    const p = await professionalsApi.getBySlug(decodedSlug);
    if (!p) return { title: "Professional Not Found | i-VANTAGE" };

    const categoryName = p.categoryId?.label || p.categoryId?.name || "Professional";
    const title = `${p.fullName}${p.qualification ? ` (${p.qualification})` : ""} - Verified ${categoryName} in ${p.city} | i-VANTAGE`;
    const description = `${p.headline || p.summary || `Consult verified ${categoryName} ${p.fullName} in ${p.city}. Transparent fees, direct engagement.`}`;

    return {
      title,
      description: description.slice(0, 160),
      alternates: {
        canonical: `https://i-vantage.in/professionals/${decodedSlug}`,
      },
      openGraph: {
        title,
        description: description.slice(0, 160),
        url: `https://i-vantage.in/professionals/${decodedSlug}`,
        siteName: "i-VANTAGE Business Hub",
        locale: "en_IN",
        type: "profile",
        images: p.photoUrl ? [{ url: p.photoUrl, alt: p.fullName }] : [],
      },
    };
  } catch {
    return {
      title: "Verified Professional Profile | i-VANTAGE",
      description: "Consult verified chartered accountants, tax practitioners, and corporate lawyers.",
    };
  }
}

export default async function ProfessionalProfilePage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim();

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

  // Schema.org Person & ProfessionalService JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.fullName,
    jobTitle: p.headline,
    description: p.summary,
    image: p.photoUrl || undefined,
    telephone: p.contactPhone || undefined,
    url: `https://i-vantage.in/professionals/${p.slug}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: p.city,
      addressRegion: p.state,
      addressCountry: "IN",
    },
    knowsAbout: p.specializations || [],
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
