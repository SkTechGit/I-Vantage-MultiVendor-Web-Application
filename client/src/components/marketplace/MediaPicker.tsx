"use client";

import React, { useState, useEffect, useRef } from "react";
import { marketplaceApi } from "@/lib/marketplace.api";
import { Upload, Image as ImageIcon, Check, X, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";

interface MediaAsset {
  _id: string;
  cloudinaryPublicId: string;
  secureUrl: string;
  width?: number;
  height?: number;
  format?: string;
  createdAt: string;
}

interface SelectedMedia {
  mediaId: string;
  secureUrl: string;
  order: number;
}

interface MediaPickerProps {
  selectedMedia: SelectedMedia[];
  onChange: (media: SelectedMedia[]) => void;
  maxFiles?: number;
}

export default function MediaPicker({
  selectedMedia,
  onChange,
  maxFiles = 10,
}: MediaPickerProps) {
  const [activeTab, setActiveTab] = useState<"gallery" | "upload">("upload");
  const [gallery, setGallery] = useState<MediaAsset[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadGallery = async () => {
    setLoadingGallery(true);
    try {
      const items = await marketplaceApi.getMediaGallery(true);
      setGallery(items || []);
    } catch (err: any) {
      console.error("Failed to load media gallery:", err);
    } finally {
      setLoadingGallery(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 1. Get signed signature from server
        const signData = await marketplaceApi.getSignSignature();

        // 2. Direct upload to Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", signData.apiKey);
        formData.append("timestamp", String(signData.timestamp));
        formData.append("signature", signData.signature);
        formData.append("folder", signData.folder);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error?.message || "Cloudinary upload failed");
        }

        const cloudRes = await res.json();

        // 3. Register in MediaAsset collection
        const registeredAsset = await marketplaceApi.registerMedia({
          cloudinaryPublicId: cloudRes.public_id,
          secureUrl: cloudRes.secure_url,
          width: cloudRes.width,
          height: cloudRes.height,
          format: cloudRes.format,
        });

        // Add to selected list if room
        if (selectedMedia.length < maxFiles) {
          const newItem: SelectedMedia = {
            mediaId: registeredAsset._id,
            secureUrl: registeredAsset.secureUrl,
            order: selectedMedia.length,
          };
          onChange([...selectedMedia, newItem]);
        }
      }

      // Refresh gallery
      await loadGallery();
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const toggleSelectAsset = (asset: MediaAsset) => {
    const exists = selectedMedia.some((m) => m.mediaId === asset._id);
    if (exists) {
      const filtered = selectedMedia
        .filter((m) => m.mediaId !== asset._id)
        .map((m, idx) => ({ ...m, order: idx }));
      onChange(filtered);
    } else {
      if (selectedMedia.length >= maxFiles) {
        alert(`Maximum ${maxFiles} images allowed`);
        return;
      }
      const newItem: SelectedMedia = {
        mediaId: asset._id,
        secureUrl: asset.secureUrl,
        order: selectedMedia.length,
      };
      onChange([...selectedMedia, newItem]);
    }
  };

  const removeSelected = (mediaId: string) => {
    const filtered = selectedMedia
      .filter((m) => m.mediaId !== mediaId)
      .map((m, idx) => ({ ...m, order: idx }));
    onChange(filtered);
  };

  return (
    <div className="space-y-5">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "upload"
              ? "bg-[#0A1F66] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload New Image
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("gallery");
            loadGallery();
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "gallery"
              ? "bg-[#0A1F66] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Your Uploaded Library ({gallery.length})
        </button>
      </div>

      {/* Upload View */}
      {activeTab === "upload" && (
        <div className="border-2 border-dashed border-slate-300 hover:border-[#1E5BFF] transition-colors rounded-2xl p-8 text-center bg-slate-50/50">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="cloudinary-media-upload"
          />
          <label
            htmlFor="cloudinary-media-upload"
            className="cursor-pointer flex flex-col items-center justify-center space-y-3"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-[#1E5BFF] shadow-inner">
              {uploading ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <Upload className="w-8 h-8" />
              )}
            </div>
            <div>
              <p className="text-base font-semibold text-slate-800">
                {uploading
                  ? "Uploading & signing to Cloudinary..."
                  : "Click to upload workspace photos"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                PNG, JPG, WEBP up to 10MB. Images are saved once in your library and reused.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#1E5BFF] text-white hover:bg-blue-700 transition">
              <Sparkles className="w-3.5 h-3.5" /> Select Photos
            </span>
          </label>
          {uploadError && (
            <p className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
              {uploadError}
            </p>
          )}
        </div>
      )}

      {/* Gallery View */}
      {activeTab === "gallery" && (
        <div className="space-y-3">
          {loadingGallery ? (
            <div className="flex items-center justify-center py-12 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading your uploaded photos...
            </div>
          ) : gallery.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm text-slate-500">
                No images uploaded yet. Upload your first workspace image above!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-80 overflow-y-auto p-1">
              {gallery.map((asset) => {
                const isSelected = selectedMedia.some((m) => m.mediaId === asset._id);
                return (
                  <div
                    key={asset._id}
                    onClick={() => toggleSelectAsset(asset)}
                    className={`relative group aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                      isSelected
                        ? "border-[#1E5BFF] ring-2 ring-blue-200 shadow-md"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    <Image
                      src={asset.secureUrl}
                      alt="Uploaded space"
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                    <div
                      className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-[#1E5BFF] text-white shadow"
                          : "bg-black/50 text-white opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : "+"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Selected Photos Preview Tray */}
      {selectedMedia.length > 0 && (
        <div className="pt-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Selected Listing Photos ({selectedMedia.length}/{maxFiles})
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {selectedMedia.map((item, idx) => (
              <div
                key={item.mediaId}
                className="relative flex-shrink-0 w-28 h-20 rounded-xl overflow-hidden border border-slate-300 shadow-sm group"
              >
                <Image
                  src={item.secureUrl}
                  alt={`Listing photo ${idx + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
                <div className="absolute top-1 left-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  #{idx + 1} {idx === 0 ? "Cover" : ""}
                </div>
                <button
                  type="button"
                  onClick={() => removeSelected(item.mediaId)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-600/90 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
