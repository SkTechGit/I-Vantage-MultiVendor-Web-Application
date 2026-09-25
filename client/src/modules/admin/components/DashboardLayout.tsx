"use client";

import { ReactNode, useState, useEffect } from "react";
import clsx from "clsx";
import Header from "./Header";
import Sidebar from "./Sidebar";
import CommandPalette from "./CommandPalette";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased">
      {/* =========================================================
          COMMAND PALETTE MODAL (Ctrl+K)
          ========================================================= */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* =========================================================
          MOBILE DRAWER OVERLAY
          ========================================================= */}
      {mobileDrawerOpen && (
        <div
          aria-hidden="true"
          onClick={() => setMobileDrawerOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs transition-opacity lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* =========================================================
          MOBILE SLIDE-OVER SIDEBAR
          ========================================================= */}
      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-200 ease-in-out lg:hidden",
          mobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar
          onNavigate={() => setMobileDrawerOpen(false)}
          isCollapsed={false}
        />
      </div>

      {/* =========================================================
          DESKTOP FIXED SIDEBAR
          ========================================================= */}
      <div
        className={clsx(
          "hidden lg:block fixed inset-y-0 left-0 z-30 transition-[width] duration-200 ease-in-out",
          isSidebarCollapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />
      </div>

      {/* =========================================================
          MAIN APPLICATION WORKSPACE
          ========================================================= */}
      <div
        className={clsx(
          "flex min-h-screen min-w-0 flex-col transition-[margin] duration-200 ease-in-out",
          isSidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
        )}
      >
        {/* Sticky Command Header */}
        <Header
          onOpenMobileSidebar={() => setMobileDrawerOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}