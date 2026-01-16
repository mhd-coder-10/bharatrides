-- Add phone and address columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS address text;