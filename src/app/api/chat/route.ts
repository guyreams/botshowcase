export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ASKTURING_BASE_URL =
  process.env.NEXT_PUBLIC_ASKTURING_BASE_URL ||
  "https://backend.prod.askturing.ai";

// POST /api/chat — SSE proxy to AskTuring
export async function POST(req: Request) {
  const { bot_id, query, conv_id, chat_history } = await req.json();

  if (!bot_id || !query) {
    return new Response(
      JSON.stringify({ error: "bot_id and query are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const body: Record<string, unknown> = { bot_id, query };
  if (conv_id) {
    body.conv_id = conv_id;
  }
  if (chat_history && Array.isArray(chat_history)) {
    body.chat_history = chat_history;
  }

  // DEBUG: log what we're sending to AskTuring
  console.log("[chat] ➜ AskTuring request:", JSON.stringify({
    conv_id: conv_id || "(none)",
    query,
    chat_history_length: chat_history?.length ?? 0,
    chat_history: chat_history ?? [],
  }, null, 2));

  const upstream = await fetch(
    `${ASKTURING_BASE_URL}/public-interface/external/chat`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!upstream.ok || !upstream.body) {
    return new Response(
      JSON.stringify({ error: "Failed to connect to AskTuring" }),
      { status: upstream.status, headers: { "Content-Type": "application/json" } }
    );
  }

  // Pipe the upstream SSE stream directly through
  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
