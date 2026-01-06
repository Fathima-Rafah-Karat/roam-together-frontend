-- Create organizer verifications table
CREATE TABLE public.organizer_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  govt_id_url TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Enable RLS
ALTER TABLE public.organizer_verifications ENABLE ROW LEVEL SECURITY;

-- Organizers can submit their own verification
CREATE POLICY "Organizers can insert their verification" 
ON public.organizer_verifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND has_role(auth.uid(), 'organizer'::app_role));

-- Organizers can view their own verification status
CREATE POLICY "Organizers can view their own verification" 
ON public.organizer_verifications 
FOR SELECT 
USING (auth.uid() = user_id);

-- Only admins can view all verifications
CREATE POLICY "Admins can view all verifications" 
ON public.organizer_verifications 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update verifications
CREATE POLICY "Admins can update verifications" 
ON public.organizer_verifications 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_organizer_verifications_updated_at
BEFORE UPDATE ON public.organizer_verifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to check if organizer is verified
CREATE OR REPLACE FUNCTION public.is_organizer_verified(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organizer_verifications
    WHERE user_id = _user_id
      AND status = 'approved'
  )
$$;

-- Update trips policy to require verification
DROP POLICY IF EXISTS "Organizers can create trips" ON public.trips;
CREATE POLICY "Verified organizers can create trips" 
ON public.trips 
FOR INSERT 
WITH CHECK (
  auth.uid() = organizer_id 
  AND has_role(auth.uid(), 'organizer'::app_role)
  AND is_organizer_verified(auth.uid())
);