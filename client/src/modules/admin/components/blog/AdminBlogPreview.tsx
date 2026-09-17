"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import Container from "@/components/common/Container";
import ArticleHeader from "@/modules/blog/components/ArticleHeader";
import ArticleBody from "@/modules/blog/components/ArticleBody";
import ArticleShare from "@/modules/blog/components/ArticleShare";
import TableOfContents from "@/modules/blog/components/TableOfContents";
import BlogCTA from "@/modules/blog/components/BlogCTA";
import { Blog } from "@/modules/blog/blog.types";
import { getAdminBlogById } from "@/modules/blog/blog.api";

export default function AdminBlogPreview() {
  const params = useParams();
  const id = params?.id as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      if (!id) return;
      try {
        const data = await getAdminBlogById(id);
        if (!ignore) {
          setBlog(data);
        }
      } catch (err) {
        console.error("Failed to load blog preview:", err);
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
  }, [id]);

  if (loading || !blog) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E5BFF]" />
        <p className="text-sm font-medium text-slate-500">Generating live preview...</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Floating Admin Preview Banner */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-amber-300 bg-amber-50/95 px-6 py-2.5 text-xs text-amber-900 backdrop-blur-md">
        <div className="flex items-center gap-2 font-semibold">
          <ShieldCheck size={16} className="text-[#C8942C]" />
          <span>
            Admin Preview Mode • Current Status:{" "}
            <strong className="uppercase">{blog.status}</strong> (Not public unless published)
          </span>
        </div>

        <Link
          href={`/admin/blogs/${blog._id}/edit`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F66] px-3 py-1.5 font-bold text-white shadow-xs hover:bg-[#1E5BFF]"
        >
          <ArrowLeft size={13} />
          <span>Return to Editor</span>
        </Link>
      </div>

      <article className="pb-24 pt-8 sm:pt-12">
        <Container>
          {/* Header Section */}
          <div className="mx-auto max-w-4xl">
            <ArticleHeader blog={blog} />
          </div>

          {/* Main Layout: Editorial Content + Sticky TOC */}
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left/Center Reading Column */}
            <div className="lg:col-span-8">
              <ArticleBody content={blog.content} />

              {/* Tags Section */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Tags:
                  </span>
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Social Share Box */}
              <div className="mt-8">
                <ArticleShare title={blog.title} slug={blog.slug} />
              </div>

              {/* Inline Conversion CTA */}
              <div className="mt-14">
                <BlogCTA />
              </div>
            </div>

            {/* Right Aside: Sticky Table of Contents on Desktop */}
            <div className="hidden lg:col-span-4 lg:block">
              <TableOfContents content={blog.content} />
            </div>
          </div>
        </Container>
      </article>
    </div>
  );
}
