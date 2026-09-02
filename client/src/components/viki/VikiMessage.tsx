"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { VikiMessage as VikiMessageType } from "@/hooks/useVikiChat";

interface Props {
  message: VikiMessageType;
}

export default function VikiMessage({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={[
          "max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6",
          isUser
            ? "rounded-br-md bg-[#0759D9] text-white"
            : "rounded-bl-md border border-[#E5ECFA] bg-white text-[#071F66] shadow-sm",
        ].join(" ")}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">
            {message.content}
          </p>
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
    </div>
  );
}