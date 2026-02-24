"use client";

import { Chatbot } from "@/lib/types";
import BotCard from "./BotCard";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function BotGrid({ bots }: { bots: Chatbot[] }) {
  if (bots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div
          className="h-16 w-16 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: "var(--at-maroon)" + "10" }}
        >
          <Plus size={28} style={{ color: "var(--at-maroon)" }} />
        </div>
        <p className="text-lg" style={{ color: "var(--at-text-heading)" }}>
          No bots yet
        </p>
        <p className="mt-1 text-sm" style={{ color: "var(--at-text-muted)" }}>
          Create your first AI assistant to get started.
        </p>
        <Link
          href="/admin"
          className="mt-5 rounded-full px-6 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: "var(--at-maroon)" }}
        >
          Add your first bot
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {bots.map((bot) => (
          <BotCard key={bot.id} bot={bot} />
        ))}
      </div>
    </div>
  );
}
