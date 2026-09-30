import React, { ReactNode } from "react";
import { Inbox } from "lucide-react";
import clsx from "clsx";

export interface DataTableShellProps {
  loading?: boolean;
  skeletonRows?: number;
  skeletonCols?: number;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
  emptyAction?: ReactNode;
  children: ReactNode;
  pagination?: ReactNode;
  className?: string;
}

export function DataTableShell({
  loading = false,
  skeletonRows = 5,
  skeletonCols = 5,
  isEmpty = false,
  emptyTitle = "No records found",
  emptyDescription = "There is no data matching your current filters.",
  emptyIcon,
  emptyAction,
  children,
  pagination,
  className,
}: DataTableShellProps) {
  return (
    <div
      className={clsx(
        "bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all",
        className
      )}
    >
      {/* 1. Loading Skeleton State */}
      {loading ? (
        <div className="p-4 space-y-3 animate-pulse">
          {/* Table Header Placeholder */}
          <div className="h-9 bg-slate-100 rounded-lg w-full" />
          {/* Skeleton Rows */}
          {Array.from({ length: skeletonRows }).map((_, rIdx) => (
            <div
              key={`skel-row-${rIdx}`}
              className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0"
            >
              {Array.from({ length: skeletonCols }).map((_, cIdx) => (
                <div
                  key={`skel-col-${cIdx}`}
                  className="h-4 bg-slate-100 rounded-md"
                  style={{
                    width: `${Math.max(30, 100 / skeletonCols + (cIdx % 2 === 0 ? 10 : -10))}%`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      ) : isEmpty ? (
        /* 2. Empty State */
        <div className="py-16 px-6 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 border border-slate-100">
            {emptyIcon || <Inbox className="h-6 w-6" aria-hidden="true" />}
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800">{emptyTitle}</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              {emptyDescription}
            </p>
          </div>
          {emptyAction && <div className="pt-2">{emptyAction}</div>}
        </div>
      ) : (
        /* 3. Main Data Content (Horizontal Scroll Container) */
        <div className="overflow-x-auto">{children}</div>
      )}

      {/* 4. Optional Pagination Footer */}
      {!loading && !isEmpty && pagination && (
        <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3">
          {pagination}
        </div>
      )}
    </div>
  );
}

export default DataTableShell;
