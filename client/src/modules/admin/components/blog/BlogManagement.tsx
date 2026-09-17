"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Blog, BlogCategory, BlogStats } from "@/modules/blog/blog.types";
import {
  getAdminBlogs,
  getBlogDashboardStats,
  getBlogCategories,
} from "@/modules/blog/blog.api";
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

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const [blogsRes, statsRes, catsRes] = await Promise.all([
          getAdminBlogs({ page: 1, limit: 100 }),
          getBlogDashboardStats(),
          getBlogCategories(),
        ]);

        if (!ignore) {
          setBlogs(blogsRes.blogs || []);
          setStats(statsRes);
          setCategories(catsRes);
        }
      } catch (err) {
        console.error("Failed to load blog admin data:", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

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
    />
  );
}
