"use client";

import { useState, useCallback, useRef } from "react";
import { ChatMessage, AskTuringSSEData } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

export function useChat(botUuid: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const conversationIdRef = useRef("");
  const tokenRef = useRef("");
  const abortControllerRef = useRef<AbortController | null>(null);
  // messagesRef is the single source of truth — updated synchronously, never inside setMessages updaters
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

      // Update ref synchronously BEFORE any async work
      messagesRef.current = [...messagesRef.current, userMsg, botMsg];
      setMessages([...messagesRef.current]);
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
            token: tokenRef.current || undefined,
          }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error("Stream failed");
        }

        // Extract conversation ID and security token from response headers
        const headerConvId = response.headers.get("x-conversation-id");
        const headerToken = response.headers.get("x-conversation-token");
        if (headerConvId) conversationIdRef.current = headerConvId;
        if (headerToken) tokenRef.current = headerToken;

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
              const data = JSON.parse(jsonStr);

              // Also pick up conversation_id from SSE body as fallback
              if (data.conversation_id && !conversationIdRef.current) {
                conversationIdRef.current = data.conversation_id;
              }

              if (data.message) {
                // Update ref synchronously — append chunk to the bot message
                messagesRef.current = messagesRef.current.map((msg) =>
                  msg.id === botMsgId
                    ? { ...msg, content: msg.content + data.message }
                    : msg
                );
                setMessages([...messagesRef.current]);
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
          messagesRef.current = messagesRef.current.map((msg) =>
            msg.id === botMsgId
              ? {
                  ...msg,
                  content: "Sorry, something went wrong. Please try again.",
                }
              : msg
          );
          setMessages([...messagesRef.current]);
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
    messagesRef.current = [];
    conversationIdRef.current = "";
    tokenRef.current = "";
    setMessages([]);
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
