import { supabaseAdmin } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/bots — list all chatbots
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("chatbots")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/bots — create a new chatbot
export async function POST(req: Request) {
  const body = await req.json();

  if (!body.name || !body.bot_uuid) {
    return NextResponse.json(
      { error: "name and bot_uuid are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("chatbots")
    .insert({
      name: body.name,
      bot_uuid: body.bot_uuid,
      description: body.description || "",
      logo_url: body.logo_url || "",
      theme: body.theme || undefined,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
