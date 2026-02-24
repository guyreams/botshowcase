"use client";

import { useEffect, useRef } from "react";
import { Chatbot, ChatMessage as ChatMessageType } from "@/lib/types";
import { useChat } from "@/hooks/useChat";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export default function ChatInterface({ bot }: { bot: Chatbot }) {
  const { messages, isStreaming, sendMessage, stopStreaming, clearMessages } =
    useChat(bot.bot_uuid);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Build display messages: initial greeting + conversation
  const initialMessage: ChatMessageType = {
    id: "initial",
    role: "bot",
    content: `Hi! I'm ${bot.name}. ${bot.description || "How can I help you today?"}`,
    timestamp: new Date(),
  };

  const displayMessages = [initialMessage, ...messages];

  return (
    <div
      className="flex h-screen flex-col"
      style={{ backgroundColor: "var(--theme-background)" }}
    >
      {/* Header */}
      <header
        className="flex items-center gap-3 px-4 py-3 shadow-sm"
        style={{
          backgroundColor: "var(--theme-primary)",
        }}
      >
        <Link
          href="/"
          className="flex items-center justify-center rounded-full p-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>

        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-white/20">
          <Image
            src={bot.logo_url || "/askturing-icon.png"}
            alt={bot.name}
            fill
            className="object-cover"
            sizes="32px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-white truncate">
            {bot.name}
          </h1>
        </div>

        <button
          onClick={() => {
            clearMessages();
          }}
          className="flex items-center justify-center rounded-full p-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          title="New conversation"
        >
          <RotateCcw size={16} />
        </button>
      </header>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-6"
        style={{ backgroundColor: "var(--theme-chat-bg)" }}
      >
        <div className="mx-auto max-w-3xl">
          {displayMessages.map((msg, index) => (
            <ChatMessage
              key={msg.id || uuidv4()}
              message={msg}
              isStreaming={
                isStreaming && index === displayMessages.length - 1 && msg.role === "bot"
              }
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        onStop={stopStreaming}
        isStreaming={isStreaming}
      />
    </div>
  );
}
