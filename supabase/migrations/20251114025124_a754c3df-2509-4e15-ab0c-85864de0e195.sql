-- Add additional fields to trips table for detailed trip information
ALTER TABLE public.trips 
ADD COLUMN IF NOT EXISTS photos text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS inclusions jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS exclusions jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS itinerary jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS price_details jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS duration_days integer DEFAULT 1;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Trip participants can view other participants" ON public.trip_participants;
DROP POLICY IF EXISTS "Organizers can view participants of their trips" ON public.trip_participants;

-- Allow trip participants to view other participants in the same trip
CREATE POLICY "Trip participants can view other participants"
ON public.trip_participants
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.trip_participants tp
    WHERE tp.trip_id = trip_participants.trip_id
    AND tp.user_id = auth.uid()
  )
);

-- Allow organizers to view participants of their trips
CREATE POLICY "Organizers can view participants of their trips"
ON public.trip_participants
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.trips t
    WHERE t.id = trip_participants.trip_id
    AND t.organizer_id = auth.uid()
  )
);