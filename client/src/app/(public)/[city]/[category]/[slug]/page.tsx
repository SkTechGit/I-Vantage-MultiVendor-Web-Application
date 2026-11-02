import React from "react";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import ListingDetailView from "@/components/marketplace/ListingDetailView";

interface Props {
  params: Promise<{
    city: string;
    category: string;
    slug: string;
  }>;
}

const getApiUrl = () =>
  (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api/v1").replace(
    "//localhost",
    "//127.0.0.1"
  );

async function fetchListing(slug: string) {
  const apiUrl = getApiUrl();
  try {
    const res = await fetch(`${apiUrl}/listings/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (err) {
    console.error("Error fetching listing from backend API:", err);
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, category, slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim().toLowerCase();
  const listing = await fetchListing(decodedSlug);

  const isPubliclyVisible = listing && (listing.isLive !== false || listing.status === "approved");
  if (!isPubliclyVisible) {
    return {
      title: "Workspace Not Found | i-VANTAGE Hub",
    };
  }

  const canonicalCity = (listing.location?.city || decodeURIComponent(city)).toLowerCase();
  const canonicalCategory = (listing.categoryId?.slug || listing.category?.slug || decodeURIComponent(category)).toLowerCase();
  const canonicalSlug = listing.slug || decodedSlug;
  const canonicalUrl = `https://i-vantage.in/${canonicalCity}/${canonicalCategory}/${canonicalSlug}`;

  const cleanTitle = `${listing.title} | i-VANTAGE Business Hub`;
  const cleanDescription =
    listing.description?.substring(0, 160).replace(/\n+/g, " ") ||
    "Explore luxury coworking spaces, dedicated desks, and executive suites in Gurugram with i-VANTAGE.";

  return {
    title: cleanTitle,
    description: cleanDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: cleanTitle,
      description: cleanDescription,
      url: canonicalUrl,
      type: "website",
      images: listing.media?.[0]?.url ? [{ url: listing.media[0].url }] : [],
    },
  };
}

export default async function ListingDetailPage({ params }: Props) {
  const { city, category, slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim().toLowerCase();
  const listing = await fetchListing(decodedSlug);

  const isPubliclyVisible = listing && (listing.isLive !== false || listing.status === "approved");
  if (!isPubliclyVisible) {
    notFound();
  }

  const targetCity = (listing.location?.city || decodeURIComponent(city)).toLowerCase();
  const targetCategory = (listing.categoryId?.slug || listing.category?.slug || decodeURIComponent(category)).toLowerCase();

  // SEO Preservation: If accessed via legacy/old slug or non-canonical path, 301 redirect permanently
  if (
    (listing.slug && decodedSlug !== listing.slug) ||
    decodeURIComponent(city).toLowerCase() !== targetCity ||
    decodeURIComponent(category).toLowerCase() !== targetCategory
  ) {
    permanentRedirect(`/${targetCity}/${targetCategory}/${listing.slug}`);
  }

  return (
    <ListingDetailView
      listing={listing}
      city={targetCity}
      category={targetCategory}
    />
  );
}
