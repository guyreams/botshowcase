"use client";

import { useState, useCallback, useRef } from "react";
import { ChatMessage, AskTuringSSEData } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

export function useChat(botUuid: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const conversationIdRef = useRef("");
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

      // Build chat history from completed messages (exclude any empty bot placeholders)
      const chatHistory = [...messagesRef.current, userMsg]
        .filter((msg) => msg.content.trim() !== "")
        .map((msg) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        }));

      // DEBUG: log what the client is sending
      console.log("[useChat] messagesRef contents:", messagesRef.current.map(m => ({ role: m.role, contentLen: m.content.length, contentPreview: m.content.slice(0, 50) })));
      console.log("[useChat] chatHistory being sent:", chatHistory.length, "entries");
      console.log("[useChat] conv_id being sent:", conversationIdRef.current || "(none)");

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

              // DEBUG: log first SSE chunk to see full shape
              if (data.conversation_id && !conversationIdRef.current) {
                console.log("[useChat] SSE first chunk (raw):", jsonStr);
                console.log("[useChat] conversation_id received:", data.conversation_id);
              }

              if (data.conversation_id) {
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
        // DEBUG: log final state of ref after streaming
        console.log("[useChat] after streaming, messagesRef contents:", messagesRef.current.map(m => ({ role: m.role, contentLen: m.content.length })));
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
