import clsx from "clsx";
import { BlogCategory } from "../blog.types";

interface Props {
  categories: BlogCategory[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  totalAllCount?: number;
}

export default function BlogCategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  totalAllCount,
}: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none">
      {/* "All" Pill */}
      <button
        type="button"
        onClick={() => onSelectCategory("all")}
        className={clsx(
          "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 sm:text-sm",
          selectedCategory === "all"
            ? "bg-[#0A1F66] text-white shadow-sm"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
        )}
      >
        <span>All Insights</span>
        {typeof totalAllCount === "number" && (
          <span
            className={clsx(
              "rounded-full px-1.5 py-0.5 text-[11px] font-bold",
              selectedCategory === "all"
                ? "bg-white/20 text-white"
                : "bg-slate-200 text-slate-600"
            )}
          >
            {totalAllCount}
          </span>
        )}
      </button>

      {/* Dynamic Category Pills */}
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.slug;
        return (
          <button
            key={cat._id}
            type="button"
            onClick={() => onSelectCategory(cat.slug)}
            className={clsx(
              "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 sm:text-sm",
              isSelected
                ? "bg-[#0A1F66] text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            )}
          >
            <span>{cat.name}</span>
            {typeof cat.postCount === "number" && cat.postCount > 0 && (
              <span
                className={clsx(
                  "rounded-full px-1.5 py-0.5 text-[11px] font-bold",
                  isSelected
                    ? "bg-[#C8942C] text-[#0A1F66]"
                    : "bg-slate-200 text-slate-600"
                )}
              >
                {cat.postCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
