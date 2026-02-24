"use client";

import { useState } from "react";
import { ChatbotTheme } from "@/lib/types";
import { presetThemes, presetThemeNames } from "@/lib/themes";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

interface ThemePickerProps {
  value: ChatbotTheme;
  onChange: (theme: ChatbotTheme) => void;
}

const colorFields: { key: keyof ChatbotTheme; label: string }[] = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "background", label: "Background" },
  { key: "foreground", label: "Text" },
  { key: "chat_bg", label: "Chat Background" },
  { key: "user_bubble", label: "User Bubble" },
  { key: "user_text", label: "User Text" },
  { key: "bot_bubble", label: "Bot Bubble" },
  { key: "bot_text", label: "Bot Text" },
];

export default function ThemePicker({ value, onChange }: ThemePickerProps) {
  const [showCustom, setShowCustom] = useState(value.preset === "custom");

  const selectPreset = (key: string) => {
    const theme = presetThemes[key];
    if (theme) {
      onChange({ ...theme });
      setShowCustom(false);
    }
  };

  const updateColor = (key: keyof ChatbotTheme, color: string) => {
    onChange({ ...value, [key]: color, preset: "custom" });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Color Theme
      </label>

      {/* Preset grid */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {presetThemeNames.map(({ key, label }) => {
          const theme = presetThemes[key];
          const isActive = value.preset === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => selectPreset(key)}
              className={`relative flex flex-col items-center gap-1.5 rounded-lg border-2 p-2 transition-all ${
                isActive
                  ? "border-gray-900 shadow-sm"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* Color preview circles */}
              <div className="flex gap-0.5">
                <div
                  className="h-5 w-5 rounded-full"
                  style={{ backgroundColor: theme.primary }}
                />
                <div
                  className="h-5 w-5 rounded-full"
                  style={{ backgroundColor: theme.bot_bubble }}
                />
              </div>
              <span className="text-xs text-gray-600">{label}</span>
              {isActive && (
                <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-white">
                  <Check size={10} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Custom colors toggle */}
      <button
        type="button"
        onClick={() => setShowCustom(!showCustom)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-3"
      >
        {showCustom ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        Custom colors
      </button>

      {/* Custom color pickers */}
      {showCustom && (
        <div className="grid grid-cols-3 gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
          {colorFields.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2">
              <input
                type="color"
                value={value[key]}
                onChange={(e) => updateColor(key, e.target.value)}
                className="h-8 w-8 cursor-pointer rounded border border-gray-300"
              />
              <span className="text-xs text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Preview strip */}
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-gray-200 p-3">
        <span className="text-xs text-gray-500 mr-2">Preview:</span>
        <div
          className="rounded-lg px-3 py-1.5 text-xs"
          style={{
            backgroundColor: value.user_bubble,
            color: value.user_text,
          }}
        >
          Hello!
        </div>
        <div
          className="rounded-lg px-3 py-1.5 text-xs"
          style={{
            backgroundColor: value.bot_bubble,
            color: value.bot_text,
          }}
        >
          Hi there!
        </div>
      </div>
    </div>
  );
}
