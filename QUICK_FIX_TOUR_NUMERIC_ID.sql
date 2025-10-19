-- Quick fix to add tour_numeric_id column if missing
-- Run this in Supabase Dashboard → SQL Editor

-- Add the tour_numeric_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'tours' 
        AND column_name = 'tour_numeric_id'
    ) THEN
        ALTER TABLE public.tours ADD COLUMN tour_numeric_id SERIAL UNIQUE;
        
        CREATE INDEX IF NOT EXISTS idx_tours_numeric_id ON public.tours(tour_numeric_id);
        
        COMMENT ON COLUMN public.tours.tour_numeric_id IS '6-digit numeric ID for internal tracking and order tagging';
        
        RAISE NOTICE 'Successfully added tour_numeric_id column';
    ELSE
        RAISE NOTICE 'Column tour_numeric_id already exists';
    END IF;
END $$;

-- Reload the PostgREST schema cache
NOTIFY pgrst, 'reload schema';

