"use client";

import { ChatMessage as ChatMessageType } from "@/lib/types";

interface ChatMessageProps {
  message: ChatMessageType;
  isStreaming?: boolean;
}

export default function ChatMessage({
  message,
  isStreaming,
}: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser ? "rounded-br-md" : "rounded-bl-md"
        } ${isStreaming && !isUser && message.content === "" ? "animate-pulse" : ""}`}
        style={{
          backgroundColor: isUser
            ? "var(--theme-user-bubble)"
            : "var(--theme-bot-bubble)",
          color: isUser
            ? "var(--theme-user-text)"
            : "var(--theme-bot-text)",
        }}
      >
        <p
          className={`text-sm leading-relaxed whitespace-pre-wrap ${
            isStreaming && !isUser ? "streaming-cursor" : ""
          }`}
        >
          {message.content || (isStreaming ? "" : "...")}
        </p>
      </div>
    </div>
  );
}
