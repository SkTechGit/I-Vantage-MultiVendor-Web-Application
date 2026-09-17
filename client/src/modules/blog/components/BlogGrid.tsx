"use client";

import { useState, useTransition } from "react";
import { Blog, BlogCategory } from "../blog.types";
import BlogCard from "./BlogCard";
import BlogCategoryFilter from "./BlogCategoryFilter";
import BlogSearch from "./BlogSearch";
import { FileQuestion, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  initialBlogs: Blog[];
  initialTotal: number;
  initialPage: number;
  initialTotalPages: number;
  categories: BlogCategory[];
}

export default function BlogGrid({
  initialBlogs,
  initialTotal,
  initialPage,
  initialTotalPages,
  categories,
}: Props) {
  const [blogs] = useState<Blog[]>(initialBlogs);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  // Client-side filtering over the fetched batch, with full reactivity
  const filteredBlogs = blogs.filter((blog) => {
    // Category match
    if (selectedCategory !== "all") {
      if (blog.category?.slug !== selectedCategory) {
        return false;
      }
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const inTitle = blog.title.toLowerCase().includes(q);
      const inExcerpt = blog.excerpt.toLowerCase().includes(q);
      const inTags = blog.tags?.some((t) => t.toLowerCase().includes(q));
      if (!inTitle && !inExcerpt && !inTags) {
        return false;
      }
    }

    return true;
  });

  const handleCategoryChange = (slug: string) => {
    startTransition(() => {
      setSelectedCategory(slug);
      setCurrentPage(1);
    });
  };

  const handleSearchChange = (query: string) => {
    startTransition(() => {
      setSearchQuery(query);
      setCurrentPage(1);
    });
  };

  return (
    <div className="space-y-8">
      {/* Controls Bar: Search & Category Filter */}
      <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-xs sm:p-6">
        <BlogSearch
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <div className="border-t border-slate-100 pt-4">
          <BlogCategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
            totalAllCount={blogs.length}
          />
        </div>
      </div>

      {/* Grid Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#0A1F66] sm:text-2xl">
            Latest Insights
          </h2>
          <p className="text-xs text-slate-500 sm:text-sm">
            Showing {filteredBlogs.length} of {initialTotal} articles
          </p>
        </div>

        {(selectedCategory !== "all" || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="text-xs font-semibold text-[#1E5BFF] hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Blog Cards Grid */}
      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
          {filteredBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#1E5BFF]">
            <FileQuestion size={28} />
          </div>
          <h3 className="mt-4 text-lg font-bold text-[#0A1F66]">
            No insights found
          </h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            {searchQuery
              ? `No articles matched your search "${searchQuery}". Try another keyword or clear the search.`
              : "No articles found in this category yet. Check back soon for new publications."}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="mt-6 inline-flex items-center rounded-xl bg-[#0A1F66] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1E5BFF]"
          >
            Browse All Insights
          </button>
        </div>
      )}

      {/* Pagination if multiple pages exist */}
      {initialTotalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition disabled:opacity-40 hover:bg-slate-50"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="px-4 text-xs font-semibold text-slate-600">
            Page {currentPage} of {initialTotalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= initialTotalPages}
            onClick={() => setCurrentPage((prev) => Math.min(initialTotalPages, prev + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition disabled:opacity-40 hover:bg-slate-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
