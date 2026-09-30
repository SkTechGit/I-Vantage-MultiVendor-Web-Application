import React, { ReactNode } from "react";
import clsx from "clsx";

export type StatusBadgeTone = "neutral" | "info" | "success" | "warning" | "danger";
export type StatusBadgeSize = "sm" | "md";

export interface StatusBadgeProps {
  label: string;
  tone?: StatusBadgeTone;
  size?: StatusBadgeSize;
  dot?: boolean;
  icon?: ReactNode;
  className?: string;
}

const toneStyles: Record<
  StatusBadgeTone,
  { container: string; dot: string }
> = {
  neutral: {
    container: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-400",
  },
  info: {
    container: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  success: {
    container: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  warning: {
    container: "bg-amber-50 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
  },
  danger: {
    container: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
};

const sizeStyles: Record<StatusBadgeSize, string> = {
  sm: "px-2 py-0.5 text-[11px] font-semibold gap-1.5",
  md: "px-2.5 py-1 text-xs font-semibold gap-2",
};

export function StatusBadge({
  label,
  tone = "neutral",
  size = "md",
  dot = false,
  icon,
  className,
}: StatusBadgeProps) {
  const styles = toneStyles[tone] || toneStyles.neutral;
  const sizeClass = sizeStyles[size] || sizeStyles.md;

  return (
    <span
      data-tone={tone}
      data-size={size}
      className={clsx(
        "inline-flex items-center rounded-full border leading-tight select-none transition-colors",
        styles.container,
        sizeClass,
        className
      )}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={clsx("h-1.5 w-1.5 rounded-full shrink-0", styles.dot)}
        />
      )}
      {icon && (
        <span aria-hidden="true" className="shrink-0 flex items-center">
          {icon}
        </span>
      )}
      <span className="truncate">{label}</span>
    </span>
  );
}

export default StatusBadge;
