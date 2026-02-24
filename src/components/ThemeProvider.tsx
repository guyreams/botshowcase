"use client";

import { createContext, useContext } from "react";
import { ChatbotTheme } from "@/lib/types";

const ThemeContext = createContext<ChatbotTheme | null>(null);
export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({
  theme,
  children,
}: {
  theme: ChatbotTheme;
  children: React.ReactNode;
}) {
  const style = {
    "--theme-primary": theme.primary,
    "--theme-secondary": theme.secondary,
    "--theme-background": theme.background,
    "--theme-foreground": theme.foreground,
    "--theme-chat-bg": theme.chat_bg,
    "--theme-user-bubble": theme.user_bubble,
    "--theme-user-text": theme.user_text,
    "--theme-bot-bubble": theme.bot_bubble,
    "--theme-bot-text": theme.bot_text,
  } as React.CSSProperties;

  return (
    <ThemeContext.Provider value={theme}>
      <div style={style} className="contents">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
