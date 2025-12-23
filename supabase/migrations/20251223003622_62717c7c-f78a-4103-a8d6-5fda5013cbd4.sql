-- Drop and recreate the reminder policies with proper WITH CHECK clause
DROP POLICY IF EXISTS "Users can CRUD their own reminders" ON public.reminders;
DROP POLICY IF EXISTS "Admins can view all reminders" ON public.reminders;

-- Create separate policies for each operation
CREATE POLICY "Users can view their own reminders" 
ON public.reminders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reminders" 
ON public.reminders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders" 
ON public.reminders 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders" 
ON public.reminders 
FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all reminders" 
ON public.reminders 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));