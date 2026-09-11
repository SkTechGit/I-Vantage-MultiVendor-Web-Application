
"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
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
import "./viki-motion.css";

const QUICK_ACTIONS = [
  {
    label: "Virtual Office",
    question:
      "What virtual office services does i-VANTAGE provide?",
  },
  {
    label: "Coworking Seats",
    question:
      "I need a coworking seat. What coworking seating options does i-VANTAGE provide, and what are the available plans and pricing?",
  },
  {
    label: "Private Cabin",
    question:
      "I need a private cabin for my team. What private cabin options does i-VANTAGE provide, how many people can they accommodate, and what are the prices?",
  },
  {
    label: "Meeting Room",
    question:
      "I need a meeting room. What meeting rooms are available at i-VANTAGE, how many people can they accommodate, and what are the pricing and booking options?",
  },
  {
    label: "Dedicated Desk",
    question:
      "What dedicated desk options does i-VANTAGE provide for individuals or teams, and what are the plans and pricing?",
  },
  {
    label: "GST Registration",
    question:
      "How can I register for GST through i-VANTAGE? Please explain the process, documents required, and services provided.",
  },
  {
    label: "Company Registration",
    question:
      "How can I register a company through i-VANTAGE? Please explain the process and requirements.",
  },
  {
    label: "Business Registration",
    question:
      "What business registration services does i-VANTAGE provide?",
  },
  {
    label: "Pricing & Plans",
    question:
      "What are the prices and plans for i-VANTAGE's coworking, virtual office, meeting room, private cabin, and business registration services?",
  },
];

const PROMPT_QUESTIONS = [
  {
    title: "Looking for a workspace?",
    options: [
      {
        label: "Coworking Seats",
        question:
          "I need a coworking seat. What options and plans are available at i-VANTAGE?",
      },
      {
        label: "Private Cabin",
        question:
          "I need a private cabin for my team. What options and pricing are available?",
      },
    ],
  },
  {
    title: "Need a meeting space?",
    options: [
      {
        label: "Meeting Rooms",
        question:
          "What meeting rooms are available at i-VANTAGE and what are the booking options and prices?",
      },
      {
        label: "Dedicated Desk",
        question:
          "What dedicated desk options are available at i-VANTAGE for individuals and teams?",
      },
    ],
  },
  {
    title: "Need business services?",
    options: [
      {
        label: "Virtual Office",
        question:
          "What virtual office services does i-VANTAGE provide?",
      },
      {
        label: "GST Registration",
        question:
          "How can I register for GST through i-VANTAGE?",
      },
    ],
  },
  {
    title: "Starting a business?",
    options: [
      {
        label: "Company Registration",
        question:
          "How can I register a company through i-VANTAGE?",
      },
      {
        label: "Business Registration",
        question:
          "What business registration services does i-VANTAGE provide?",
      },
    ],
  },
];

type ChatStatus =
  | "closed"
  | "opening"
  | "open"
  | "closing";

