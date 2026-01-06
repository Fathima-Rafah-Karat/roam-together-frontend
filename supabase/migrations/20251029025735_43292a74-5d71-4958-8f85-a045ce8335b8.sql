-- Add foreign key relationship to profiles
ALTER TABLE public.organizer_verifications
ADD CONSTRAINT organizer_verifications_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;