"use client";

import { useMemo, useEffect, useState } from "react";
import clsx from "clsx";
import { AlignLeft } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface Props {
  content: string;
}

export default function TableOfContents({ content }: Props) {
  const [activeId, setActiveId] = useState<string>("");

  // Parse headings synchronously with useMemo (no setState in effect)
  const headings = useMemo<TocItem[]>(() => {
    if (!content) return [];
    const regex = /<h([23])[^>]*>(.*?)<\/h\1>/gi;
    const items: TocItem[] = [];
    let match;
    let index = 0;

    while ((match = regex.exec(content)) !== null) {
      const level = parseInt(match[1], 10);
      const rawText = match[2].replace(/<[^>]*>/g, "").trim();
      if (rawText) {
        const id = `heading-${index}-${rawText
          .toLowerCase()
          .replace(/[^\w]+/g, "-")
          .slice(0, 30)}`;
        items.push({ id, text: rawText, level });
        index++;
      }
    }
    return items;
  }, [content]);

  useEffect(() => {
    if (headings.length < 2) return;

    // Attach matching IDs to actual DOM headings
    const actualHeadings = document.querySelectorAll(
      ".article-editorial-content h2, .article-editorial-content h3"
    );

    actualHeadings.forEach((el, index) => {
      if (headings[index]) {
        el.id = headings[index].id;
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -60% 0px" }
    );

    actualHeadings.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) {
    return null;
  }

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <aside className="sticky top-28 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-xs font-bold uppercase tracking-wider text-[#0A1F66]">
        <AlignLeft size={15} className="text-[#C8942C]" />
        <span>Table of Contents</span>
      </div>

      <nav className="mt-4 max-h-[70vh] overflow-y-auto pr-1">
        <ul className="space-y-2.5 text-xs sm:text-sm">
          {headings.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li
                key={item.id}
                className={clsx(item.level === 3 ? "pl-3.5" : "pl-0")}
              >
                <button
                  type="button"
                  onClick={() => scrollToHeading(item.id)}
                  className={clsx(
                    "text-left transition-colors duration-200 line-clamp-2",
                    isActive
                      ? "font-bold text-[#1E5BFF]"
                      : "text-slate-600 hover:text-[#0A1F66]"
                  )}
                >
                  {item.text}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
