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
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-500">No bots yet. Create your first one above.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Existing Bots ({bots.length})
      </h2>
      <div className="space-y-3">
        {bots.map((bot) => (
          <div
            key={bot.id}
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4"
          >
            {/* Logo */}
            <div
              className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg"
              style={{ backgroundColor: bot.theme.primary + "15" }}
            >
              <Image
                src={bot.logo_url || "/placeholder-bot.svg"}
                alt={bot.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {bot.name}
              </h3>
              <p className="text-xs text-gray-500 font-mono truncate">
                {bot.bot_uuid}
              </p>
            </div>

            {/* Theme indicator */}
            <div className="flex gap-1 shrink-0">
              <div
                className="h-4 w-4 rounded-full border border-gray-200"
                style={{ backgroundColor: bot.theme.primary }}
                title={`Theme: ${bot.theme.preset}`}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => onEdit(bot)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                title="Edit"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => onDelete(bot)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
