-- Create storage bucket for verification documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('verifications', 'verifications', false);

-- Only admins can view verification documents
CREATE POLICY "Admins can view verification documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'verifications' AND has_role(auth.uid(), 'admin'::app_role));

-- Organizers can upload their own verification documents
CREATE POLICY "Organizers can upload verification documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'verifications' 
  AND has_role(auth.uid(), 'organizer'::app_role)
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Organizers can update their own verification documents (before approval)
CREATE POLICY "Organizers can update their verification documents"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'verifications'
  AND auth.uid()::text = (storage.foldername(name))[1]
);