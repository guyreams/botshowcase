"use client";

import { Chatbot } from "@/lib/types";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";

interface BotListProps {
  bots: Chatbot[];
  onEdit: (bot: Chatbot) => void;
  onDelete: (bot: Chatbot) => void;
}

export default function BotList({ bots, onEdit, onDelete }: BotListProps) {
  if (bots.length === 0) {
    return (
      <div
        className="rounded-2xl border p-8 text-center"
        style={{
          borderColor: "var(--at-border)",
          backgroundColor: "var(--at-bg-white)",
        }}
      >
        <p style={{ color: "var(--at-text-muted)" }}>
          No bots yet. Create your first one above.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2
        className="text-lg font-semibold mb-4"
        style={{ color: "var(--at-text-dark)" }}
      >
        Existing Bots ({bots.length})
      </h2>
      <div className="space-y-3">
        {bots.map((bot) => (
          <div
            key={bot.id}
            className="flex items-center gap-4 rounded-xl border bg-white p-4"
            style={{ borderColor: "var(--at-border)" }}
          >
            {/* Logo */}
            <div
              className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl"
              style={{ backgroundColor: bot.theme.primary + "15" }}
            >
              <Image
                src={bot.logo_url || "/askturing-icon.png"}
                alt={bot.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3
                className="text-sm font-semibold truncate"
                style={{ color: "var(--at-text-dark)" }}
              >
                {bot.name}
              </h3>
              <p
                className="text-xs font-mono truncate"
                style={{ color: "var(--at-text-muted)" }}
              >
                {bot.bot_uuid}
              </p>
            </div>

            {/* Theme indicator */}
            <div className="flex gap-1 shrink-0">
              <div
                className="h-4 w-4 rounded-full border"
                style={{
                  backgroundColor: bot.theme.primary,
                  borderColor: "var(--at-border)",
                }}
                title={`Theme: ${bot.theme.preset}`}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => onEdit(bot)}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
                style={{ color: "var(--at-text-muted)" }}
                title="Edit"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => onDelete(bot)}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-red-50 hover:text-red-500"
                style={{ color: "var(--at-text-muted)" }}
                title="Delete"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
