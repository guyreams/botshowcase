-- ============================================================
-- BotShowcase: Supabase Setup SQL
-- Run this in your Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- 1. Create the chatbots table
CREATE TABLE public.chatbots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  bot_uuid TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  theme JSONB NOT NULL DEFAULT '{
    "preset": "default",
    "primary": "#6366f1",
    "secondary": "#818cf8",
    "background": "#ffffff",
    "foreground": "#1f2937",
    "chat_bg": "#f3f4f6",
    "user_bubble": "#6366f1",
    "user_text": "#ffffff",
    "bot_bubble": "#e5e7eb",
    "bot_text": "#1f2937"
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE public.chatbots ENABLE ROW LEVEL SECURITY;

-- 3. RLS policies (open access — no auth for now)
CREATE POLICY "Anyone can read chatbots"
  ON public.chatbots FOR SELECT USING (true);

CREATE POLICY "Anyone can insert chatbots"
  ON public.chatbots FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update chatbots"
  ON public.chatbots FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can delete chatbots"
  ON public.chatbots FOR DELETE USING (true);

-- 4. Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER chatbots_updated_at
  BEFORE UPDATE ON public.chatbots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 5. Seed the first bot: Alice in Wonderland
INSERT INTO public.chatbots (name, bot_uuid, description, theme)
VALUES (
  'Alice in Wonderland',
  'ae3fa1fb-ceb6-40f0-9ae5-ad80f9119e78',
  'Chat with Alice from Wonderland! Curious, whimsical, and always ready for an adventure.',
  '{
    "preset": "wonderland",
    "primary": "#7c3aed",
    "secondary": "#a78bfa",
    "background": "#faf5ff",
    "foreground": "#1e1b4b",
    "chat_bg": "#f5f3ff",
    "user_bubble": "#7c3aed",
    "user_text": "#ffffff",
    "bot_bubble": "#ede9fe",
    "bot_text": "#1e1b4b"
  }'::jsonb
);

-- ============================================================
-- Storage: After running the above, do this manually in the
-- Supabase Dashboard > Storage:
--
-- 1. Click "New bucket"
-- 2. Name: bot-logos
-- 3. Toggle "Public bucket" ON
-- 4. Click "Create bucket"
--
-- Then run the storage policies below:
-- ============================================================

-- 6. Storage RLS policies for bot-logos bucket
CREATE POLICY "Public read bot logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'bot-logos');

CREATE POLICY "Public upload bot logos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'bot-logos');

CREATE POLICY "Public update bot logos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'bot-logos')
  WITH CHECK (bucket_id = 'bot-logos');

CREATE POLICY "Public delete bot logos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'bot-logos');
