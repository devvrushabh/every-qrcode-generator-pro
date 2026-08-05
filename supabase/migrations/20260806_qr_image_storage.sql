-- Migration: 20260806_qr_image_storage.sql
-- Description: Add image_url, short_code, scan_count to qr_codes; create qr_scans table; create qr-images storage bucket & RLS policies

-- 1. Update PROFILES table if missing columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Update QR_CODES table columns for image storage & tracking
ALTER TABLE public.qr_codes ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.qr_codes ADD COLUMN IF NOT EXISTS short_code TEXT UNIQUE;
ALTER TABLE public.qr_codes ADD COLUMN IF NOT EXISTS scan_count INTEGER DEFAULT 0;

-- Create index on short_code for fast dynamic QR redirection
CREATE INDEX IF NOT EXISTS idx_qr_codes_short_code ON public.qr_codes(short_code);

-- 3. Create QR_SCANS Analytics Table
CREATE TABLE IF NOT EXISTS public.qr_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code_id UUID NOT NULL REFERENCES public.qr_codes(id) ON DELETE CASCADE,
  scanned_at TIMESTAMPTZ DEFAULT now(),
  device_type TEXT,
  browser TEXT,
  os TEXT,
  country TEXT,
  city TEXT,
  ip_address TEXT
);

-- Index on qr_scans for dashboard analytics queries
CREATE INDEX IF NOT EXISTS idx_qr_scans_qr_code_id ON public.qr_scans(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_scanned_at ON public.qr_scans(scanned_at DESC);

-- Enable RLS on qr_scans
ALTER TABLE public.qr_scans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for QR_SCANS
DROP POLICY IF EXISTS "Users can view scans for their QR codes" ON public.qr_scans;
CREATE POLICY "Users can view scans for their QR codes"
  ON public.qr_scans FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.qr_codes
      WHERE public.qr_codes.id = public.qr_scans.qr_code_id
        AND public.qr_codes.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Anyone can record a scan event" ON public.qr_scans;
CREATE POLICY "Anyone can record a scan event"
  ON public.qr_scans FOR INSERT
  WITH CHECK (true);

-- 4. Automatic Scan Count Increment Trigger
CREATE OR REPLACE FUNCTION public.handle_scan_increment()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.qr_codes
  SET scan_count = COALESCE(scan_count, 0) + 1,
      updated_at = now()
  WHERE id = NEW.qr_code_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_qr_scanned ON public.qr_scans;
CREATE TRIGGER on_qr_scanned
  AFTER INSERT ON public.qr_scans
  FOR EACH ROW EXECUTE FUNCTION public.handle_scan_increment();

-- 5. STORAGE BUCKETS & RLS POLICIES FOR QR IMAGES
INSERT INTO storage.buckets (id, name, public)
VALUES ('qr-images', 'qr-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('qr-logos', 'qr-logos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for QR-IMAGES bucket
DROP POLICY IF EXISTS "Users can view public qr-images" ON storage.objects;
CREATE POLICY "Users can view public qr-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'qr-images');

DROP POLICY IF EXISTS "Users can upload their own qr-images" ON storage.objects;
CREATE POLICY "Users can upload their own qr-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'qr-images' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can update their own qr-images" ON storage.objects;
CREATE POLICY "Users can update their own qr-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'qr-images' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete their own qr-images" ON storage.objects;
CREATE POLICY "Users can delete their own qr-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'qr-images' AND auth.uid()::text = (storage.foldername(name))[1]);
