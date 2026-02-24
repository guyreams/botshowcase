"use client";

import { useState } from "react";
import { Chatbot, ChatbotTheme } from "@/lib/types";
import { useBots } from "@/hooks/useBots";
import BotForm from "@/components/BotForm";
import BotList from "@/components/BotList";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function AdminPage() {
  const { bots, loading, createBot, updateBot, deleteBot } = useBots();
  const [editingBot, setEditingBot] = useState<Chatbot | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = async (data: {
    name: string;
    bot_uuid: string;
    description: string;
    logo_url: string;
    theme: ChatbotTheme;
  }) => {
    if (editingBot) {
      await updateBot(editingBot.id, data);
      setEditingBot(null);
    } else {
      await createBot(data);
    }
  };

  const handleEdit = (bot: Chatbot) => {
    setEditingBot(bot);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (bot: Chatbot) => {
    if (window.confirm(`Delete "${bot.name}"? This cannot be undone.`)) {
      await deleteBot(bot.id);
      if (editingBot?.id === bot.id) {
        setEditingBot(null);
      }
    }
  };

  const handleCancel = () => {
    setEditingBot(null);
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--at-bg-warm)" }}>
      {/* Header */}
      <header
        className="border-b"
        style={{ backgroundColor: "var(--at-bg-white)", borderColor: "var(--at-border)" }}
      >
        <div className="mx-auto max-w-3xl flex items-center gap-4 px-4 py-4">
          <Link
            href="/"
            className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-100"
            style={{ color: "var(--at-text-muted)" }}
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Image
                src="/askturing-icon.png"
                alt="AskTuring"
                width={28}
                height={28}
                className="h-7 w-7"
              />
              <div>
                <h1
                  className="text-lg font-semibold"
                  style={{ color: "var(--at-text-dark)" }}
                >
                  Bot Administration
                </h1>
                <p className="text-sm" style={{ color: "var(--at-text-muted)" }}>
                  Create and manage your AI assistants
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 space-y-8">
        {/* Form */}
        {showForm && (
          <div
            className="rounded-2xl border bg-white p-6"
            style={{ borderColor: "var(--at-border)" }}
          >
            <BotForm
              key={editingBot?.id || "new"}
              bot={editingBot}
              onSubmit={handleSubmit}
              onCancel={editingBot ? handleCancel : undefined}
            />
          </div>
        )}

        {/* Bot List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-t-2"
              style={{
                borderColor: "var(--at-border)",
                borderTopColor: "var(--at-maroon)",
              }}
            />
          </div>
        ) : (
          <BotList bots={bots} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </main>
  );
}
