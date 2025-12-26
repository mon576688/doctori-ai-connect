-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Grant usage to postgres role
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Schedule the appointment reminders to run every minute
SELECT cron.schedule(
  'appointment-reminders-every-minute',
  '* * * * *',
  $$
  SELECT
    net.http_post(
        url:='https://lhamshhjmmruybdcfivr.supabase.co/functions/v1/appointment-reminders',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoYW1zaGhqbW1ydXliZGNmaXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMzg4MDYsImV4cCI6MjA2ODcxNDgwNn0.Cif59i-Tq6sD4ItG-iV5Z-alHRLXj99XftDGHYyte08"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);