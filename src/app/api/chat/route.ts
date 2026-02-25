export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ASKTURING_BASE_URL =
  process.env.NEXT_PUBLIC_ASKTURING_BASE_URL ||
  "https://backend.prod.askturing.ai";

// POST /api/chat — SSE proxy to AskTuring
export async function POST(req: Request) {
  const { bot_id, query, conv_id, token } = await req.json();

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
  if (token) {
    body.token = token;
  }

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

  // Forward the conversation headers from AskTuring so the client can read them
  const responseHeaders: Record<string, string> = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  };

  const convId = upstream.headers.get("x-conversation-id");
  const convToken = upstream.headers.get("x-conversation-token");
  if (convId) responseHeaders["x-conversation-id"] = convId;
  if (convToken) responseHeaders["x-conversation-token"] = convToken;

  return new Response(upstream.body, {
    status: 200,
    headers: responseHeaders,
  });
}
