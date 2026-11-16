-- Supabase RLS Lockdown for Archival Field Guide
-- Run this in your Supabase Dashboard -> SQL Editor
--
-- 1. Enable Row Level Security on both tables
ALTER TABLE public.spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_guide_cities ENABLE ROW LEVEL SECURITY;

-- 2. Drop any existing permissive "allow all" policies
DROP POLICY IF EXISTS "Allow public all" ON public.spots;
DROP POLICY IF EXISTS "Allow public access" ON public.spots;
DROP POLICY IF EXISTS "Enable all access for all users" ON public.spots;
DROP POLICY IF EXISTS "Allow public all" ON public.field_guide_cities;
DROP POLICY IF EXISTS "Allow public access" ON public.field_guide_cities;
DROP POLICY IF EXISTS "Enable all access for all users" ON public.field_guide_cities;

-- 3. Read access:
--    Option A (Recommended if you use ?guide= shared links for friends):
--      Allow anyone to read spots and cities, while locking all writes to your authenticated account.
DROP POLICY IF EXISTS "Public read spots" ON public.spots;
CREATE POLICY "Public read spots"
  ON public.spots FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public read cities" ON public.field_guide_cities;
CREATE POLICY "Public read cities"
  ON public.field_guide_cities FOR SELECT
  USING (true);

--    Option B (If you want the database completely private — comment out Option A above and uncomment below):
-- CREATE POLICY "Authenticated read spots"
--   ON public.spots FOR SELECT
--   USING (auth.role() = 'authenticated');
-- CREATE POLICY "Authenticated read cities"
--   ON public.field_guide_cities FOR SELECT
--   USING (auth.role() = 'authenticated');

-- 4. Write access (INSERT / UPDATE / DELETE):
--    IMPORTANT: Because archival, field-guide, closet-app, and your recipe app
--    share this Supabase project, prefer locking writes to your specific user UUID
--    (auth.uid() = '...') rather than `auth.role() = 'authenticated'` if public
--    sign-ups are enabled on any of the other apps.
--    Find your UUID in Supabase Dashboard -> Authentication -> Users.
DROP POLICY IF EXISTS "Authenticated write spots" ON public.spots;
CREATE POLICY "Authenticated write spots"
  ON public.spots FOR ALL
  USING (auth.role() = 'authenticated') -- Replace with: auth.uid() = 'YOUR-SUPABASE-USER-UUID'
  WITH CHECK (auth.role() = 'authenticated'); -- Replace with: auth.uid() = 'YOUR-SUPABASE-USER-UUID'

DROP POLICY IF EXISTS "Authenticated write cities" ON public.field_guide_cities;
CREATE POLICY "Authenticated write cities"
  ON public.field_guide_cities FOR ALL
  USING (auth.role() = 'authenticated') -- Replace with: auth.uid() = 'YOUR-SUPABASE-USER-UUID'
  WITH CHECK (auth.role() = 'authenticated'); -- Replace with: auth.uid() = 'YOUR-SUPABASE-USER-UUID'
