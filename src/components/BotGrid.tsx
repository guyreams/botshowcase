"use client";

import { Chatbot } from "@/lib/types";
import BotCard from "./BotCard";
import Link from "next/link";

export default function BotGrid({ bots }: { bots: Chatbot[] }) {
  if (bots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-gray-500">No chatbots yet.</p>
        <Link
          href="/admin"
          className="mt-4 rounded-lg bg-indigo-500 px-6 py-2 text-white hover:bg-indigo-600 transition-colors"
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
