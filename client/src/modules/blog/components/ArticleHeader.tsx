import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Clock, Calendar, User } from "lucide-react";
import { Blog } from "../blog.types";

interface Props {
  blog: Blog;
}

export default function ArticleHeader({ blog }: Props) {
  const formattedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <header className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 sm:text-sm">
        <Link href="/" className="hover:text-[#1E5BFF]">
          Home
        </Link>
        <ChevronRight size={14} />
        <Link href="/blogs" className="hover:text-[#1E5BFF]">
          Insights
        </Link>
        {blog.category && (
          <>
            <ChevronRight size={14} />
            <span className="text-slate-700 font-medium">
              {blog.category.name}
            </span>
          </>
        )}
      </nav>

      {/* Category Pill */}
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-[#0A1F66]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C8942C]" />
          {blog.category?.name || "Corporate Advisory"}
        </span>
      </div>

      {/* Main Article Title */}
      <h1 className="text-3xl font-extrabold tracking-tight text-[#0A1F66] sm:text-5xl sm:leading-tight lg:text-5xl">
        {blog.title}
      </h1>

      {/* Excerpt / Lead Paragraph */}
      <p className="text-lg leading-relaxed text-slate-600 sm:text-xl sm:leading-8">
        {blog.excerpt}
      </p>

      {/* Author & Publication Metadata Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-100 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0A1F66] text-white font-bold text-sm shadow-xs">
            {blog.author?.fullName ? (
              blog.author.fullName.charAt(0).toUpperCase()
            ) : (
              <User size={18} />
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-[#0A1F66]">
              {blog.author?.fullName || "i-VANTAGE Editorial Team"}
            </p>
            <p className="text-xs text-slate-500">
              Corporate Intelligence & Workspace Strategy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 sm:text-sm">
          {formattedDate && (
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#C8942C]" />
              {formattedDate}
            </span>
          )}
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-[#1E5BFF]" />
            {blog.readingTimeMinutes} min read
          </span>
        </div>
      </div>

      {/* Large Featured Cover Image */}
      <div className="relative aspect-[21/10] w-full overflow-hidden rounded-3xl bg-slate-100 shadow-md">
        <Image
          src={blog.coverImage.url}
          alt={blog.coverImage.alt || blog.title}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover"
        />
      </div>

      {blog.coverImage.caption && (
        <p className="text-center text-xs italic text-slate-400">
          {blog.coverImage.caption}
        </p>
      )}
    </header>
  );
}
