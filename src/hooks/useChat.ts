"use client";

import { useState, useCallback, useRef } from "react";
import { ChatMessage, AskTuringSSEData } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

export function useChat(botUuid: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const conversationIdRef = useRef("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);

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

      // Build chat history from completed messages (exclude the empty bot placeholder)
      const chatHistory = [...messagesRef.current, userMsg].map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      }));

      setMessages((prev) => {
        const next = [...prev, userMsg, botMsg];
        messagesRef.current = next;
        return next;
      });
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
            conv_id: conversationIdRef.current || undefined,
            chat_history: chatHistory,
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
                conversationIdRef.current = data.conversation_id;
              }

              if (data.message) {
                setMessages((prev) => {
                  const next = prev.map((msg) =>
                    msg.id === botMsgId
                      ? { ...msg, content: msg.content + data.message }
                      : msg
                  );
                  messagesRef.current = next;
                  return next;
                });
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
          setMessages((prev) => {
            const next = prev.map((msg) =>
              msg.id === botMsgId
                ? {
                    ...msg,
                    content:
                      "Sorry, something went wrong. Please try again.",
                  }
                : msg
            );
            messagesRef.current = next;
            return next;
          });
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [botUuid, isStreaming]
  );

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    messagesRef.current = [];
    conversationIdRef.current = "";
  }, []);

  return {
    messages,
    isStreaming,
    conversationId: conversationIdRef.current,
    sendMessage,
    stopStreaming,
    clearMessages,
  };
}
