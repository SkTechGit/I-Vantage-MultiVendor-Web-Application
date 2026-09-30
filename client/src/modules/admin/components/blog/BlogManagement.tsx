"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Blog, BlogCategory, BlogStats } from "@/modules/blog/blog.types";
import {
  getAdminBlogs,
  getBlogDashboardStats,
  getBlogCategories,
} from "@/modules/blog/blog.api";
import { useRealtimeEvent } from "@/context/RealtimeContext";
import BlogTable from "./BlogTable";

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [stats, setStats] = useState<BlogStats>({
    total: 0,
    published: 0,
    drafts: 0,
    scheduled: 0,
    archived: 0,
    totalViews: 0,
    categoriesCount: 0,
  });
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const [blogsRes, statsRes, catsRes] = await Promise.all([
        getAdminBlogs({ page: 1, limit: 100 }),
        getBlogDashboardStats(),
        getBlogCategories(),
      ]);

      setBlogs(blogsRes.blogs || []);
      setStats(statsRes);
      setCategories(catsRes);
    } catch (err) {
      console.error("Failed to load blog admin data:", err);
    } finally {
      if (!silent) setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    Promise.all([
      getAdminBlogs({ page: 1, limit: 100 }),
      getBlogDashboardStats(),
      getBlogCategories(),
    ])
      .then(([blogsRes, statsRes, catsRes]) => {
        if (!ignore) {
          setBlogs(blogsRes.blogs || []);
          setStats(statsRes);
          setCategories(catsRes);
        }
      })
      .catch((err) => {
        if (!ignore) console.error("Failed to load blog admin data:", err);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    // Revalidate when user returns to this browser tab
    const handleFocus = () => {
      loadData(true);
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      ignore = true;
      window.removeEventListener("focus", handleFocus);
    };
  }, [loadData]);

  // Debounced silent refetch for real-time blog synchronization
  const refetchTimerRef = useRef<NodeJS.Timeout | null>(null);
  useRealtimeEvent("blogs", () => {
    if (refetchTimerRef.current) clearTimeout(refetchTimerRef.current);
    refetchTimerRef.current = setTimeout(() => {
      loadData(true);
    }, 300);
  });

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E5BFF]" />
        <p className="text-sm font-medium text-slate-500">
          Loading blog articles and metrics...
        </p>
      </div>
    );
  }

  return (
    <BlogTable
      initialBlogs={blogs}
      initialStats={stats}
      categories={categories}
      onRefresh={() => loadData(false)}
      isRefreshing={refreshing}
    />
  );
}
