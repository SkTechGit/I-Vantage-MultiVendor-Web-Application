import React from "react";
import { notFound } from "next/navigation";
import ListingDetailView from "@/components/marketplace/ListingDetailView";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function SpaceDetailPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api/v1").replace("//localhost", "//127.0.0.1");
  let listing: any = null;

  try {
    const res = await fetch(`${apiUrl}/listings/${encodeURIComponent(decodedSlug)}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      listing = json.data;
    }
  } catch (err: any) {
    console.error("Error fetching space by slug from backend API:", err?.message || err);
  }

  if (!listing || !listing.isLive) {
    notFound();
  }

  return (
    <ListingDetailView
      listing={listing}
      city={listing.location?.city}
      category={listing.categoryId?.slug}
    />
  );
}
