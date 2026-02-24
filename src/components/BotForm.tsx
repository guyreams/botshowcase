"use client";

import { useState } from "react";
import { Chatbot, ChatbotTheme } from "@/lib/types";
import { presetThemes } from "@/lib/themes";
import LogoUpload from "./LogoUpload";
import ThemePicker from "./ThemePicker";

interface BotFormProps {
  bot?: Chatbot | null;
  onSubmit: (data: {
    name: string;
    bot_uuid: string;
    description: string;
    logo_url: string;
    theme: ChatbotTheme;
  }) => Promise<void>;
  onCancel?: () => void;
}

export default function BotForm({ bot, onSubmit, onCancel }: BotFormProps) {
  const [name, setName] = useState(bot?.name || "");
  const [botUuid, setBotUuid] = useState(bot?.bot_uuid || "");
  const [description, setDescription] = useState(bot?.description || "");
  const [logoUrl, setLogoUrl] = useState(bot?.logo_url || "");
  const [theme, setTheme] = useState<ChatbotTheme>(
    bot?.theme || { ...presetThemes.default }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!botUuid.trim()) {
      setError("Bot UUID is required");
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        name: name.trim(),
        bot_uuid: botUuid.trim(),
        description: description.trim(),
        logo_url: logoUrl,
        theme,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save bot");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-900">
        {bot ? "Edit Bot" : "Create New Bot"}
      </h2>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Alice in Wonderland"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          required
        />
      </div>

      {/* Bot UUID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          AskTuring Public Interface UUID *
        </label>
        <input
          type="text"
          value={botUuid}
          onChange={(e) => setBotUuid(e.target.value)}
          placeholder="e.g. ae3fa1fb-ceb6-40f0-9ae5-ad80f9119e78"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A brief description of what this bot does..."
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
        />
      </div>

      {/* Logo Upload */}
      <LogoUpload value={logoUrl} onChange={setLogoUrl} />

      {/* Theme Picker */}
      <ThemePicker value={theme} onChange={setTheme} />

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-indigo-500 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : bot ? "Update Bot" : "Create Bot"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
