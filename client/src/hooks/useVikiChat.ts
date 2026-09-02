"use client";

import { useCallback, useEffect, useState } from "react";

export type VikiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function createSessionId() {
  return crypto.randomUUID();
}

export function useVikiChat() {
  const [messages, setMessages] = useState<VikiMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const storedSession = localStorage.getItem("viki_session_id");

    if (storedSession) {
      setSessionId(storedSession);
    } else {
      const newSession = createSessionId();

      localStorage.setItem("viki_session_id", newSession);
      setSessionId(newSession);
    }
  }, []);

  const sendMessage = useCallback(
    async (message: string) => {
      const trimmedMessage = message.trim();

      if (!trimmedMessage || isLoading || !sessionId) {
        return;
      }

      const userMessage: VikiMessage = {
        id: crypto.randomUUID(),
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

        const assistantMessage: VikiMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.response,
        };

        setMessages((previous) => [
          ...previous,
          assistantMessage,
        ]);
      } catch (error) {
        console.error("VIKI chat error:", error);

        const errorMessage: VikiMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
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