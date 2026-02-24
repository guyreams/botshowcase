export interface ChatbotTheme {
  preset: string;
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  chat_bg: string;
  user_bubble: string;
  user_text: string;
  bot_bubble: string;
  bot_text: string;
}

export interface Chatbot {
  id: string;
  name: string;
  bot_uuid: string;
  description: string;
  logo_url: string;
  theme: ChatbotTheme;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

export interface AskTuringSSEData {
  conversation_id: string;
  message: string;
  stream_end: boolean;
}
