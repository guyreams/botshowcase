"use client";

import { useState } from "react";
import { Chatbot, ChatbotTheme } from "@/lib/types";
import { useBots } from "@/hooks/useBots";
import BotForm from "@/components/BotForm";
import BotList from "@/components/BotList";
import Link from "next/link";
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
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-3xl flex items-center gap-4 px-4 py-4">
          <Link
            href="/"
            className="flex items-center justify-center rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Bot Administration
            </h1>
            <p className="text-sm text-gray-500">
              Create and manage your chatbots
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 space-y-8">
        {/* Form */}
        {showForm && (
          <div className="rounded-xl border border-gray-200 bg-white p-6">
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
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          </div>
        ) : (
          <BotList bots={bots} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </main>
  );
}
