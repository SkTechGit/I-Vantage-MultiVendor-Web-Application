"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Blog, BlogCategory } from "@/modules/blog/blog.types";
import { getAdminBlogById, getBlogCategories } from "@/modules/blog/blog.api";
import BlogEditor from "./BlogEditor";
import { toast } from "sonner";

export default function EditBlogContainer() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      if (!id) return;
      try {
        const [blogData, cats] = await Promise.all([
          getAdminBlogById(id),
          getBlogCategories(),
        ]);

        if (!ignore) {
          setBlog(blogData);
          setCategories(cats);
        }
      } catch (err) {
        console.error("Failed to load blog for edit:", err);
        toast.error("Failed to load blog");
        router.push("/admin/blogs");
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
  }, [id, router]);

  if (loading || !blog) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E5BFF]" />
        <p className="text-sm font-medium text-slate-500">Loading article editor...</p>
      </div>
    );
  }

  return <BlogEditor initialBlog={blog} categories={categories} />;
}
