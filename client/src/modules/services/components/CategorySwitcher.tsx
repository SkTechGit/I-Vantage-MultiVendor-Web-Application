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
    <div className="sticky top-17 z-30 border-y border-slate-200/80 bg-white/95 py-3.5 backdrop-blur-md shadow-xs">
      <Container>
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="hidden text-xs font-bold uppercase tracking-wider text-slate-400 sm:block">
            Jump to Category:
          </p>

          {/* Segmented Control Buttons */}
          <div className="flex w-full max-w-md items-center justify-center rounded-xl bg-slate-100 p-1 sm:w-auto">
            <button
              type="button"
              onClick={() => handleScroll("workspace-solutions", "workspace")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all sm:flex-initial sm:text-sm ${
                activeTab === "workspace"
                  ? "bg-[#0A1F66] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#0A1F66]"
              }`}
            >
              <Building2 size={16} />
              <span>Workspace Solutions (7)</span>
            </button>

            <button
              type="button"
              onClick={() => handleScroll("business-support", "business")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all sm:flex-initial sm:text-sm ${
                activeTab === "business"
                  ? "bg-[#0A1F66] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#0A1F66]"
              }`}
            >
              <Briefcase size={16} />
              <span>Business Support (8)</span>
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
