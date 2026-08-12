import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={clsx(
        // =====================================================
        // BASE
        // =====================================================
        "inline-flex w-auto max-w-full min-w-0 shrink-0",
        "items-center justify-center gap-2",
        "rounded-xl border border-transparent",
        "font-semibold leading-none",
        "whitespace-nowrap",
        "transition-all duration-300 ease-out",
        "focus:outline-none focus-visible:ring-4",
        "disabled:cursor-not-allowed disabled:opacity-60",

        // Make icons inside button never shrink
        "[&>svg]:shrink-0",

        // =====================================================
        // SIZES
        // =====================================================
        size === "sm" &&
          "min-h-9 px-4 text-xs sm:min-h-10 sm:px-5 sm:text-sm",

        size === "md" &&
          "min-h-11 px-4 text-sm sm:min-h-12 sm:px-6",

        size === "lg" &&
          "min-h-12 px-5 text-sm sm:min-h-14 sm:px-8 sm:text-base",

        // =====================================================
        // PRIMARY
        // =====================================================
        variant === "primary" && [
          "bg-gradient-to-r cursor-pointer from-[#0A1F66] to-[#1E5BFF]",
          "text-white shadow-lg",
          "hover:-translate-y-0.5 hover:shadow-xl",
          "focus-visible:ring-blue-200",
          "active:translate-y-0 active:shadow-md",
        ],

        // =====================================================
        // SECONDARY
        // =====================================================
        variant === "secondary" && [
          "bg-[#C8942C] text-white shadow-md",
          "hover:-translate-y-0.5 cursor-pointer hover:bg-[#B37F22] hover:shadow-lg",
          "focus-visible:ring-amber-200",
          "active:translate-y-0 active:shadow-md",
        ],

        // =====================================================
        // OUTLINE
        // =====================================================
        variant === "outline" && [
          "border-[#1E5BFF]",
          "bg-white text-[#1E5BFF]",
          "hover:bg-[#1E5BFF] cursor-pointer hover:text-white",
          "focus-visible:ring-blue-200",
        ],

        // =====================================================
        // GHOST
        // =====================================================
        variant === "ghost" && [
          "bg-transparent text-[#0A1F66]",
          "hover:bg-blue-50",
          "focus-visible:ring-blue-100",
        ],

        // =====================================================
        // CUSTOM CLASS
        // =====================================================
        className
      )}
    >
      {loading && (
        <Loader2
          aria-hidden="true"
          className="shrink-0 animate-spin"
          size={size === "sm" ? 15 : size === "lg" ? 19 : 17}
        />
      )}

      {children}
    </button>
  );
}