-- Drop the overly permissive insert policy
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.notifications;

-- Create a more restrictive insert policy - only allow system/trigger inserts
-- Notifications are inserted by triggers using SECURITY DEFINER, so no user INSERT policy needed