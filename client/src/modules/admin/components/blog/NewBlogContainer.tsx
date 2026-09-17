"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { BlogCategory } from "@/modules/blog/blog.types";
import { getBlogCategories } from "@/modules/blog/blog.api";
import BlogEditor from "./BlogEditor";

export default function NewBlogContainer() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const cats = await getBlogCategories();
        if (!ignore) {
          setCategories(cats);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E5BFF]" />
        <p className="text-sm font-medium text-slate-500">Preparing editor...</p>
      </div>
    );
  }

  return <BlogEditor categories={categories} />;
}
