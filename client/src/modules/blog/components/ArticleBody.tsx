"use client";

import DOMPurify from "isomorphic-dompurify";

interface Props {
  content: string;
}

export default function ArticleBody({ content }: Props) {
  // Sanitize the HTML content safely
  const cleanHtml = DOMPurify.sanitize(content, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling", "target"],
  });

  return (
    <div className="article-editorial-content max-w-[760px]">
      <div
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
        className="
          space-y-6
          text-[17px]
          leading-[1.8]
          text-slate-700
          [&_h2]:mt-12
          [&_h2]:mb-4
          [&_h2]:border-b
          [&_h2]:border-slate-100
          [&_h2]:pb-3
          [&_h2]:text-2xl
          [&_h2]:font-bold
          [&_h2]:tracking-tight
          [&_h2]:text-[#0A1F66]
          [&_h2]:sm:text-3xl
          [&_h3]:mt-8
          [&_h3]:mb-3
          [&_h3]:text-xl
          [&_h3]:font-bold
          [&_h3]:tracking-tight
          [&_h3]:text-[#0A1F66]
          [&_h3]:sm:text-2xl
          [&_p]:mb-6
          [&_p]:leading-[1.85]
          [&_ul]:mb-6
          [&_ul]:list-disc
          [&_ul]:space-y-2.5
          [&_ul]:pl-6
          [&_ol]:mb-6
          [&_ol]:list-decimal
          [&_ol]:space-y-2.5
          [&_ol]:pl-6
          [&_li]:leading-[1.75]
          [&_blockquote]:my-8
          [&_blockquote]:rounded-r-2xl
          [&_blockquote]:border-l-4
          [&_blockquote]:border-[#C8942C]
          [&_blockquote]:bg-amber-50/50
          [&_blockquote]:p-6
          [&_blockquote]:italic
          [&_blockquote]:text-slate-800
          [&_a]:font-semibold
          [&_a]:text-[#1E5BFF]
          [&_a]:underline
          [&_a]:underline-offset-4
          [&_a]:transition-colors
          [&_a:hover]:text-[#0A1F66]
          [&_img]:my-8
          [&_img]:w-full
          [&_img]:rounded-2xl
          [&_img]:shadow-md
          [&_hr]:my-10
          [&_hr]:border-slate-200
          [&_table]:my-8
          [&_table]:w-full
          [&_table]:border-collapse
          [&_table]:overflow-hidden
          [&_table]:rounded-xl
          [&_table]:border
          [&_table]:border-slate-200
          [&_th]:bg-slate-50
          [&_th]:p-3.5
          [&_th]:text-left
          [&_th]:text-xs
          [&_th]:font-bold
          [&_th]:uppercase
          [&_th]:text-[#0A1F66]
          [&_td]:border-t
          [&_td]:border-slate-200
          [&_td]:p-3.5
          [&_td]:text-sm
        "
      />
    </div>
  );
}
