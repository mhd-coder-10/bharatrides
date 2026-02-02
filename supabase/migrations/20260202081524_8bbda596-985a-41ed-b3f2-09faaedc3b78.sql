-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN NOT NULL DEFAULT false,
  related_entity_type TEXT,
  related_entity_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Admins can view all notifications
CREATE POLICY "Admins can view all notifications"
ON public.notifications
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update notifications (mark as read)
CREATE POLICY "Admins can update notifications"
ON public.notifications
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete notifications
CREATE POLICY "Admins can delete notifications"
ON public.notifications
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert notifications (using service role or triggers)
CREATE POLICY "Allow insert for authenticated users"
ON public.notifications
FOR INSERT
WITH CHECK (true);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create function to notify admins on new booking
CREATE OR REPLACE FUNCTION public.notify_admins_on_booking()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_record RECORD;
BEGIN
  -- Insert notification for each admin
  FOR admin_record IN 
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  LOOP
    INSERT INTO public.notifications (user_id, message, type, related_entity_type, related_entity_id)
    VALUES (
      admin_record.user_id,
      'New booking: ' || NEW.vehicle_name || ' from ' || NEW.pickup_date || ' to ' || NEW.return_date,
      'booking',
      'booking',
      NEW.id::text
    );
  END LOOP;
  RETURN NEW;
END;
$$;

-- Create trigger for new bookings
CREATE TRIGGER on_booking_created
AFTER INSERT ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.notify_admins_on_booking();