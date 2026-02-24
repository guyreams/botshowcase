"use client";

import { useState, useEffect, useCallback } from "react";
import { Chatbot, ChatbotTheme } from "@/lib/types";

interface CreateBotInput {
  name: string;
  bot_uuid: string;
  description?: string;
  logo_url?: string;
  theme?: ChatbotTheme;
}

interface UpdateBotInput {
  name?: string;
  bot_uuid?: string;
  description?: string;
  logo_url?: string;
  theme?: ChatbotTheme;
}

export function useBots() {
  const [bots, setBots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshBots = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bots");
      if (res.ok) {
        const data = await res.json();
        setBots(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshBots();
  }, [refreshBots]);

  const createBot = async (input: CreateBotInput): Promise<Chatbot | null> => {
    const res = await fetch("/api/bots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create bot");
    }

    const bot = await res.json();
    await refreshBots();
    return bot;
  };

  const updateBot = async (
    id: string,
    input: UpdateBotInput
  ): Promise<Chatbot | null> => {
    const res = await fetch(`/api/bots/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update bot");
    }

    const bot = await res.json();
    await refreshBots();
    return bot;
  };

  const deleteBot = async (id: string): Promise<void> => {
    const res = await fetch(`/api/bots/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to delete bot");
    }

    await refreshBots();
  };

  return { bots, loading, createBot, updateBot, deleteBot, refreshBots };
}
