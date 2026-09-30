import React, { ReactNode } from "react";
import clsx from "clsx";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  breadcrumbs?: ReactNode;
  searchSlot?: ReactNode;
  children?: ReactNode; // Actions slot (Buttons, Dropdowns, etc.)
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  badge,
  breadcrumbs,
  searchSlot,
  children,
  className,
}: PageHeaderProps) {
  return (
    <header className={clsx("space-y-4 pb-2", className)}>
      {/* Optional Breadcrumbs / Category trace */}
      {breadcrumbs && (
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
          {breadcrumbs}
        </nav>
      )}

      {/* Main Row: Title & Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0A1F66]">
              {title}
            </h1>
            {badge && <div className="shrink-0">{badge}</div>}
          </div>

          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Controls Slot */}
        {children && (
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {children}
          </div>
        )}
      </div>

      {/* Optional Filter / Search Row */}
      {searchSlot && (
        <div className="pt-1">
          {searchSlot}
        </div>
      )}
    </header>
  );
}

export default PageHeader;
