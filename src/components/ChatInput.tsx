"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Square } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isStreaming: boolean;
}

export default function ChatInput({
  onSend,
  onStop,
  isStreaming,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() && !isStreaming) {
      onSend(input.trim());
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className="border-t px-4 py-3"
      style={{
        borderColor: "var(--theme-bot-bubble)",
        backgroundColor: "var(--theme-background)",
      }}
    >
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 resize-none rounded-full border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2"
          style={{
            borderColor: "var(--theme-bot-bubble)",
            color: "var(--theme-foreground)",
            backgroundColor: "var(--theme-background)",
            // @ts-expect-error CSS custom property
            "--tw-ring-color": "var(--theme-primary)",
          }}
          disabled={isStreaming}
        />
        {isStreaming ? (
          <button
            onClick={onStop}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-colors"
            style={{ backgroundColor: "var(--theme-primary)" }}
            title="Stop generating"
          >
            <Square size={14} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-colors disabled:opacity-40"
            style={{ backgroundColor: "var(--theme-primary)" }}
            title="Send message"
          >
            <Send size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
