"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles, ArrowRight } from "lucide-react";

import type { VikiMessage as VikiMessageType } from "@/hooks/useVikiChat";

interface Props {
  message: VikiMessageType;
  isLatest?: boolean;
  isLoading?: boolean;
  onSelectSuggestion?: (suggestion: string) => void;
}

export default function VikiMessage({
  message,
  isLatest = false,
  isLoading = false,
  onSelectSuggestion,
}: Props) {
  const isUser = message.role === "user";
  const hasSuggestions =
    !isUser &&
    isLatest &&
    !isLoading &&
    Array.isArray(message.suggestions) &&
    message.suggestions.length > 0;

  return (
    <div
      className={`flex flex-col ${
        isUser ? "items-end" : "items-start"
      } w-full`}
    >
      {/* Message Bubble */}
      <div
        className={[
          "max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6",
          isUser
            ? "rounded-br-md bg-[#0759D9] text-white shadow-xs"
            : "rounded-bl-md border border-[#E5ECFA] bg-white text-[#071F66] shadow-sm",
        ].join(" ")}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div
            className="
              viki-markdown

              [&_p]:mb-3
              [&_p:last-child]:mb-0

              [&_strong]:font-bold
              [&_strong]:text-[#071F66]

              [&_ul]:my-2
              [&_ul]:list-disc
              [&_ul]:pl-5

              [&_ol]:my-2
              [&_ol]:list-decimal
              [&_ol]:pl-5

              [&_li]:my-1

              [&_a]:font-medium
              [&_a]:text-[#0759D9]
              [&_a]:underline
              [&_a]:underline-offset-2

              [&_h1]:mb-3
              [&_h1]:text-lg
              [&_h1]:font-bold

              [&_h2]:mb-2
              [&_h2]:mt-4
              [&_h2]:text-base
              [&_h2]:font-bold

              [&_h3]:mb-2
              [&_h3]:mt-3
              [&_h3]:font-semibold

              [&_blockquote]:my-3
              [&_blockquote]:border-l-4
              [&_blockquote]:border-[#0759D9]
              [&_blockquote]:pl-3
              [&_blockquote]:italic
              [&_blockquote]:text-slate-600
            "
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* Ultra-Premium Follow-Up Suggestions from VIKI Backend */}
      {hasSuggestions && (
        <div className="w-full mt-3.5 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-[#0A1F66] to-[#1E5BFF] flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-3 h-3 text-amber-300" />
              </div>
              <span className="text-[11px] font-bold text-[#0A1F66] tracking-tight">
                Suggested Follow-ups
              </span>
            </div>
            <span className="text-[10px] font-semibold text-[#1E5BFF] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              Instant Ask
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            {message.suggestions!.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectSuggestion?.(suggestion)}
                disabled={isLoading}
                style={{ "--sugg-index": idx } as React.CSSProperties}
                className="viki-suggestion-item group relative flex items-center justify-between gap-3 w-full rounded-2xl border border-blue-100/90 bg-white/95 hover:border-[#1E5BFF]/70 hover:bg-gradient-to-r hover:from-blue-50/90 hover:via-indigo-50/50 hover:to-white p-2.5 sm:p-3 text-left transition-all duration-200 hover:shadow-[0_4px_16px_rgba(30,91,255,0.12)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 cursor-pointer shadow-[0_2px_8px_rgba(10,31,102,0.03)]"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-100/80 flex items-center justify-center text-[#1E5BFF] shrink-0 group-hover:bg-[#1E5BFF] group-hover:text-white group-hover:border-[#1E5BFF] transition-all duration-200 shadow-2xs">
                    <span className="text-[10px] font-bold">
                      0{idx + 1}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-[#0A1F66] transition-colors duration-150 leading-snug line-clamp-2">
                    {suggestion}
                  </span>
                </div>

                <div className="w-6 h-6 rounded-lg bg-slate-50 group-hover:bg-[#1E5BFF] flex items-center justify-center text-slate-400 group-hover:text-white shrink-0 transition-all duration-200 shadow-2xs">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}