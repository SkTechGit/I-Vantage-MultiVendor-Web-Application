import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, Calendar } from "lucide-react";
import { Blog } from "../blog.types";

interface Props {
  blog: Blog;
}

export default function BlogCard({ blog }: Props) {
  const formattedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
      {/* Cover Image Container */}
      <Link
        href={`/blogs/${blog.slug}`}
        className="relative block aspect-[16/10] w-full overflow-hidden bg-slate-100"
      >
        <Image
          src={blog.coverImage.url}
          alt={blog.coverImage.alt || blog.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-103"
        />

        {/* Category Pill on Image */}
        <div className="absolute left-4 top-4 z-10">
          <span className="rounded-lg bg-white/95 px-2.5 py-1 text-xs font-bold text-[#0A1F66] shadow-xs backdrop-blur-xs">
            {blog.category?.name || "Insights"}
          </span>
        </div>
      </Link>

      {/* Content Body */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          {/* Metadata Row */}
          <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-[#C8942C]" />
              {blog.readingTimeMinutes} min read
            </span>
            {formattedDate && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {formattedDate}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="mt-3 text-lg font-bold tracking-tight text-[#0A1F66] transition-colors duration-200 group-hover:text-[#1E5BFF] sm:text-xl">
            <Link href={`/blogs/${blog.slug}`} className="line-clamp-2">
              {blog.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="mt-2.5 text-sm leading-relaxed text-slate-600 line-clamp-3">
            {blog.excerpt}
          </p>
        </div>

        {/* Footer: Author & Read link */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0A1F66]/10 text-xs font-bold text-[#0A1F66]">
              {blog.author?.fullName ? (
                blog.author.fullName.charAt(0).toUpperCase()
              ) : (
                "A"
              )}
            </div>
            <span className="text-xs font-semibold text-slate-700">
              {blog.author?.fullName || "i-VANTAGE"}
            </span>
          </div>

          <Link
            href={`/blogs/${blog.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#1E5BFF] transition-all group-hover:gap-1.5"
          >
            <span>Read</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}
