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
      <h2
        className="text-lg font-semibold"
        style={{ color: "var(--at-text-dark)" }}
      >
        {bot ? "Edit Bot" : "Create New Bot"}
      </h2>

      {error && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{
            backgroundColor: "#9F2F3110",
            border: "1px solid #9F2F3130",
            color: "#9F2F31",
          }}
        >
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label
          className="block text-sm font-medium mb-1"
          style={{ color: "var(--at-text-heading)" }}
        >
          Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Alice in Wonderland"
          className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2"
          style={{
            borderColor: "var(--at-border)",
            // @ts-expect-error CSS custom property
            "--tw-ring-color": "var(--at-maroon)",
          }}
          required
        />
      </div>

      {/* Bot UUID */}
      <div>
        <label
          className="block text-sm font-medium mb-1"
          style={{ color: "var(--at-text-heading)" }}
        >
          AskTuring Public Interface UUID *
        </label>
        <input
          type="text"
          value={botUuid}
          onChange={(e) => setBotUuid(e.target.value)}
          placeholder="e.g. ae3fa1fb-ceb6-40f0-9ae5-ad80f9119e78"
          className="w-full rounded-xl border px-3 py-2.5 text-sm font-mono outline-none focus:ring-2"
          style={{
            borderColor: "var(--at-border)",
            // @ts-expect-error CSS custom property
            "--tw-ring-color": "var(--at-maroon)",
          }}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label
          className="block text-sm font-medium mb-1"
          style={{ color: "var(--at-text-heading)" }}
        >
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A brief description of what this bot does..."
          rows={2}
          className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 resize-none"
          style={{
            borderColor: "var(--at-border)",
            // @ts-expect-error CSS custom property
            "--tw-ring-color": "var(--at-maroon)",
          }}
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
          className="rounded-full px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50 transition-colors hover:opacity-90"
          style={{ backgroundColor: "var(--at-maroon)" }}
        >
          {saving ? "Saving..." : bot ? "Update Bot" : "Create Bot"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
            style={{
              borderColor: "var(--at-border)",
              color: "var(--at-text-heading)",
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
