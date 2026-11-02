"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { NAVIGATION } from "@/constants/navigation";

interface Props {
  onClick?: () => void;
}

export default function NavLinks({ onClick }: Props) {
  const pathname = usePathname();

  return (
    <>
      {NAVIGATION.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={clsx(
              "group/nav relative px-1 xl:px-2 2xl:px-2.5 py-1.5 text-[12.5px] xl:text-[13px] 2xl:text-[14.5px] font-medium transition-colors duration-300 whitespace-nowrap shrink-0",
              isActive
                ? "text-[#0B2E8A] font-bold"
                : "text-slate-700 hover:text-[#1E5BFF]"
            )}
          >
            <span className="relative z-10 transition-transform duration-200 group-hover/nav:-translate-y-0.5 inline-block">
              {item.label}
            </span>

            {/* Active Pill Indicator */}
            {isActive && (
              <span className="absolute bottom-0 left-0 h-[2.5px] w-full rounded-full bg-gradient-to-r from-[#1E5BFF] via-[#0A1F66] to-[#F4A900] shadow-xs" />
            )}

            {/* Hover Indicator for Inactive items */}
            {!isActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-[#1E5BFF]/70 rounded-full transition-all duration-300 ease-out group-hover/nav:w-4/5" />
            )}
          </Link>
        );
      })}
    </>
  );
}
