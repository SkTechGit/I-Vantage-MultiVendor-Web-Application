import React from "react";
import { notFound } from "next/navigation";
import ListingDetailView from "@/components/marketplace/ListingDetailView";

interface Props {
  params: Promise<{
    city: string;
    category: string;
    slug: string;
  }>;
}

export default async function ListingDetailPage({ params }: Props) {
  const { city, category, slug } = await params;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  let listing: any = null;

  try {
    const res = await fetch(`${apiUrl}/listings/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      listing = json.data;
    }
  } catch (err) {
    console.error("Error fetching listing from backend API:", err);
  }

  if (!listing || !listing.isLive) {
    notFound();
  }

  return (
    <ListingDetailView
      listing={listing}
      city={decodeURIComponent(city)}
      category={decodeURIComponent(category)}
    />
  );
}
