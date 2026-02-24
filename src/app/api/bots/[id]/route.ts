import { supabaseAdmin } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/bots/[id] — get a single chatbot
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("chatbots")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

// PUT /api/bots/[id] — update a chatbot
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const updateData: Record<string, unknown> = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.bot_uuid !== undefined) updateData.bot_uuid = body.bot_uuid;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.logo_url !== undefined) updateData.logo_url = body.logo_url;
  if (body.theme !== undefined) updateData.theme = body.theme;

  const { data, error } = await supabaseAdmin
    .from("chatbots")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE /api/bots/[id] — delete a chatbot
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Fetch the bot first to get its logo_url for cleanup
  const { data: bot } = await supabaseAdmin
    .from("chatbots")
    .select("logo_url")
    .eq("id", id)
    .single();

  // Delete the logo from storage if it exists
  if (bot?.logo_url) {
    const path = bot.logo_url.split("/storage/v1/object/public/bot-logos/")[1];
    if (path) {
      await supabaseAdmin.storage.from("bot-logos").remove([path]);
    }
  }

  const { error } = await supabaseAdmin
    .from("chatbots")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
