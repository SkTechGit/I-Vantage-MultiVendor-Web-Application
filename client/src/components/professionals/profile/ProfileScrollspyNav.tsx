"use client";

import React, { useState, useEffect } from "react";

interface TabItem {
  id: string;
  label: string;
}

interface Props {
  hasVideos?: boolean;
}

export default function ProfileScrollspyNav({ hasVideos = false }: Props) {
  const tabs: TabItem[] = [
    { id: "overview-section", label: "Overview" },
    { id: "services-section", label: "Services & Fees" },
    { id: "expertise-section", label: "Key Expertise" },
    { id: "process-section", label: "How It Works" },
    ...(hasVideos ? [{ id: "videos-section", label: "Insights & Media" }] : []),
    { id: "credentials-section", label: "Experience & Education" },
    { id: "consultation-section", label: "Book Consultation" },
  ];

  const [activeTab, setActiveTab] = useState<string>("overview-section");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      for (let i = tabs.length - 1; i >= 0; i--) {
        const el = document.getElementById(tabs[i].id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveTab(tabs[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tabs]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveTab(id);
    }
  };

  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 scrollbar-none no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => scrollToSection(tab.id)}
                className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#0A1F66] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
