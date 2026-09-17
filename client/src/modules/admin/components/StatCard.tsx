"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface Props {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: ReactNode;
  href?: string;
  badge?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  href,
  badge,
}: Props) {
  const content = (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs transition-all duration-150 hover:border-slate-300 hover:shadow-xs hover:-translate-y-[1px]">
      {/* Top row: Label + Refined Icon Container */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs sm:text-sm font-semibold tracking-wide text-slate-500 uppercase">
          {title}
        </span>

        <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] transition-colors group-hover:bg-blue-100/80">
          {icon}
        </div>
      </div>

      {/* Middle row: Big clear metric number */}
      <div className="mt-3 sm:mt-4">
        <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1F5E]">
          {value}
        </h3>
      </div>

      {/* Bottom row: Supporting context + optional link indicator */}
      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
        <span className="truncate">{subtitle || `Total active ${title.toLowerCase()}`}</span>

        {href ? (
          <span className="flex items-center gap-0.5 text-[11px] font-medium text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity">
            <span>View</span>
            <ArrowUpRight size={13} />
          </span>
        ) : badge ? (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
            {badge}
          </span>
        ) : null}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="block focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 rounded-2xl">{content}</Link>;
  }

  return content;
}