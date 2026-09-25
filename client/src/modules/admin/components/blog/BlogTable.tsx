"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  Pencil,
  Eye,
  Trash2,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Archive,
  FileText,
  TrendingUp,
  Globe,
  Loader2,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import { Blog, BlogCategory, BlogStats, BlogStatus } from "@/modules/blog/blog.types";
import {
  deleteBlog,
  updateBlogStatus,
  resetBlogViews,
} from "@/modules/blog/blog.api";

interface Props {
  initialBlogs: Blog[];
  initialStats: BlogStats;
  categories: BlogCategory[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function BlogTable({
  initialBlogs,
  initialStats,
  categories,
  onRefresh,
  isRefreshing,
}: Props) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [stats, setStats] = useState<BlogStats>(initialStats);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Synchronize state when revalidated or refreshed
  useEffect(() => {
    setBlogs(initialBlogs);
  }, [initialBlogs]);

  useEffect(() => {
    setStats(initialStats);
  }, [initialStats]);

  // Client filtering
  const filteredBlogs = blogs.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (categoryFilter !== "all" && b.category?._id !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const inTitle = b.title.toLowerCase().includes(q);
      const inSlug = b.slug.toLowerCase().includes(q);
      if (!inTitle && !inSlug) return false;
    }
    return true;
  });

  const handleStatusChange = async (id: string, newStatus: BlogStatus) => {
    const previousBlog = blogs.find((b) => b._id === id);
    if (!previousBlog) return;
    const oldStatus = previousBlog.status;
    if (oldStatus === newStatus) return;

    setActionLoading(id);

    // Optimistic state update
    setBlogs((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
    );
    setStats((prev) => ({
      ...prev,
      published:
        newStatus === "published"
          ? prev.published + 1
          : oldStatus === "published"
          ? prev.published - 1
          : prev.published,
      drafts:
        newStatus === "draft"
          ? prev.drafts + 1
          : oldStatus === "draft"
          ? prev.drafts - 1
          : prev.drafts,
    }));

    try {
      await updateBlogStatus(id, newStatus);
      toast.success(`Article marked as ${newStatus}`);
    } catch (err: unknown) {
      // Revert on failure
      setBlogs((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: oldStatus } : b))
      );
      setStats((prev) => ({
        ...prev,
        published:
          oldStatus === "published"
            ? prev.published + 1
            : newStatus === "published"
            ? prev.published - 1
            : prev.published,
        drafts:
          oldStatus === "draft"
            ? prev.drafts + 1
            : newStatus === "draft"
            ? prev.drafts - 1
            : prev.drafts,
      }));
      const message =
        err instanceof Error ? err.message : "Failed to update status";
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    try {
      await deleteBlog(id, false);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      setStats((prev) => ({ ...prev, total: prev.total - 1 }));
      setDeleteConfirmId(null);
      toast.success("Blog article deleted");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete blog";
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleResetViews = async (id: string, title: string) => {
    if (!confirm(`Reset views count to 0 for "${title}"?`)) return;
    setActionLoading(id);
    try {
      const updated = await resetBlogViews(id);
      setBlogs((prev) =>
        prev.map((b) => (b._id === id ? { ...b, viewsCount: updated.viewsCount } : b))
      );
      toast.success("Views count reset to 0");
      onRefresh?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to reset views";
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: BlogStatus) => {
    switch (status) {
      case "published":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 size={12} />
            Published
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
            <Clock size={12} />
            Draft
          </span>
        );
      case "scheduled":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
            <Globe size={12} />
            Scheduled
          </span>
        );
      case "archived":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            <Archive size={12} />
            Archived
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0A1F66] sm:text-3xl">
            Blog Articles & Content CMS
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, publish, edit, and schedule insights for the i-VANTAGE public portal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onRefresh?.()}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-60"
            title="Refresh views and articles live"
          >
            <RefreshCw
              size={15}
              className={isRefreshing ? "animate-spin text-[#1E5BFF]" : "text-slate-500"}
            />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>

          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1E5BFF] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1546CC]"
          >
            <Plus size={16} />
            <span>Create Blog</span>
          </Link>
        </div>
      </div>

      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <FileText size={14} className="text-[#0A1F66]" />
            <span>Total Blogs</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#0A1F66]">{stats.total}</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-600">
            <CheckCircle2 size={14} />
            <span>Published</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-700">{stats.published}</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-medium text-amber-600">
            <Clock size={14} />
            <span>Drafts</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-700">{stats.drafts}</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-medium text-blue-600">
            <Globe size={14} />
            <span>Scheduled</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-700">{stats.scheduled}</p>
        </div>

        <div className="col-span-2 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs sm:col-span-4 lg:col-span-1">
          <div className="flex items-center gap-2 text-xs font-medium text-[#C8942C]">
            <TrendingUp size={14} />
            <span>Total Views</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#0A1F66]">{stats.totalViews}</p>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or slug..."
            className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:border-[#1E5BFF] focus:outline-none sm:text-sm"
          />
        </div>

        {/* Filter Selects */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-[#1E5BFF] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="scheduled">Scheduled</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-[#1E5BFF] focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop Data Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs md:block">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="p-4">Article</th>
              <th className="p-4">Status</th>
              <th className="p-4">Category</th>
              <th className="p-4">Views</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog) => (
                <tr key={blog._id} className="transition-colors hover:bg-slate-50/60">
                  {/* Article Thumbnail + Title */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        {blog.coverImage?.url ? (
                          <Image
                            src={blog.coverImage.url}
                            alt={blog.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-400">
                            <FileText size={16} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 max-w-xs lg:max-w-md">
                        <Link
                          href={`/admin/blogs/${blog._id}/edit`}
                          className="font-bold text-[#0A1F66] transition hover:text-[#1E5BFF] line-clamp-1"
                        >
                          {blog.title}
                        </Link>
                        <p className="mt-0.5 text-xs text-slate-400 truncate">
                          /{blog.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="p-4 whitespace-nowrap">
                    {getStatusBadge(blog.status)}
                  </td>

                  {/* Category */}
                  <td className="p-4 whitespace-nowrap text-xs font-medium text-slate-700">
                    {blog.category?.name || "Unassigned"}
                  </td>

                  {/* Views */}
                  <td className="p-4 whitespace-nowrap text-xs font-semibold text-slate-700">
                    {blog.viewsCount}
                  </td>

                  {/* Date */}
                  <td className="p-4 whitespace-nowrap text-xs text-slate-500">
                    {blog.publishedAt
                      ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Unpublished"}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Preview Button */}
                      <Link
                        href={`/admin/blogs/${blog._id}/preview`}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        title="Preview Article"
                      >
                        <Eye size={16} />
                      </Link>

                      {/* Edit Button */}
                      <Link
                        href={`/admin/blogs/${blog._id}/edit`}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-[#1E5BFF]"
                        title="Edit Article"
                      >
                        <Pencil size={16} />
                      </Link>

                      {/* Reset Views Button (for testing) */}
                      <button
                        type="button"
                        onClick={() => handleResetViews(blog._id, blog.title)}
                        disabled={actionLoading === blog._id}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600"
                        title="Reset Views (Testing)"
                      >
                        <RotateCcw size={15} />
                      </button>

                      {/* Quick Publish / Unpublish Toggle */}
                      {blog.status === "draft" && (
                        <button
                          type="button"
                          disabled={actionLoading === blog._id}
                          onClick={() => handleStatusChange(blog._id, "published")}
                          className="rounded-lg px-2 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-50"
                        >
                          Publish
                        </button>
                      )}

                      {blog.status === "published" && (
                        <button
                          type="button"
                          disabled={actionLoading === blog._id}
                          onClick={() => handleStatusChange(blog._id, "draft")}
                          className="rounded-lg px-2 py-1 text-xs font-semibold text-amber-600 hover:bg-amber-50"
                        >
                          Unpublish
                        </button>
                      )}

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(blog._id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        title="Delete Article"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-10 text-center text-sm text-slate-500">
                  No blog articles found matching your query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Responsive Cards */}
      <div className="space-y-3 md:hidden">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  {blog.coverImage?.url && (
                    <Image
                      src={blog.coverImage.url}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    {getStatusBadge(blog.status)}
                    <span className="text-[11px] text-slate-400">
                      {blog.viewsCount} views
                    </span>
                  </div>
                  <h4 className="mt-1 font-bold text-[#0A1F66] text-sm line-clamp-2">
                    {blog.title}
                  </h4>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                <span className="font-medium text-slate-500">
                  {blog.category?.name || "Unassigned"}
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/blogs/${blog._id}/preview`}
                    className="rounded-lg bg-slate-100 p-2 text-slate-600"
                  >
                    <Eye size={14} />
                  </Link>
                  <Link
                    href={`/admin/blogs/${blog._id}/edit`}
                    className="rounded-lg bg-blue-50 p-2 text-[#1E5BFF]"
                  >
                    <Pencil size={14} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleResetViews(blog._id, blog.title)}
                    className="rounded-lg bg-amber-50 p-2 text-amber-600"
                    title="Reset Views"
                  >
                    <RotateCcw size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(blog._id)}
                    className="rounded-lg bg-rose-50 p-2 text-rose-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            No blog articles found.
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-2xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[#0A1F66]">
              Delete Blog Article?
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to remove this article? It will be safely archived and removed from the public website.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={Boolean(actionLoading)}
                onClick={() => handleDelete(deleteConfirmId)}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
              >
                {actionLoading && <Loader2 size={14} className="animate-spin" />}
                Delete Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
