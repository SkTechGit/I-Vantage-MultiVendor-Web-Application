"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useRealtimeEvent } from "@/context/RealtimeContext";

/**
 * Invisible client helper that automatically triggers Next.js App Router
 * Server Component revalidation (`router.refresh()`) when real-time listing events arrive.
 */
export default function MarketplaceLiveRevalidator() {
  const router = useRouter();
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  useRealtimeEvent("listings", () => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(() => {
      router.refresh();
    }, 400);
  });

  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);

  return null;
}
