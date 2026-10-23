"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, X, ExternalLink } from "lucide-react";
import type { ProfessionalProfileItem } from "@/lib/professionals.api";

interface Props {
  professional: ProfessionalProfileItem;
}

export default function ProfileVideoSection({ professional }: Props) {
  const p = professional;
  const videos = Array.isArray(p.videos) ? p.videos : [];
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  if (videos.length === 0) return null;

  const getEmbedUrl = (url: string) => {
    try {
      if (url.includes("youtube.com/watch")) {
        const v = new URL(url).searchParams.get("v");
        return v ? `https://www.youtube-nocookie.com/embed/${v}?autoplay=1` : url;
      }
      if (url.includes("youtu.be/")) {
        const id = url.split("youtu.be/")[1]?.split("?")[0];
        return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1` : url;
      }
      return url;
    } catch {
      return url;
    }
  };

  return (
    <section id="videos-section" className="space-y-6 pt-6 border-t border-slate-200">
      <div className="space-y-1">
        <span className="text-[11px] font-black uppercase tracking-wider text-[#1E5BFF]">
          Thought Leadership &amp; Sessions
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-[#0A1F66] tracking-tight">
          Video Insights &amp; Briefings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Watch key analyses, compliance webinars, and regulatory explainers by {p.fullName}.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {videos.map((vid, idx) => (
          <div
            key={vid._id || idx}
            className="group rounded-2xl bg-white border border-[#DCE5F5] overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200"
          >
            {/* Video Thumbnail Facade with Play Button */}
            <div
              onClick={() => setActiveVideoUrl(getEmbedUrl(vid.url))}
              className="relative aspect-video bg-slate-900 cursor-pointer overflow-hidden flex items-center justify-center"
            >
              {vid.thumbnailUrl ? (
                <Image
                  src={vid.thumbnailUrl}
                  alt={vid.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0A1F66] to-[#1E5BFF] opacity-90" />
              )}
              {/* Play Button Icon */}
              <div className="relative z-10 w-12 h-12 rounded-full bg-white/90 text-[#0A1F66] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#1E5BFF] group-hover:text-white transition-all duration-200">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
            </div>

            <div className="p-4 space-y-1">
              <h3 className="text-sm font-black text-[#0A1F66] line-clamp-1 group-hover:text-[#1E5BFF] transition-colors">
                {vid.title}
              </h3>
              {vid.description && (
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {vid.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Player */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveVideoUrl(null)}
              className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <iframe
              src={activeVideoUrl}
              title="Video Player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </section>
  );
}
