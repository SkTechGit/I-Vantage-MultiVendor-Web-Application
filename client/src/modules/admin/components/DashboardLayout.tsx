"use client";

import { ReactNode, useState } from "react";
import { Menu, X } from "lucide-react";

import Header from "./Header";
import Sidebar from "./Sidebar";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: Props) {
  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ========================================
          MOBILE / TABLET OVERLAY
          ======================================== */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeSidebar}
          className="
            fixed
            inset-0
            z-40
            bg-black/40
            lg:hidden
          "
        />
      )}

      {/* ========================================
          SIDEBAR
          ======================================== */}
      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          w-72
          transform
          transition-transform
          duration-300
          ease-in-out
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="relative h-full">
          <Sidebar
            onNavigate={closeSidebar}
          />

          {/* Mobile / Tablet Close Button */}
          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close sidebar"
            className="
              absolute
              right-3
              top-3
              z-10
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              bg-white
              text-slate-700
              shadow-md
              transition
              hover:bg-slate-100
              active:scale-95
              focus:outline-none
              focus:ring-2
              focus:ring-[#1E5BFF]

              lg:hidden
            "
          >
            <X size={20} />
          </button>
        </div>
      </aside>

      {/* ========================================
          MAIN AREA
          ======================================== */}
      <div
        className={`
          flex
          min-h-screen
          min-w-0
          flex-col
          transition-[margin]
          duration-300
          ease-in-out
          ${
            sidebarOpen
              ? "lg:ml-72"
              : "ml-0"
          }
        `}
      >
        {/* Header */}
        <Header />

        {/* ========================================
            SIDEBAR TOGGLE
            ======================================== */}
        <div
          className="
            sticky
            top-16
            z-30
            flex
            items-center
            border-b
            border-slate-200
            bg-white
            px-3
            py-2
            sm:top-20
            sm:px-4
            sm:py-3
          "
        >
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={
              sidebarOpen
                ? "Close sidebar"
                : "Open sidebar"
            }
            aria-expanded={sidebarOpen}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-slate-200
              bg-white
              text-slate-700
              shadow-sm
              transition
              hover:bg-slate-50
              hover:text-[#1E5BFF]
              active:scale-95
              focus:outline-none
              focus:ring-2
              focus:ring-[#1E5BFF]
              sm:h-10
              sm:w-10
            "
          >
            {sidebarOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>

          <span
            className="
              ml-3
              text-xs
              font-semibold
              text-[#0A1F66]
              sm:text-sm
            "
          >
            Admin Panel
          </span>
        </div>

        {/* Page Content */}
        <main
          className="
            min-w-0
            flex-1
            overflow-x-hidden
            p-3
            sm:p-5
            md:p-6
            lg:p-8
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}