export default function VikiBot() {
  const [input, setInput] = useState("");
  const [chatStatus, setChatStatus] = useState<ChatStatus>("closed");
  const [launcherTapped, setLauncherTapped] = useState(false);
  // const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const isOpen = chatStatus === "opening" || chatStatus === "open";

  // Teaser visibility
  const [isPromptVisible, setIsPromptVisible] =
    useState(false);

  // Current teaser question
  const [promptIndex, setPromptIndex] = useState(0);

  const currentPrompt = PROMPT_QUESTIONS[promptIndex];

  const {
    messages,
    isLoading,
    sendMessage,
    clearConversation,
  } = useVikiChat();

  /*
   * Coordinated Open & Close Machine
   */
  const openChat = () => {
    if (chatStatus === "open" || chatStatus === "opening") return;
    setLauncherTapped(true);
    setIsPromptVisible(false);
    setChatStatus("opening");
  };

  const closeChat = () => {
    if (chatStatus === "closed" || chatStatus === "closing") return;
    setChatStatus("closing");
  };

  /*
   * Chat Transition Lifecycle Timer
   */
  useEffect(() => {
    if (chatStatus === "opening") {
      const timer = setTimeout(() => {
        setChatStatus("open");
        setLauncherTapped(false);
        textareaRef.current?.focus();
      }, 440);
      return () => clearTimeout(timer);
    }

    if (chatStatus === "closing") {
      const timer = setTimeout(() => {
        setChatStatus("closed");
        setLauncherTapped(false);
      }, 280);
      return () => clearTimeout(timer);
    }
  }, [chatStatus]);

  /*
   * Body Scroll Lock & Escape Key Handler
   */
  useEffect(() => {
    const isChatActive = chatStatus === "opening" || chatStatus === "open";
    if (isChatActive) {
      document.body.classList.add("viki-active");
    } else {
      document.body.classList.remove("viki-active");
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" &&
        (chatStatus === "open" || chatStatus === "opening")
      ) {
        closeChat();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("viki-active");
    };
  }, [chatStatus]);

  /*
   * Show VIKI teaser after 4 seconds.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPromptVisible(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  /*
   * Rotate teaser questions every 8 seconds.
   */
  useEffect(() => {
    if (!isPromptVisible || isOpen) {
      return;
    }

    const timer = setInterval(() => {
      setPromptIndex(
        (current) =>
          (current + 1) % PROMPT_QUESTIONS.length
      );
    }, 8000);

    return () => clearInterval(timer);
  }, [isPromptVisible, isOpen]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const message = input.trim();

    if (!message || isLoading) {
      return;
    }

    setInput("");

    await sendMessage(message);
  };

  /*
   * Used by the normal chat quick actions.
   */
  const handleQuickAction = async (
    question: string
  ) => {
    if (isLoading) {
      return;
    }

    await sendMessage(question);
  };

  /*
   * Used by the teaser questions.
   */
  const handlePromptQuestion = async (
    question: string
  ) => {
    if (isLoading) {
      return;
    }

    setIsPromptVisible(false);
    openChat();

    await sendMessage(question);
  };

  /*
   * Close teaser without opening VIKI.
   */
  const closePrompt = () => {
    setIsPromptVisible(false);

    setTimeout(() => {
      if (!isOpen) {
        setIsPromptVisible(true);
      }
    }, 10000);
  };

  return (
    <>
      {/* ================================================== */}
      {/* VIKI QUESTION TEASER                              */}
      {/* ================================================== */}

      {!isOpen && isPromptVisible && (
        <div
          className="
            fixed
            bottom-[76px]
            left-3
            right-3
            z-[9998]
            w-auto
            animate-in
            slide-in-from-bottom-3
            fade-in
            duration-300

            sm:bottom-[88px]
            sm:left-auto
            sm:right-4
            sm:w-[min(350px,calc(100vw-32px))]
          "
        >
          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-[#DCE6F7]
              bg-white
              p-3.5
              shadow-[0_15px_50px_rgba(7,31,102,0.18)]

              sm:p-4
            "
          >
            {/* Top gradient */}
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#071F66] via-[#0759D9] to-[#2D7CFF]" />

            {/* Close teaser */}
            <button
              type="button"
              onClick={closePrompt}
              className="
                absolute
                right-2
                top-2
                rounded-full
                p-1.5
                text-slate-400
                transition
                hover:bg-slate-100
                hover:text-[#071F66]
              "
              aria-label="Close VIKI suggestion"
            >
              <X size={15} />
            </button>

            {/* VIKI identity */}
            <div className="flex items-start gap-2.5 pr-6 sm:gap-3">
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#F0F5FF]

                  sm:h-10
                  sm:w-10
                "
              >
                <Bot
                  size={19}
                  className="text-[#0759D9] sm:h-[21px] sm:w-[21px]"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-[#071F66]">
                    VIKI
                  </p>

                  <span className="text-[9px] text-slate-400 sm:text-[10px]">
                    i-VANTAGE AI
                  </span>
                </div>

                <p className="mt-1 text-xs font-medium leading-5 text-slate-700 sm:text-sm">
                  {currentPrompt.title}
                </p>
              </div>
            </div>

            {/* Suggested questions */}
            <div className="mt-3 space-y-2 sm:mt-4">
              {currentPrompt.options.map(
                (option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() =>
                      handlePromptQuestion(
                        option.question
                      )
                    }
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-xl
                      border
                      border-[#DCE6F7]
                      bg-[#F8FAFF]
                      px-3
                      py-2.5
                      text-left
                      text-xs
                      font-semibold
                      text-[#071F66]
                      transition-all
                      hover:border-[#0759D9]
                      hover:bg-[#F0F5FF]
                      hover:shadow-sm
                    "
                  >
                    <span className="truncate pr-2">
                      {option.label}
                    </span>

                    <span className="shrink-0 text-[#0759D9]">
                      →
                    </span>
                  </button>
                )
              )}
            </div>

            <p className="mt-2.5 text-center text-[10px] text-slate-400 sm:mt-3">
              Or ask VIKI anything
            </p>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* BACKDROP BLUR OVERLAY                              */}
      {/* ================================================== */}

      {chatStatus !== "closed" && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (chatStatus === "open") {
              closeChat();
            }
          }}
          aria-hidden="true"
          className={`
            fixed
            inset-0
            z-[9990]
            bg-[rgba(5,15,35,0.26)]
            backdrop-blur-[3px]
            ${chatStatus === "closing" ? "viki-backdrop-exit" : "viki-backdrop-enter"}
          `}
        />
      )}

      {/* ================================================== */}
      {/* FLOATING VIKI BUTTON                              */}
      {/* ================================================== */}

      {chatStatus === "closed" && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openChat();
          }}
          aria-label="Open VIKI assistant"
          aria-expanded={false}
          aria-controls="viki-chat-panel"
          disabled={false}
          className={`
            fixed
            bottom-4
            right-4
            z-[9985]
            flex
            items-center
            gap-2.5
            rounded-full
            bg-[#0759D9]
            px-3.5
            py-3
            text-white
            shadow-[0_10px_35px_rgba(7,89,217,0.3)]
            transition-all
            duration-200
            hover:-translate-y-1
            hover:bg-[#064FBE]

            sm:bottom-5
            sm:right-5
            sm:gap-3
            sm:px-5
            sm:py-3.5
            ${launcherTapped ? "viki-launcher-tap" : ""}
          `}
        >
          <span
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-white/15

              sm:h-9
              sm:w-9
            "
          >
            <Bot size={19} className="sm:h-[21px] sm:w-[21px]" />
          </span>

          <span className="hidden font-semibold sm:block">
            Ask VIKI
          </span>

          <MessageCircle size={17} className="sm:h-[18px] sm:w-[18px]" />
        </button>
      )}

      {/* ================================================== */}
      {/* CHAT WINDOW                                       */}
      {/* ================================================== */}

      {chatStatus !== "closed" && (
        <div
          id="viki-chat-panel"
          role="dialog"
          aria-label="VIKI AI Assistant"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
          className={`
            fixed
            z-[9995]
            flex
            flex-col
            overflow-hidden
            border
            border-[#DCE6F7]
            bg-[#F7FAFF]
            shadow-[0_20px_70px_rgba(7,31,102,0.22)]

            /* ========================= */
            /* MOBILE — inset panel (never grows above viewport) */
            /* ========================= */

            top-[max(12px,env(safe-area-inset-top))]
            bottom-[max(12px,env(safe-area-inset-bottom))]
            left-[max(12px,env(safe-area-inset-left))]
            right-[max(12px,env(safe-area-inset-right))]
            h-auto
            min-h-0
            max-h-none
            w-auto
            rounded-2xl

            /* ========================= */
            /* TABLET / DESKTOP          */
            /* ========================= */

            sm:top-auto
            sm:bottom-4
            sm:left-auto
            sm:right-4
            sm:h-[min(680px,calc(100dvh-32px))]
            sm:w-[min(400px,calc(100vw-32px))]
            sm:max-h-[min(680px,calc(100dvh-32px))]
            sm:rounded-3xl

            /* ========================= */
            /* LARGE DESKTOP             */
            /* ========================= */

            lg:bottom-5
            lg:right-5
            lg:h-[min(720px,calc(100dvh-32px))]
            lg:w-[420px]

            ${chatStatus === "opening" ? "viki-panel-opening" : ""}
            ${chatStatus === "open" ? "viki-panel-open" : ""}
            ${chatStatus === "closing" ? "viki-panel-closing" : ""}
          `}
        >
          {/* ================================================== */}
          {/* HEADER                                             */}
          {/* ================================================== */}

          <div
            className="
              relative
              shrink-0
              overflow-hidden
              bg-[#071F66]
              px-3.5
              py-3
              text-white

              sm:px-5
              sm:py-4
            "
          >
            {/* Decorative circle */}
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#2D7CFF]/20" />

            <div className={`relative flex items-center justify-between ${chatStatus === "closing" ? "viki-header-animated" : ""}`}>
              {/* VIKI identity */}
              <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                <div
                  className={`
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-white
                    shadow-sm

                    sm:h-11
                    sm:w-11
                    sm:rounded-2xl
                    ${chatStatus === "opening" ? "viki-header-avatar-enter" : ""}
                  `}
                >
                  <Bot
                    size={21}
                    className="text-[#0759D9] sm:h-[25px] sm:w-[25px]"
                  />
                </div>

                <div className={`min-w-0 ${chatStatus === "opening" ? "viki-header-name-enter" : ""}`}>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold sm:text-base">
                      VIKI
                    </h2>

                    <span
                      className={`
                        flex
                        items-center
                        gap-1
                        rounded-full
                        bg-white/10
                        px-1.5
                        py-0.5
                        text-[9px]
                        sm:px-2
                        sm:text-[10px]
                        ${chatStatus === "opening" ? "viki-header-status-enter" : ""}
                      `}
                    >
                      <span className="viki-status-dot h-1.5 w-1.5 rounded-full bg-green-400" />
                      Online
                    </span>
                  </div>

                  <p className="truncate text-[10px] text-blue-100 sm:text-xs">
                    i-VANTAGE Business Assistant
                  </p>
                </div>
              </div>

              {/* Header actions */}
              <div
                className={`
                  flex
                  shrink-0
                  items-center
                  gap-0.5
                  sm:gap-1
                  ${chatStatus === "opening" ? "viki-header-actions-enter" : ""}
                `}
              >
                <button
                  type="button"
                  onClick={clearConversation}
                  className="
                    rounded-lg
                    p-1.5
                    text-blue-100
                    transition
                    hover:bg-white/10
                    hover:text-white

                    sm:p-2
                  "
                  aria-label="Clear conversation"
                  title="New conversation"
                >
                  <Sparkles size={16} className="sm:h-[17px] sm:w-[17px]" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeChat();
                  }}
                  className="
                    rounded-lg
                    p-1.5
                    text-blue-100
                    transition
                    hover:bg-white/10
                    hover:text-white

                    sm:p-2
                  "
                  aria-label="Close VIKI"
                >
                  <X size={18} className="sm:h-[19px] sm:w-[19px]" />
                </button>
              </div>
            </div>
          </div>

          {/* ================================================== */}
          {/* MESSAGES                                           */}
          {/* ================================================== */}

          <div
            className="
              min-h-0
              flex-1
              overflow-y-auto
              overflow-x-hidden
              overscroll-contain
              [-webkit-overflow-scrolling:touch]
              px-3
              py-3

              sm:px-4
              sm:py-5
            "
          >
            {messages.length === 0 ? (
              <div className="flex min-h-0 flex-col justify-start sm:min-h-full sm:justify-center">
                {/* Welcome */}
                <div className={`mb-4 text-center sm:mb-6 ${chatStatus === "closing" ? "viki-welcome-content" : ""}`}>
                  <div
                    className={`
                      mx-auto
                      mb-3
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      bg-white
                      shadow-md

                      sm:mb-4
                      sm:h-16
                      sm:w-16
                      sm:rounded-2xl
                      ${chatStatus === "opening" ? "viki-welcome-avatar-enter" : ""}
                    `}
                  >
                    <Bot
                      size={25}
                      className="text-[#0759D9] sm:h-8 sm:w-8"
                    />
                  </div>

                  <div className={chatStatus === "opening" ? "viki-welcome-greeting-enter" : ""}>
                    <h3 className="text-lg font-bold text-[#071F66] sm:text-xl">
                      Hello! I&apos;m VIKI 👋
                    </h3>

                    <p className="mx-auto mt-1.5 max-w-[280px] text-xs leading-5 text-slate-500 sm:mt-2 sm:max-w-[300px] sm:text-sm sm:leading-6">
                      Your i-VANTAGE Business Assistant.
                      How can I help you today?
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div
                  className="
                    grid
                    grid-cols-1
                    gap-2

                    sm:block
                    sm:space-y-2.5
                  "
                >
                  {QUICK_ACTIONS.map(
                    (action, index) => (
                      <button
                        key={action.label}
                        type="button"
                        onClick={() =>
                          handleQuickAction(
                            action.question
                          )
                        }
                        disabled={isLoading}
                        style={{ "--card-index": index } as React.CSSProperties}
                        className={`
                          flex
                          min-h-[42px]
                          w-full
                          items-center
                          justify-between
                          rounded-xl
                          border
                          border-[#DCE6F7]
                          bg-white
                          px-3
                          py-2.5
                          text-left
                          text-xs
                          font-medium
                          text-[#071F66]
                          transition

                          hover:border-[#0759D9]
                          hover:bg-blue-50

                          disabled:cursor-not-allowed
                          disabled:opacity-60

                          sm:px-4
                          sm:py-3
                          sm:text-sm
                          ${chatStatus === "opening" ? "viki-card-stagger" : ""}
                        `}
                      >
                        <span className="pr-2">
                          {action.label}
                        </span>

                        <ChevronDown
                          size={15}
                          className="
                            shrink-0
                            -rotate-90
                            text-[#0759D9]

                            sm:h-4
                            sm:w-4
                          "
                        />
                      </button>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {messages.map(
                  (message) => (
                    <VikiMessage
                      key={message.id}
                      message={message}
                    />
                  )
                )}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-md border border-[#E5ECFA] bg-white px-3.5 py-2.5 shadow-sm sm:px-4 sm:py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#0759D9]" />

                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-[#0759D9]"
                          style={{
                            animationDelay:
                              "120ms",
                          }}
                        />

                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-[#0759D9]"
                          style={{
                            animationDelay:
                              "240ms",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ================================================== */}
          {/* INPUT                                              */}
          {/* ================================================== */}

          <div
            className={`
              shrink-0
              border-t
              border-[#DCE6F7]
              bg-white
              p-2.5

              sm:p-3
              ${chatStatus === "opening" ? "viki-input-enter" : ""}
              ${chatStatus === "closing" ? "viki-input-animated" : ""}
            `}
          >
            <form
              onSubmit={handleSubmit}
              className="
                flex
                items-end
                gap-1.5
                rounded-2xl
                border
                border-[#DCE6F7]
                bg-[#F7FAFF]
                p-1.5
                focus-within:border-[#0759D9]

                sm:gap-2
              "
            >
              <textarea
                ref={textareaRef}
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

                    if (
                      input.trim() &&
                      !isLoading
                    ) {
                      handleSubmit(
                        event as unknown as FormEvent<HTMLFormElement>
                      );
                    }
                  }
                }}
                placeholder="Ask VIKI anything..."
                rows={1}
                disabled={isLoading}
                className="
                  min-h-[40px]
                  max-h-20
                  flex-1
                  resize-none
                  bg-transparent
                  px-2.5
                  py-2
                  text-sm
                  text-[#071F66]
                  outline-none
                  placeholder:text-slate-400
                  disabled:opacity-60

                  sm:min-h-[42px]
                  sm:max-h-24
                  sm:px-3
                  sm:py-2.5
                "
              />

              <button
                type="submit"
                disabled={
                  !input.trim() ||
                  isLoading
                }
                className={`
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#0759D9]
                  text-white
                  transition
                  hover:bg-[#064FBE]
                  disabled:cursor-not-allowed
                  disabled:opacity-40

                  sm:h-10
                  sm:w-10
                  ${chatStatus === "opening" ? "viki-send-btn-enter" : ""}
                `}
                aria-label="Send message"
              >
                <Send size={16} className="sm:h-[17px] sm:w-[17px]" />
              </button>
            </form>

            <p className="mt-1.5 text-center text-[9px] text-slate-400 sm:mt-2 sm:text-[10px]">
              Powered by i-VANTAGE AI
            </p>
          </div>
        </div>
      )}
    </>
  );
}

