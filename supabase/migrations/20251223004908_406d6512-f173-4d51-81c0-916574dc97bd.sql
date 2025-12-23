-- First just drop the trigger that's blocking updates
DROP TRIGGER IF EXISTS protect_profile_columns ON public.profiles;