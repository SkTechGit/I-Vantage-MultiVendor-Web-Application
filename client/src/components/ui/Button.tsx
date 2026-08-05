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
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60",

        // Sizes
        size === "sm" && "h-10 px-4 text-sm",
        size === "md" && "h-12 px-6 text-sm",
        size === "lg" && "h-14 px-8 text-base",

        // Primary
        variant === "primary" &&
          "bg-gradient-to-r from-[#0A1F66] to-[#1E5BFF] text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl focus:ring-blue-200",

        // Secondary
        variant === "secondary" &&
          "bg-[#C8942C] text-white shadow-md hover:bg-[#B37F22] hover:-translate-y-0.5 focus:ring-amber-200",

        // Outline
        variant === "outline" &&
          "border border-[#1E5BFF] bg-white text-[#1E5BFF] hover:bg-[#1E5BFF] hover:text-white focus:ring-blue-200",

        // Ghost
        variant === "ghost" &&
          "bg-transparent text-[#0A1F66] hover:bg-blue-50 focus:ring-blue-100",

        className
      )}
    >
      {loading && (
        <Loader2
          size={18}
          className="animate-spin"
        />
      )}

      {children}
    </button>
  );
}