import React from "react";
import Link from "next/link";
import { Building2, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex p-4 rounded-3xl bg-blue-50 border border-blue-100 shadow-sm text-[#1E5BFF]">
          <Building2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#1E5BFF] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            404 — Page Not Found
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1F66] tracking-tight">
            Workspace or Page Not Found
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            The workspace or page you are looking for might have been moved, renamed, or is currently unavailable.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A1F66] text-white text-xs font-bold hover:bg-blue-900 transition shadow-sm hover:shadow"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/gurugram"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition shadow-2xs"
          >
            <Search className="w-4 h-4 text-[#1E5BFF]" />
            Explore Workspaces
          </Link>
        </div>
      </div>
    </div>
  );
}
