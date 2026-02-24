import { supabaseAdmin } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ThemeProvider from "@/components/ThemeProvider";
import ChatInterface from "@/components/ChatInterface";
import { Chatbot } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: bot } = await supabaseAdmin
    .from("chatbots")
    .select("*")
    .eq("id", id)
    .single();

  if (!bot) notFound();

  return (
    <ThemeProvider theme={(bot as Chatbot).theme}>
      <ChatInterface bot={bot as Chatbot} />
    </ThemeProvider>
  );
}
