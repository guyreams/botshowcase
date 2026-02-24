"use client";

import Image from "next/image";
import Link from "next/link";
import { Chatbot } from "@/lib/types";

export default function BotCard({ bot }: { bot: Chatbot }) {
  return (
    <Link href={`/chat/${bot.id}`} className="group block">
      <div
        className="relative overflow-hidden rounded-2xl border-2 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
        style={{ borderColor: bot.theme.primary + "40" }}
      >
        {/* Accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1 transition-all duration-200 group-hover:h-1.5"
          style={{ backgroundColor: bot.theme.primary }}
        />

        {/* Logo */}
        <div className="mb-4 flex justify-center">
          <div
            className="relative h-24 w-24 overflow-hidden rounded-xl"
            style={{ backgroundColor: bot.theme.primary + "15" }}
          >
            <Image
              src={bot.logo_url || "/placeholder-bot.svg"}
              alt={bot.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        </div>

        {/* Name */}
        <h3
          className="text-center text-lg font-semibold"
          style={{ color: bot.theme.foreground }}
        >
          {bot.name}
        </h3>

        {/* Description */}
        {bot.description && (
          <p className="mt-2 text-center text-sm text-gray-500 line-clamp-2">
            {bot.description}
          </p>
        )}

        {/* Chat prompt */}
        <div
          className="mt-4 rounded-lg px-4 py-2 text-center text-sm font-medium transition-colors duration-200"
          style={{
            backgroundColor: bot.theme.primary + "10",
            color: bot.theme.primary,
          }}
        >
          Start chatting
        </div>
      </div>
    </Link>
  );
}
