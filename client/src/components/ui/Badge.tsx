import { ReactNode } from "react";
import clsx from "clsx";

interface Props {
  children: ReactNode;
  variant?: "primary" | "gold" | "success" | "outline";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({
  children,
  variant = "primary",
  size = "md",
  className,
}: Props) {
  return (
    <span
      className={clsx(
        // Base
        "inline-flex max-w-full min-w-0 items-center justify-center rounded-full border font-semibold tracking-wide transition-all duration-300",

        // Prevent overflow on very small screens
        "whitespace-normal break-words text-center leading-tight",

        // Sizes
        size === "sm"
          ? "px-2.5 py-1 text-[10px] sm:px-3 sm:text-xs"
          : "px-3 py-1.5 text-xs sm:px-4 sm:text-sm",

        // Variants
        variant === "primary" &&
          "border-[#1E5BFF]/20 bg-[#1E5BFF]/10 text-[#1E5BFF]",

        variant === "gold" &&
          "border-[#C8942C]/20 bg-[#C8942C]/10 text-[#C8942C]",

        variant === "success" &&
          "border-emerald-200 bg-emerald-100 text-emerald-700",

        variant === "outline" &&
          "border-[#D9E4F5] bg-white text-[#0A1F66]",

        className
      )}
    >
      <span className="min-w-0 max-w-full">
        {children}
      </span>
    </span>
  );
}