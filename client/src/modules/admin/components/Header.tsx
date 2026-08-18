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
        h-16
        sm:h-20
        items-center
        justify-between
        border-b
        border-slate-200
        bg-white
        px-4
        sm:px-6
        lg:px-8
      "
    >
      {/* Left */}
      <div className="min-w-0">
        <h1
          className="
            truncate
            text-lg
            font-bold
            text-[#0A1F66]
            sm:text-xl
            lg:text-2xl
          "
        >
          Dashboard
        </h1>

        <p
          className="
            hidden
            text-xs
            text-slate-500
            sm:block
            sm:text-sm
          "
        >
          Welcome back, Admin
        </p>
      </div>

      {/* Right */}
      <div className="flex shrink-0 items-center gap-3 sm:gap-5">
        {/* Notification */}
        <button
          type="button"
          aria-label="Notifications"
          className="
            relative
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            text-slate-600
            transition
            hover:bg-slate-100
            hover:text-[#0A1F66]
            focus:outline-none
            focus:ring-2
            focus:ring-[#1E5BFF]
            focus:ring-offset-1
            sm:h-10
            sm:w-10
          "
        >
          <Bell
            size={20}
            className="sm:h-[22px] sm:w-[22px]"
          />

          {/* Notification indicator */}
          <span
            className="
              absolute
              right-1.5
              top-1.5
              h-2
              w-2
              rounded-full
              bg-red-500
              ring-2
              ring-white
              sm:right-2
              sm:top-2
            "
          />
        </button>

        {/* Admin Profile */}
        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-[#1E5BFF]
            text-sm
            font-semibold
            text-white
            sm:h-10
            sm:w-10
          "
          aria-label="Admin profile"
        >
          A
        </div>
      </div>
    </header>
  );
}