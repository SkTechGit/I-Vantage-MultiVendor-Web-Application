"use client";

import { useCallback, useState } from "react";

export type VikiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
};

function generateUUID(): string {
  if (
    typeof window !== "undefined" &&
    typeof window.crypto !== "undefined" &&
    typeof window.crypto.randomUUID === "function"
  ) {
    return window.crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function createSessionId() {
  return generateUUID();
}

export function useVikiChat() {
  const [messages, setMessages] = useState<VikiMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [sessionId, setSessionId] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try {
      const storedSession = localStorage.getItem("viki_session_id");
      if (storedSession) {
        return storedSession;
      }
      const newSession = createSessionId();
      localStorage.setItem("viki_session_id", newSession);
      return newSession;
    } catch {
      return "";
    }
  });

  const sendMessage = useCallback(
    async (message: string) => {
      const trimmedMessage = message.trim();

      if (!trimmedMessage || isLoading || !sessionId) {
        return;
      }

      const userMessage: VikiMessage = {
        id: generateUUID(),
        role: "user",
        content: trimmedMessage,
      };

      setMessages((previous) => [...previous, userMessage]);
      setIsLoading(true);

      try {
        const response = await fetch("/viki", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: sessionId,
            message: trimmedMessage,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "VIKI request failed");
        }

        const cleanSuggestions = Array.isArray(data.suggestions)
          ? data.suggestions.filter(
              (item: unknown): item is string =>
                typeof item === "string" && item.trim().length > 0
            )
          : [];

        const assistantMessage: VikiMessage = {
          id: generateUUID(),
          role: "assistant",
          content: data.response || "",
          suggestions: cleanSuggestions,
        };

        setMessages((previous) => [
          ...previous,
          assistantMessage,
        ]);
      } catch (error) {
        console.error("VIKI chat error:", error);

        const errorMessage: VikiMessage = {
          id: generateUUID(),
          role: "assistant",
          content:
            "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
          suggestions: [],
        };

        setMessages((previous) => [
          ...previous,
          errorMessage,
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, sessionId]
  );

  const clearConversation = useCallback(() => {
    const newSession = createSessionId();

    localStorage.setItem("viki_session_id", newSession);

    setSessionId(newSession);
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearConversation,
  };
}