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
        "inline-flex items-center justify-center rounded-full font-semibold tracking-wide transition-all duration-300",

        // Sizes
        size === "sm"
          ? "px-3 py-1 text-xs"
          : "px-4 py-1.5 text-sm",

        // Variants
        variant === "primary" &&
          "bg-[#1E5BFF]/10 text-[#1E5BFF] border border-[#1E5BFF]/20",

        variant === "gold" &&
          "bg-[#C8942C]/10 text-[#C8942C] border border-[#C8942C]/20",

        variant === "success" &&
          "bg-emerald-100 text-emerald-700 border border-emerald-200",

        variant === "outline" &&
          "bg-white text-[#0A1F66] border border-[#D9E4F5]",

        className
      )}
    >
      {children}
    </span>
  );
}