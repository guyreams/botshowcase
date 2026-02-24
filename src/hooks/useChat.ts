"use client";

import { useState, useCallback, useRef } from "react";
import { ChatMessage, AskTuringSSEData } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

export function useChat(botUuid: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (query: string) => {
      if (!query.trim() || isStreaming) return;

      // Add user message
      const userMsg: ChatMessage = {
        id: uuidv4(),
        role: "user",
        content: query,
        timestamp: new Date(),
      };

      // Add placeholder bot message for streaming
      const botMsgId = uuidv4();
      const botMsg: ChatMessage = {
        id: botMsgId,
        role: "bot",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg, botMsg]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bot_id: botUuid,
            query,
            conv_id: conversationId,
          }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error("Stream failed");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;

            try {
              const data: AskTuringSSEData = JSON.parse(jsonStr);

              if (data.conversation_id) {
                setConversationId(data.conversation_id);
              }

              if (data.message) {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMsgId
                      ? { ...msg, content: msg.content + data.message }
                      : msg
                  )
                );
              }

              if (data.stream_end) {
                break;
              }
            } catch {
              // Skip malformed JSON chunks
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMsgId
                ? {
                    ...msg,
                    content:
                      "Sorry, something went wrong. Please try again.",
                  }
                : msg
            )
          );
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [botUuid, conversationId, isStreaming]
  );

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setConversationId("");
  }, []);

  return {
    messages,
    isStreaming,
    conversationId,
    sendMessage,
    stopStreaming,
    clearMessages,
  };
}
