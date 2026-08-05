"use client";

import { Bell } from "lucide-react";

export default function Header() {
  return (
    <header
  className="
    sticky
    top-0
    z-30

    flex
    h-20
    items-center
    justify-between

    border-b

    bg-white

    px-8
  "
>

      <div>

        <h1 className="text-2xl font-bold text-[#0A1F66]">
          Dashboard
        </h1>

        <p className="text-sm text-slate-500">
          Welcome back, Admin
        </p>

      </div>

      <div className="flex items-center gap-5">

        <button className="relative">

          <Bell size={22} />

          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500" />

        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E5BFF] font-semibold text-white">
          A
        </div>

      </div>

    </header>
  );
}