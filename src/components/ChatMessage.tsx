"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
  const content = message.content || (isStreaming ? "" : "...");

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
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        ) : (
          <div
            className={`chat-markdown text-sm leading-relaxed ${
              isStreaming ? "streaming-cursor" : ""
            }`}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
