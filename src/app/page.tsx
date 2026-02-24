import { supabaseAdmin } from "@/lib/supabase/server";
import BotGrid from "@/components/BotGrid";
import { Chatbot } from "@/lib/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data: bots } = await supabaseAdmin
    .from("chatbots")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="py-8 px-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">BotShowcase</h1>
            <p className="mt-1 text-gray-500">Choose a bot to chat with</p>
          </div>
          <Link
            href="/admin"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Admin
          </Link>
        </div>
      </header>
      <BotGrid bots={(bots as Chatbot[]) || []} />
    </main>
  );
}
