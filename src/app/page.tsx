import { supabaseAdmin } from "@/lib/supabase/server";
import BotGrid from "@/components/BotGrid";
import { Chatbot } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { Settings } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data: bots } = await supabaseAdmin
    .from("chatbots")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--at-bg-warm)" }}>
      {/* Header */}
      <header className="border-b" style={{ backgroundColor: "var(--at-bg-white)", borderColor: "var(--at-border)" }}>
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/askturing-logo.png"
              alt="AskTuring"
              width={180}
              height={35}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors"
            style={{
              backgroundColor: "var(--at-maroon)",
              color: "white",
            }}
          >
            <Settings size={15} />
            Admin
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="py-12 px-4 text-center" style={{ backgroundColor: "var(--at-bg-white)" }}>
        <h1
          className="text-3xl sm:text-4xl font-light tracking-tight"
          style={{ color: "var(--at-text-heading)" }}
        >
          Explore Our{" "}
          <span className="font-semibold" style={{ color: "var(--at-maroon)" }}>
            AI Assistants
          </span>
        </h1>
        <p
          className="mt-3 text-base max-w-xl mx-auto"
          style={{ color: "var(--at-text-muted)" }}
        >
          Choose a bot below to start a conversation. Each assistant is powered by AskTuring
          with specialized knowledge and personality.
        </p>
      </div>

      {/* Bot Grid */}
      <div className="py-8">
        <BotGrid bots={(bots as Chatbot[]) || []} />
      </div>

      {/* Footer */}
      <footer
        className="border-t py-6 text-center"
        style={{ backgroundColor: "var(--at-bg-white)", borderColor: "var(--at-border)" }}
      >
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm" style={{ color: "var(--at-text-muted)" }}>
            Powered by
          </span>
          <Image
            src="/askturing-logo.png"
            alt="AskTuring"
            width={100}
            height={20}
            className="h-4 w-auto opacity-60"
          />
        </div>
      </footer>
    </main>
  );
}
