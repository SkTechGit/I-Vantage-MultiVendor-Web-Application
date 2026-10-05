"use client";

import { Building2, Briefcase, ChevronRight } from "lucide-react";
import Container from "@/components/common/Container";

interface CategorySwitcherProps {
  activeTab: "workspace" | "business";
  onTabChange: (tab: "workspace" | "business") => void;
}

export default function CategorySwitcher({
  activeTab,
  onTabChange,
}: CategorySwitcherProps) {
  const handleScroll = (id: string, tab: "workspace" | "business") => {
    onTabChange(tab);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-17 z-30 border-y border-slate-200/80 bg-white/95 py-2 sm:py-3.5 backdrop-blur-md shadow-xs">
      <Container>
        <div className="flex flex-col items-center justify-between gap-2 sm:gap-3 sm:flex-row">
          <p className="hidden text-xs font-bold uppercase tracking-wider text-slate-400 sm:block">
            Jump to Category:
          </p>

          {/* Segmented Control Buttons */}
          <div className="flex w-full max-w-md items-center justify-center rounded-xl bg-slate-100 p-1 sm:w-auto">
            <button
              type="button"
              onClick={() => handleScroll("business-support", "business")}
              className={`flex flex-1 items-center justify-center gap-1.5 sm:gap-2 rounded-lg px-2.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-sm font-bold transition-all sm:flex-initial ${
                activeTab === "business"
                  ? "bg-[#0A1F66] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#0A1F66]"
              }`}
            >
              <Briefcase size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Business Support Desks</span>
              <span className="sm:hidden">Business Desks</span>
            </button>

            <button
              type="button"
              onClick={() => handleScroll("workspace-solutions", "workspace")}
              className={`flex flex-1 items-center justify-center gap-1.5 sm:gap-2 rounded-lg px-2.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-sm font-bold transition-all sm:flex-initial ${
                activeTab === "workspace"
                  ? "bg-[#0A1F66] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#0A1F66]"
              }`}
            >
              <Building2 size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Workspace Solutions</span>
              <span className="sm:hidden">Workspaces</span>
            </button>
          </div>

          <a
            href="#comparison"
            className="hidden items-center gap-1 text-xs font-bold text-[#1E5BFF] transition hover:gap-1.5 lg:inline-flex"
          >
            <span>Compare Plans</span>
            <ChevronRight size={14} />
          </a>
        </div>
      </Container>
    </div>
  );
}
