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
      {NAVIGATION.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClick}
          className={clsx(
            "relative py-2 text-[15px] font-medium transition-all duration-300",
            pathname === item.href
              ? "text-[#0B2E8A]"
              : "text-slate-700 hover:text-[#1E5BFF]"
          )}
        >
          {item.label}

          {pathname === item.href && (
            <span className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-[#C8942C]" />
          )}
        </Link>
      ))}
    </>
  );
}