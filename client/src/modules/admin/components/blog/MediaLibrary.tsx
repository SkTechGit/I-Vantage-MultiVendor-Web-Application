"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  UploadCloud,
  Copy,
  Check,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { uploadBlogMedia } from "@/modules/blog/blog.api";

interface MediaItem {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

interface Props {
  initialMedia?: MediaItem[];
}

export default function MediaLibrary({ initialMedia = [] }: Props) {
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) continue;
        const uploaded = await uploadBlogMedia(file);
        setMediaList((prev) => [uploaded, ...prev]);
      }
      toast.success("Image(s) uploaded to Cloudinary!");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      toast.success("Image URL copied to clipboard!");
      setTimeout(() => setCopiedUrl(null), 2500);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0A1F66] sm:text-3xl">
            Media & Asset Library
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Upload and manage high-resolution images stored on Cloudinary for blog covers and article content.
          </p>
        </div>

        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1E5BFF] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1546CC]"
        >
          {isUploading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <UploadCloud size={16} />
          )}
          <span>{isUploading ? "Uploading..." : "Upload New Images"}</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          accept="image/*"
          multiple
          className="hidden"
        />
      </div>

      {/* Grid of Images */}
      {mediaList.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-6">
          {mediaList.map((item, idx) => (
            <div
              key={item.publicId || idx}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xs transition hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
                <Image
                  src={item.url}
                  alt={item.publicId || "Uploaded media"}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-103"
                />

                {/* Overlay actions on hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => copyUrl(item.url)}
                    className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-[#0A1F66] shadow-sm hover:bg-slate-100"
                  >
                    {copiedUrl === item.url ? (
                      <Check size={13} className="text-[#C8942C]" />
                    ) : (
                      <Copy size={13} />
                    )}
                    <span>{copiedUrl === item.url ? "Copied" : "Copy URL"}</span>
                  </button>
                </div>
              </div>

              {/* Info footer */}
              <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-slate-500">
                <span className="truncate max-w-[120px]">
                  {item.format?.toUpperCase() || "IMG"}
                </span>
                {item.width && item.height && (
                  <span>
                    {item.width}×{item.height}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#1E5BFF]">
            <ImageIcon size={32} />
          </div>
          <h3 className="mt-4 text-lg font-bold text-[#0A1F66]">
            No images in library yet
          </h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Upload cover images, infographics, and article photos to your Cloudinary storage.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0A1F66] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1E5BFF]"
          >
            <UploadCloud size={14} />
            <span>Upload Your First Image</span>
          </button>
        </div>
      )}
    </div>
  );
}
