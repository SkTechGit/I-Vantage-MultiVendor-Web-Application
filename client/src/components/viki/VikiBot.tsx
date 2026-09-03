
"use client";

import { FormEvent, useEffect, useState } from "react";
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

export default function VikiBot() {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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
   * Show VIKI teaser after 4 seconds.
   *
   * We don't open the chatbot automatically.
   * We only show the small suggestion box.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPromptVisible(true);
    }, 4000);

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
   *
   * Clicking a teaser:
   * 1. closes teaser
   * 2. opens VIKI
   * 3. sends the selected question
   */
  const handlePromptQuestion = async (
    question: string
  ) => {
    if (isLoading) {
      return;
    }

    setIsPromptVisible(false);
    setIsOpen(true);

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
      {/* FLOATING VIKI BUTTON                              */}
      {/* ================================================== */}

      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setIsPromptVisible(false);
          }}
          aria-label="Open VIKI assistant"
          className="
            fixed
            bottom-4
            right-4
            z-[9999]
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
          "
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

      {isOpen && (
        <div
          className="
            fixed
            z-[9999]
            flex
            flex-col
            overflow-hidden
            border
            border-[#DCE6F7]
            bg-[#F7FAFF]
            shadow-[0_20px_70px_rgba(7,31,102,0.22)]

            /* ========================= */
            /* MOBILE                    */
            /* ========================= */

            bottom-3
            left-3
            right-3
            h-[calc(100dvh-140px)]
            max-h-[620px]
            min-h-[430px]
            rounded-2xl

            /* ========================= */
            /* TABLET / DESKTOP          */
            /* ========================= */

            sm:bottom-4
            sm:left-auto
            sm:right-4
            sm:h-[min(680px,calc(100dvh-32px))]
            sm:w-[min(400px,calc(100vw-32px))]
            sm:min-h-0
            sm:rounded-3xl

            /* ========================= */
            /* LARGE DESKTOP             */
            /* ========================= */

            lg:h-[min(720px,calc(100dvh-32px))]
            lg:w-[420px]
          "
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

            <div className="relative flex items-center justify-between">
              {/* VIKI identity */}
              <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                <div
                  className="
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
                  "
                >
                  <Bot
                    size={21}
                    className="text-[#0759D9] sm:h-[25px] sm:w-[25px]"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold sm:text-base">
                      VIKI
                    </h2>

                    <span className="flex items-center gap-1 rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] sm:px-2 sm:text-[10px]">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      Online
                    </span>
                  </div>

                  <p className="truncate text-[10px] text-blue-100 sm:text-xs">
                    i-VANTAGE Business Assistant
                  </p>
                </div>
              </div>

              {/* Header actions */}
              <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
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
                  onClick={() => setIsOpen(false)}
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
              overscroll-contain
              px-3
              py-3

              sm:px-4
              sm:py-5
            "
          >
            {messages.length === 0 ? (
              <div className="flex min-h-full flex-col justify-center">
                {/* Welcome */}
                <div className="mb-4 text-center sm:mb-6">
                  <div
                    className="
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
                    "
                  >
                    <Bot
                      size={25}
                      className="text-[#0759D9] sm:h-8 sm:w-8"
                    />
                  </div>

                  <h3 className="text-lg font-bold text-[#071F66] sm:text-xl">
                    Hello! I&apos;m VIKI 👋
                  </h3>

                  <p className="mx-auto mt-1.5 max-w-[280px] text-xs leading-5 text-slate-500 sm:mt-2 sm:max-w-[300px] sm:text-sm sm:leading-6">
                    Your i-VANTAGE Business Assistant.
                    How can I help you today?
                  </p>
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
                    (action) => (
                      <button
                        key={action.label}
                        type="button"
                        onClick={() =>
                          handleQuickAction(
                            action.question
                          )
                        }
                        disabled={isLoading}
                        className="
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
                        "
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
            className="
              shrink-0
              border-t
              border-[#DCE6F7]
              bg-white
              p-2.5

              sm:p-3
            "
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
                className="
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
                "
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

