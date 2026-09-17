import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, Calendar, User } from "lucide-react";
import { Blog } from "../blog.types";

interface Props {
  blog: Blog;
}

export default function FeaturedBlogCard({ blog }: Props) {
  const formattedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Cover Image Container (Desktop 7 cols, Mobile full) */}
        <Link
          href={`/blogs/${blog.slug}`}
          className="relative block h-72 overflow-hidden sm:h-96 lg:col-span-7 lg:h-auto"
        >
          <Image
            src={blog.coverImage.url}
            alt={blog.coverImage.alt || blog.title}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />

          {/* Featured Badge */}
          <div className="absolute left-6 top-6 z-10 flex items-center gap-2 rounded-full bg-[#0A1F66] px-4 py-1.5 text-xs font-semibold text-white shadow-md">
            <span className="h-2 w-2 rounded-full bg-[#C8942C]" />
            Featured Article
          </div>
        </Link>

        {/* Content Container (Desktop 5 cols) */}
        <div className="flex flex-col justify-between p-7 sm:p-10 lg:col-span-5 lg:p-12">
          <div>
            {/* Meta row: Category + Reading time */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
              <span className="rounded-md bg-blue-50 px-2.5 py-1 font-semibold text-[#1E5BFF]">
                {blog.category?.name || "Insights"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-[#C8942C]" />
                {blog.readingTimeMinutes} min read
              </span>
              {formattedDate && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    {formattedDate}
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#0A1F66] transition-colors duration-200 group-hover:text-[#1E5BFF] sm:text-3xl lg:text-3xl">
              <Link href={`/blogs/${blog.slug}`} className="line-clamp-3">
                {blog.title}
              </Link>
            </h2>

            {/* Excerpt */}
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base sm:leading-7 line-clamp-3 lg:line-clamp-4">
              {blog.excerpt}
            </p>
          </div>

          {/* Footer: Author info & CTA button */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0A1F66]/10 text-[#0A1F66] font-semibold text-sm">
                {blog.author?.fullName ? (
                  blog.author.fullName.charAt(0).toUpperCase()
                ) : (
                  <User size={16} />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0A1F66]">
                  {blog.author?.fullName || "i-VANTAGE Editorial"}
                </p>
                <p className="text-xs text-slate-500">Business Advisory</p>
              </div>
            </div>

            <Link
              href={`/blogs/${blog.slug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F66] px-4 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-[#1E5BFF] sm:text-sm"
            >
              <span>Read Insight</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
