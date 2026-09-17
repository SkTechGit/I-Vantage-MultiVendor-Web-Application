"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Eye,
  Send,
  UploadCloud,
  X,
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  ImageIcon,
  CheckCircle2,
  Loader2,
  Clock,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";
import {
  Blog,
  BlogCategory,
  CreateBlogPayload,
} from "@/modules/blog/blog.types";
import {
  createBlog,
  updateBlog,
  uploadBlogMedia,
  createBlogCategory,
} from "@/modules/blog/blog.api";

interface Props {
  initialBlog?: Blog;
  categories: BlogCategory[];
}

export default function BlogEditor({ initialBlog, categories: initialCategories }: Props) {
  const [categories, setCategories] = useState<BlogCategory[]>(initialCategories);

  // Form State
  const [title, setTitle] = useState(initialBlog?.title || "");
  const [slug, setSlug] = useState(initialBlog?.slug || "");
  const [isCustomSlug, setIsCustomSlug] = useState(Boolean(initialBlog?.slug));
  const [excerpt, setExcerpt] = useState(initialBlog?.excerpt || "");
  const [categoryId, setCategoryId] = useState(
    initialBlog?.category?._id || categories[0]?._id || ""
  );
  const [tags, setTags] = useState<string[]>(initialBlog?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [status, setStatus] = useState(initialBlog?.status || "draft");
  const [featured, setFeatured] = useState(initialBlog?.featured || false);
  const [scheduledAt, setScheduledAt] = useState(
    initialBlog?.scheduledAt
      ? new Date(initialBlog.scheduledAt).toISOString().slice(0, 16)
      : ""
  );

  // Cover Image
  const [coverUrl, setCoverUrl] = useState(initialBlog?.coverImage?.url || "");
  const [coverPublicId, setCoverPublicId] = useState(initialBlog?.coverImage?.publicId || "");
  const [coverAlt, setCoverAlt] = useState(initialBlog?.coverImage?.alt || "");
  const [coverCaption, setCoverCaption] = useState(initialBlog?.coverImage?.caption || "");

  // SEO Fields
  const [seoTitle, setSeoTitle] = useState(initialBlog?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initialBlog?.seoDescription || "");
  const [canonicalUrl, setCanonicalUrl] = useState(initialBlog?.canonicalUrl || "");

  // Upload and Save States
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [newCatName, setNewCatName] = useState("");
  const [isCreatingCat, setIsCreatingCat] = useState(false);
  const [blogId, setBlogId] = useState<string | null>(initialBlog?._id || null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorImageInputRef = useRef<HTMLInputElement>(null);

  // Initialize Tiptap Editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
        link: false,
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#1E5BFF] underline underline-offset-4",
        },
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: "rounded-2xl max-w-full my-6 shadow-md",
        },
      }),
      Placeholder.configure({
        placeholder: "Write your authoritative business insights, data points, guides, and analysis here...",
      }),
    ],
    content: initialBlog?.content || "<p></p>",
    immediatelyRender: false,
    onUpdate: () => {
      setSaveStatus("unsaved");
    },
  });

  // Calculate reading time estimate
  const getWordCount = () => {
    if (!editor) return 0;
    const text = editor.getText();
    return text.trim().split(/\s+/).filter(Boolean).length;
  };
  const readingTime = Math.max(1, Math.ceil(getWordCount() / 200));

  // Auto-slug generator from title if custom slug is not locked
  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSaveStatus("unsaved");
    if (!isCustomSlug && !initialBlog) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-")
      );
    }
  };

  // Add Tag
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const clean = tagInput.trim().toLowerCase().replace(/,/g, "");
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
        setTagInput("");
        setSaveStatus("unsaved");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
    setSaveStatus("unsaved");
  };

  // Upload Cover Image directly to Cloudinary
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPEG, PNG, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size cannot exceed 5MB");
      return;
    }

    setIsUploadingImage(true);
    try {
      const media = await uploadBlogMedia(file);
      setCoverUrl(media.url);
      setCoverPublicId(media.publicId);
      setSaveStatus("unsaved");
      toast.success("Cover image uploaded to Cloudinary!");
    } catch {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Upload inline image for rich text editor
  const handleEditorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    try {
      const media = await uploadBlogMedia(file);
      editor.chain().focus().setImage({ src: media.url }).run();
      toast.success("Image inserted into article!");
    } catch {
      toast.error("Failed to insert image");
    }
  };

  // Quick inline category creation
  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      const cat = await createBlogCategory({ name: newCatName.trim() });
      setCategories((prev) => [...prev, cat]);
      setCategoryId(cat._id);
      setNewCatName("");
      setIsCreatingCat(false);
      toast.success(`Category "${cat.name}" created!`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create category";
      toast.error(message);
    }
  };

  // Build Payload
  const getPayload = useCallback((targetStatus: "draft" | "published" | "scheduled" | "archived"): CreateBlogPayload => {
    return {
      title: title.trim(),
      slug: slug.trim() || undefined,
      excerpt: excerpt.trim(),
      content: editor ? editor.getHTML() : "",
      coverImage: {
        url: coverUrl,
        publicId: coverPublicId,
        alt: coverAlt.trim() || title.trim(),
        caption: coverCaption.trim(),
      },
      status: targetStatus,
      featured,
      category: categoryId,
      tags,
      scheduledAt: targetStatus === "scheduled" && scheduledAt ? scheduledAt : null,
      seoTitle: seoTitle.trim(),
      seoDescription: seoDescription.trim(),
      canonicalUrl: canonicalUrl.trim(),
    };
  }, [
    title,
    slug,
    excerpt,
    editor,
    coverUrl,
    coverPublicId,
    coverAlt,
    coverCaption,
    featured,
    categoryId,
    tags,
    scheduledAt,
    seoTitle,
    seoDescription,
    canonicalUrl,
  ]);

  // Main Save Function
  const handleSave = async (targetStatus: "draft" | "published" | "scheduled" | "archived" = status) => {
    if (!title.trim()) {
      toast.error("Please enter a blog title");
      return;
    }

    if (targetStatus === "published") {
      if (!coverUrl) {
        toast.error("A cover image is required to publish an article");
        return;
      }
      if (!excerpt.trim()) {
        toast.error("Please provide an excerpt before publishing");
        return;
      }
      if (!editor || editor.getText().trim().length < 50) {
        toast.error("Article content is too short to publish");
        return;
      }
    }

    setIsSaving(true);
    setSaveStatus("saving");

    try {
      const payload = getPayload(targetStatus);

      if (blogId) {
        const updated = await updateBlog(blogId, payload);
        setStatus(updated.status);
        setSlug(updated.slug);
        setSaveStatus("saved");
        toast.success(
          targetStatus === "published"
            ? "Article published to i-VANTAGE!"
            : "Draft saved successfully."
        );
      } else {
        const created = await createBlog(payload);
        setBlogId(created._id);
        setStatus(created.status);
        setSlug(created.slug);
        setSaveStatus("saved");
        toast.success("Blog article created successfully!");
        // Update URL to edit mode without full reload
        window.history.replaceState(null, "", `/admin/blogs/${created._id}/edit`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save blog";
      toast.error(message);
      setSaveStatus("unsaved");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveRef = useRef(handleSave);
  useEffect(() => {
    handleSaveRef.current = handleSave;
  });

  // Debounced Autosave (Every 2.5s if unsaved changes exist)
  useEffect(() => {
    if (saveStatus !== "unsaved" || !title.trim() || !blogId) return;

    const timer = setTimeout(() => {
      handleSaveRef.current("draft");
    }, 2500);

    return () => clearTimeout(timer);
  }, [saveStatus, title, blogId]);

  return (
    <div className="space-y-6 pb-20">
      {/* Top Sticky Bar */}
      <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white/95 px-5 py-3.5 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            title="Back to Blog Articles"
          >
            <ArrowLeft size={16} />
          </Link>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {blogId ? "Edit Article" : "New Article"}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0A1F66] text-sm sm:text-base line-clamp-1 max-w-xs sm:max-w-md">
                {title || "Untitled Insight"}
              </span>

              {/* Real Save Status Badge */}
              <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                {saveStatus === "saving" && (
                  <>
                    <Loader2 size={11} className="animate-spin text-[#1E5BFF]" />
                    <span>Saving...</span>
                  </>
                )}
                {saveStatus === "saved" && (
                  <>
                    <CheckCircle2 size={11} className="text-emerald-500" />
                    <span>Saved</span>
                  </>
                )}
                {saveStatus === "unsaved" && (
                  <span className="text-amber-600">• Unsaved changes</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {blogId && (
            <Link
              href={`/admin/blogs/${blogId}/preview`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
            >
              <Eye size={14} />
              <span>Preview</span>
            </Link>
          )}

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSave("draft")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-[#0A1F66] transition hover:bg-blue-100"
          >
            <Save size={14} />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSave("published")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E5BFF] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1546CC]"
          >
            {isSaving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
            <span>{status === "published" ? "Update Live" : "Publish"}</span>
          </button>
        </div>
      </div>

      {/* Main Form Grid: 8 Cols Left (Content), 4 Cols Right (Publishing & SEO) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Content Editor */}
        <div className="space-y-6 lg:col-span-8">
          {/* Title & Slug Box */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Article Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. How a Virtual Office in Gurgaon Streamlines GST & Company Setup"
                className="mt-2 w-full text-2xl font-bold tracking-tight text-[#0A1F66] placeholder-slate-300 focus:outline-none sm:text-3xl"
              />
            </div>

            {/* Slug Editor */}
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-400">URL Slug:</span>
              <span className="text-slate-400">/blogs/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  setIsCustomSlug(true);
                  setSaveStatus("unsaved");
                }}
                className="flex-1 bg-transparent font-medium text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Excerpt Box */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Summary Excerpt * (for Cards & Social Meta)
              </label>
              <span className="text-[11px] text-slate-400">
                {excerpt.length}/500 chars
              </span>
            </div>
            <textarea
              rows={3}
              value={excerpt}
              onChange={(e) => {
                setExcerpt(e.target.value);
                setSaveStatus("unsaved");
              }}
              placeholder="A compelling 2-3 sentence overview of this insight that will appear on cards and search results..."
              className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-700 placeholder-slate-300 focus:border-[#1E5BFF] focus:outline-none"
            />
          </div>

          {/* Tiptap Rich Text Editor */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
            {/* Toolbar */}
            {editor && (
              <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50/80 p-2.5">
                {/* Structure */}
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={clsx(
                    "rounded-lg p-1.5 text-xs font-bold transition",
                    editor.isActive("heading", { level: 2 })
                      ? "bg-[#0A1F66] text-white"
                      : "text-slate-600 hover:bg-slate-200"
                  )}
                  title="Heading 2"
                >
                  <Heading2 size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={clsx(
                    "rounded-lg p-1.5 text-xs font-bold transition",
                    editor.isActive("heading", { level: 3 })
                      ? "bg-[#0A1F66] text-white"
                      : "text-slate-600 hover:bg-slate-200"
                  )}
                  title="Heading 3"
                >
                  <Heading3 size={16} />
                </button>

                <span className="h-4 w-px bg-slate-200 mx-1" />

                {/* Inline Formats */}
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={clsx(
                    "rounded-lg p-1.5 transition",
                    editor.isActive("bold")
                      ? "bg-[#0A1F66] text-white"
                      : "text-slate-600 hover:bg-slate-200"
                  )}
                  title="Bold"
                >
                  <Bold size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={clsx(
                    "rounded-lg p-1.5 transition",
                    editor.isActive("italic")
                      ? "bg-[#0A1F66] text-white"
                      : "text-slate-600 hover:bg-slate-200"
                  )}
                  title="Italic"
                >
                  <Italic size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={clsx(
                    "rounded-lg p-1.5 transition",
                    editor.isActive("strike")
                      ? "bg-[#0A1F66] text-white"
                      : "text-slate-600 hover:bg-slate-200"
                  )}
                  title="Strikethrough"
                >
                  <Strikethrough size={16} />
                </button>

                <span className="h-4 w-px bg-slate-200 mx-1" />

                {/* Lists */}
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={clsx(
                    "rounded-lg p-1.5 transition",
                    editor.isActive("bulletList")
                      ? "bg-[#0A1F66] text-white"
                      : "text-slate-600 hover:bg-slate-200"
                  )}
                  title="Bullet List"
                >
                  <List size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={clsx(
                    "rounded-lg p-1.5 transition",
                    editor.isActive("orderedList")
                      ? "bg-[#0A1F66] text-white"
                      : "text-slate-600 hover:bg-slate-200"
                  )}
                  title="Numbered List"
                >
                  <ListOrdered size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  className={clsx(
                    "rounded-lg p-1.5 transition",
                    editor.isActive("blockquote")
                      ? "bg-[#0A1F66] text-white"
                      : "text-slate-600 hover:bg-slate-200"
                  )}
                  title="Quote Callout"
                >
                  <Quote size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().setHorizontalRule().run()}
                  className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-200"
                  title="Divider Line"
                >
                  <Minus size={16} />
                </button>

                <span className="h-4 w-px bg-slate-200 mx-1" />

                {/* Media & Link */}
                <button
                  type="button"
                  onClick={() => {
                    const prev = editor.getAttributes("link").href;
                    const url = window.prompt("Enter link URL:", prev);
                    if (url === null) return;
                    if (url === "") {
                      editor.chain().focus().extendMarkRange("link").unsetLink().run();
                    } else {
                      editor
                        .chain()
                        .focus()
                        .extendMarkRange("link")
                        .setLink({ href: url })
                        .run();
                    }
                  }}
                  className={clsx(
                    "rounded-lg p-1.5 transition",
                    editor.isActive("link")
                      ? "bg-[#0A1F66] text-white"
                      : "text-slate-600 hover:bg-slate-200"
                  )}
                  title="Insert Link"
                >
                  <LinkIcon size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => editorImageInputRef.current?.click()}
                  className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-200"
                  title="Upload Image"
                >
                  <ImageIcon size={16} />
                </button>
                <input
                  type="file"
                  ref={editorImageInputRef}
                  onChange={handleEditorImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                {/* Right Stat */}
                <div className="ml-auto flex items-center gap-2 text-xs text-slate-400">
                  <span>{getWordCount()} words</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[#C8942C]">
                    <Clock size={12} />
                    {readingTime} min read
                  </span>
                </div>
              </div>
            )}

            {/* Editor Text Area */}
            <div className="p-6 min-h-[420px] text-[17px] leading-[1.8] text-slate-700">
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

        {/* Right Column: Settings, Cover, SEO */}
        <div className="space-y-6 lg:col-span-4">
          {/* Publishing Settings */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1F66]">
              Publishing Options
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-500">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as Blog["status"]);
                  setSaveStatus("unsaved");
                }}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 focus:border-[#1E5BFF] focus:outline-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Published (Live)</option>
                <option value="scheduled">Scheduled for Later</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {status === "scheduled" && (
              <div>
                <label className="block text-xs font-medium text-slate-500">
                  Scheduled Publication Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => {
                    setScheduledAt(e.target.value);
                    setSaveStatus("unsaved");
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-700 focus:border-[#1E5BFF] focus:outline-none"
                />
              </div>
            )}

            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <div>
                <p className="text-xs font-semibold text-slate-800">Featured Article</p>
                <p className="text-[11px] text-slate-400">Showcase at top of blog portal</p>
              </div>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => {
                  setFeatured(e.target.checked);
                  setSaveStatus("unsaved");
                }}
                className="h-4 w-4 rounded-md text-[#1E5BFF] focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Category & Tags */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1F66]">
                Category & Tags
              </h3>
              <button
                type="button"
                onClick={() => setIsCreatingCat(!isCreatingCat)}
                className="text-[11px] font-semibold text-[#1E5BFF] hover:underline"
              >
                + New Category
              </button>
            </div>

            {/* Quick Category Add */}
            {isCreatingCat && (
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Category name..."
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs"
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  className="rounded-lg bg-[#0A1F66] px-2.5 py-1 text-xs font-semibold text-white"
                >
                  Add
                </button>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-500">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setSaveStatus("unsaved");
                }}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 focus:border-[#1E5BFF] focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags Chips */}
            <div>
              <label className="block text-xs font-medium text-slate-500">
                Tags (Press Enter or comma)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="e.g. gst, virtual-office, gurgaon"
                className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-700 focus:border-[#1E5BFF] focus:outline-none"
              />

              {tags.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cover Image Upload (Cloudinary) */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1F66]">
              Cover Image *
            </h3>

            {coverUrl ? (
              <div className="space-y-3">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={coverUrl}
                    alt={coverAlt || "Cover image preview"}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverUrl("");
                      setCoverPublicId("");
                      setSaveStatus("unsaved");
                    }}
                    className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
                    title="Remove Cover Image"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-500">
                    Image Alt Text (for SEO & Accessibility)
                  </label>
                  <input
                    type="text"
                    value={coverAlt}
                    onChange={(e) => {
                      setCoverAlt(e.target.value);
                      setSaveStatus("unsaved");
                    }}
                    placeholder="Descriptive alt text for Google..."
                    className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-[#1E5BFF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-500">
                    Cover Caption (Optional)
                  </label>
                  <input
                    type="text"
                    value={coverCaption}
                    onChange={(e) => {
                      setCoverCaption(e.target.value);
                      setSaveStatus("unsaved");
                    }}
                    placeholder="Photo credits or short caption..."
                    className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-[#1E5BFF] focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  disabled={isUploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-6 text-center transition hover:border-blue-400 hover:bg-blue-50/30"
                >
                  {isUploadingImage ? (
                    <Loader2 size={24} className="animate-spin text-[#1E5BFF]" />
                  ) : (
                    <UploadCloud size={24} className="text-slate-400" />
                  )}
                  <p className="mt-2 text-xs font-semibold text-slate-700">
                    {isUploadingImage ? "Uploading to Cloudinary..." : "Click to upload cover image"}
                  </p>
                  <p className="text-[11px] text-slate-400">JPEG, PNG, WebP up to 5MB</p>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleCoverUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* SEO & Social Snippet Preview */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0A1F66]">
              <Sparkles size={14} className="text-[#C8942C]" />
              <span>SEO & Social Preview</span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>SEO Meta Title</span>
                <span className={seoTitle.length > 60 ? "text-amber-600 font-bold" : ""}>
                  {seoTitle.length}/60
                </span>
              </div>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => {
                  setSeoTitle(e.target.value);
                  setSaveStatus("unsaved");
                }}
                placeholder={title || "SEO optimized title..."}
                className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-[#1E5BFF] focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Meta Description</span>
                <span className={seoDescription.length > 160 ? "text-amber-600 font-bold" : ""}>
                  {seoDescription.length}/160
                </span>
              </div>
              <textarea
                rows={2}
                value={seoDescription}
                onChange={(e) => {
                  setSeoDescription(e.target.value);
                  setSaveStatus("unsaved");
                }}
                placeholder={excerpt || "Search engine description snippet..."}
                className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-[#1E5BFF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500">
                Canonical URL (Optional override)
              </label>
              <input
                type="url"
                value={canonicalUrl}
                onChange={(e) => {
                  setCanonicalUrl(e.target.value);
                  setSaveStatus("unsaved");
                }}
                placeholder={`https://i-vantage.in/blogs/${slug || "slug"}`}
                className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-[#1E5BFF] focus:outline-none"
              />
            </div>

            {/* Google Search Snippet Simulation */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs space-y-1">
              <p className="text-[11px] text-slate-500 truncate">
                https://i-vantage.in › blogs › {slug || "your-slug"}
              </p>
              <p className="text-[#1A0DAB] font-medium line-clamp-1">
                {seoTitle || title || "Article Headline - i-VANTAGE Insights"}
              </p>
              <p className="text-slate-600 text-[11px] line-clamp-2">
                {seoDescription || excerpt || "Insights on virtual office setup and corporate growth in India."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
