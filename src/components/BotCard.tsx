"use client";

import Image from "next/image";
import Link from "next/link";
import { Chatbot } from "@/lib/types";
import { MessageCircle } from "lucide-react";

export default function BotCard({ bot }: { bot: Chatbot }) {
  return (
    <Link href={`/chat/${bot.id}`} className="group block">
      <div
        className="relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
        style={{ borderColor: "var(--at-border)" }}
      >
        {/* Top accent bar */}
        <div
          className="h-1 transition-all duration-200 group-hover:h-1.5"
          style={{ backgroundColor: bot.theme.primary }}
        />

        <div className="p-6">
          {/* Logo */}
          <div className="mb-4 flex justify-center">
            <div
              className="relative h-20 w-20 overflow-hidden rounded-2xl border"
              style={{
                borderColor: "var(--at-border-light)",
                backgroundColor: bot.theme.primary + "08",
              }}
            >
              <Image
                src={bot.logo_url || "/askturing-icon.png"}
                alt={bot.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          </div>

          {/* Name */}
          <h3
            className="text-center text-base font-semibold"
            style={{ color: "var(--at-text-dark)" }}
          >
            {bot.name}
          </h3>

          {/* Description */}
          {bot.description && (
            <p
              className="mt-1.5 text-center text-sm line-clamp-2"
              style={{ color: "var(--at-text-muted)" }}
            >
              {bot.description}
            </p>
          )}

          {/* Chat button */}
          <div
            className="mt-5 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition-all duration-200 group-hover:opacity-90"
            style={{
              backgroundColor: bot.theme.primary,
              color: "#ffffff",
            }}
          >
            <MessageCircle size={15} />
            Start chatting
          </div>
        </div>
      </div>
    </Link>
  );
}
