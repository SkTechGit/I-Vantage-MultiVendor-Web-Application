"use client";

import { FormEvent, useState } from "react";
import {
  Bot,
  ChevronDown,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";

import { useVikiChat } from "@/hooks/useVikiChat";
import VikiMessage from "./VikiMessage";

const QUICK_ACTIONS = [
  "Virtual Office",
  "GST Registration",
  "Company Registration",
  "Business Registration",
];

export default function VikiBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const {
    messages,
    isLoading,
    sendMessage,
    clearConversation,
  } = useVikiChat();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const message = input.trim();

    if (!message || isLoading) {
      return;
    }

    setInput("");

    await sendMessage(message);
  };

  const handleQuickAction = async (action: string) => {
    if (isLoading) {
      return;
    }

    await sendMessage(
      `Please tell me about ${action} services offered by i-VANTAGE.`
    );
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open VIKI assistant"
          className="fixed bottom-5 right-5 z-[9999] flex items-center gap-3 rounded-full bg-[#0759D9] px-5 py-3.5 text-white shadow-[0_10px_35px_rgba(7,89,217,0.3)] transition-all duration-200 hover:-translate-y-1 hover:bg-[#064FBE]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
            <Bot size={21} />
          </span>

          <span className="hidden font-semibold sm:block">
            Ask VIKI
          </span>

          <MessageCircle size={18} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-[9999] flex h-[min(720px,calc(100vh-32px))] w-[min(420px,calc(100vw-32px))] flex-col overflow-hidden rounded-3xl border border-[#DCE6F7] bg-[#F7FAFF] shadow-[0_20px_70px_rgba(7,31,102,0.22)]">
          
          {/* Header */}
          <div className="relative overflow-hidden bg-[#071F66] px-5 py-4 text-white">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#2D7CFF]/20" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <Bot
                    size={25}
                    className="text-[#0759D9]"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold">
                      VIKI
                    </h2>

                    <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px]">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      Online
                    </span>
                  </div>

                  <p className="text-xs text-blue-100">
                    i-VANTAGE Business Assistant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={clearConversation}
                  className="rounded-lg p-2 text-blue-100 transition hover:bg-white/10 hover:text-white"
                  aria-label="Clear conversation"
                  title="New conversation"
                >
                  <Sparkles size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 text-blue-100 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close VIKI"
                >
                  <X size={19} />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-5">
            {messages.length === 0 ? (
              <div className="flex min-h-full flex-col justify-center">
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md">
                    <Bot
                      size={32}
                      className="text-[#0759D9]"
                    />
                  </div>

                  <h3 className="text-xl font-bold text-[#071F66]">
                    Hello! I&apos;m VIKI 👋
                  </h3>

                  <p className="mx-auto mt-2 max-w-[300px] text-sm leading-6 text-slate-500">
                    Your i-VANTAGE Business Assistant. How can I
                    help you today?
                  </p>
                </div>

                <div className="space-y-2.5">
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => handleQuickAction(action)}
                      disabled={isLoading}
                      className="flex w-full items-center justify-between rounded-xl border border-[#DCE6F7] bg-white px-4 py-3 text-left text-sm font-medium text-[#071F66] transition hover:border-[#0759D9] hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span>{action}</span>

                      <ChevronDown
                        size={16}
                        className="-rotate-90 text-[#0759D9]"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <VikiMessage
                    key={message.id}
                    message={message}
                  />
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-md border border-[#E5ECFA] bg-white px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#0759D9]" />
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-[#0759D9]"
                          style={{ animationDelay: "120ms" }}
                        />
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-[#0759D9]"
                          style={{ animationDelay: "240ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-[#DCE6F7] bg-white p-3">
            <form
              onSubmit={handleSubmit}
              className="flex items-end gap-2 rounded-2xl border border-[#DCE6F7] bg-[#F7FAFF] p-1.5 focus-within:border-[#0759D9]"
            >
              <textarea
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();

                    if (input.trim() && !isLoading) {
                      handleSubmit(
                        event as unknown as FormEvent<HTMLFormElement>
                      );
                    }
                  }
                }}
                placeholder="Ask VIKI anything..."
                rows={1}
                disabled={isLoading}
                className="max-h-24 min-h-[42px] flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-[#071F66] outline-none placeholder:text-slate-400 disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0759D9] text-white transition hover:bg-[#064FBE] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                <Send size={17} />
              </button>
            </form>

            <p className="mt-2 text-center text-[10px] text-slate-400">
              Powered by i-VANTAGE AI
            </p>
          </div>
        </div>
      )}
    </>
  );
}