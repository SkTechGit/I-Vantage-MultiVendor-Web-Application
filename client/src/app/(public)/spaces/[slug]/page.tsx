import { notFound, permanentRedirect } from "next/navigation";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const getApiUrl = () =>
  (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api/v1").replace(
    "//localhost",
    "//127.0.0.1"
  );

export default async function SpaceDetailPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim().toLowerCase();

  const apiUrl = getApiUrl();
  let listing: any = null;

  try {
    const res = await fetch(`${apiUrl}/listings/${encodeURIComponent(decodedSlug)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      listing = json.data;
    }
  } catch (err: any) {
    console.error("Error fetching space by slug from backend API:", err?.message || err);
  }

  const isPubliclyVisible = listing && (listing.isLive !== false || listing.status === "approved");
  if (!isPubliclyVisible) {
    notFound();
  }

  const targetCity = (listing.location?.city || "gurugram").toLowerCase();
  const targetCategory = (listing.categoryId?.slug || listing.category?.slug || "coworking-seat").toLowerCase();
  const targetSlug = listing.slug || decodedSlug;

  // Always permanent 301 redirect /spaces/[slug] to the clean canonical [city]/[category]/[slug]
  permanentRedirect(`/${targetCity}/${targetCategory}/${targetSlug}`);
}
