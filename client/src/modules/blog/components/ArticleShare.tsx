"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy, MessageCircle } from "lucide-react";
import { FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

interface Props {
  title: string;
  slug: string;
}

export default function ArticleShare({ title, slug }: Props) {
  const [copied, setCopied] = useState(false);

  const getArticleUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return `https://i-vantage.in/blogs/${slug}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getArticleUrl());
      setCopied(true);
      toast.success("Article link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${title} - Read more on i-VANTAGE: ${getArticleUrl()}`
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      getArticleUrl()
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      getArticleUrl()
    )}&text=${encodeURIComponent(title)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:p-5">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
        Share this Insight
      </span>

      <div className="flex items-center gap-2">
        {/* WhatsApp */}
        <button
          type="button"
          onClick={shareWhatsApp}
          aria-label="Share on WhatsApp"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-2xs transition hover:bg-emerald-50 hover:text-emerald-700"
        >
          <MessageCircle size={17} />
        </button>

        {/* LinkedIn */}
        <button
          type="button"
          onClick={shareLinkedIn}
          aria-label="Share on LinkedIn"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#0A66C2] shadow-2xs transition hover:bg-blue-50"
        >
          <FaLinkedinIn size={15} />
        </button>

        {/* X */}
        <button
          type="button"
          onClick={shareTwitter}
          aria-label="Share on X"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-900 shadow-2xs transition hover:bg-slate-100"
        >
          <FaXTwitter size={15} />
        </button>

        {/* Copy Link */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 rounded-xl bg-[#0A1F66] px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-[#1E5BFF]"
        >
          {copied ? <Check size={14} className="text-[#C8942C]" /> : <Copy size={14} />}
          <span>{copied ? "Copied!" : "Copy Link"}</span>
        </button>
      </div>
    </div>
  );
}
