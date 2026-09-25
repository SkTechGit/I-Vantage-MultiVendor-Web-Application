"use client";

import { useEffect } from "react";
import { trackBlogView } from "@/modules/blog/blog.api";

interface Props {
  slug: string;
}

export default function BlogViewTracker({ slug }: Props) {
  useEffect(() => {
    if (!slug) return;

    // Verify browser environment
    if (typeof window === "undefined") return;

    // Skip tracking if administrator is previewing from the admin dashboard
    if (
      window.location.pathname.includes("/admin/blogs") ||
      window.location.pathname.includes("/preview")
    ) {
      return;
    }

    const sessionKey = `iv_bv_sess_${slug}`;
    if (sessionStorage.getItem(sessionKey)) {
      // Already tracked in this browser session
      return;
    }

    // Mark in sessionStorage to prevent duplicate counts during active tab usage
    sessionStorage.setItem(sessionKey, "1");

    // Track legitimate client view
    trackBlogView(slug).catch((err) => {
      // Silently ignore tracking failures so reader experience is never blocked
      console.debug("View tracking skipped:", err);
    });
  }, [slug]);

  return null;
}
