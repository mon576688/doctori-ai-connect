import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    const fifteenMinutesFromNow = new Date(now.getTime() + 15 * 60 * 1000);
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    console.log('Checking for upcoming appointments...');
    console.log('Current time:', now.toISOString());
    console.log('15 min window:', fifteenMinutesFromNow.toISOString());
    console.log('1 hour window:', oneHourFromNow.toISOString());

    // Fetch appointments that are:
    // 1. Starting in ~15 minutes (14-16 min window)
    // 2. Starting in ~1 hour (59-61 min window)
    // Only get 'scheduled' appointments
    const { data: appointments, error: fetchError } = await supabase
      .from('appointments')
      .select(`
        id,
        appointment_date,
        user_id,
        doctor_id,
        consultation_link,
        appointment_type,
        status
      `)
      .eq('status', 'scheduled')
      .gte('appointment_date', now.toISOString())
      .lte('appointment_date', new Date(now.getTime() + 65 * 60 * 1000).toISOString());

    if (fetchError) {
      console.error('Error fetching appointments:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${appointments?.length || 0} upcoming appointments`);

    const notificationsSent: string[] = [];

    for (const appointment of appointments || []) {
      const appointmentTime = new Date(appointment.appointment_date);
      const timeDiff = (appointmentTime.getTime() - now.getTime()) / (60 * 1000); // in minutes

      console.log(`Appointment ${appointment.id}: ${timeDiff.toFixed(1)} minutes away`);

      // Determine reminder type based on time difference
      let reminderType: '15min' | '1hour' | null = null;
      if (timeDiff >= 14 && timeDiff <= 16) {
        reminderType = '15min';
      } else if (timeDiff >= 59 && timeDiff <= 61) {
        reminderType = '1hour';
      }

      if (!reminderType) {
        console.log(`Skipping appointment ${appointment.id} - not in reminder window`);
        continue;
      }

      // Get doctor and patient names
      const { data: doctorProfile } = await supabase
        .from('profiles')
        .select('first_name, last_name, email')
        .eq('id', appointment.doctor_id)
        .single();

      const { data: patientProfile } = await supabase
        .from('profiles')
        .select('first_name, last_name, email')
        .eq('id', appointment.user_id)
        .single();

      const doctorName = doctorProfile 
        ? `Dr. ${doctorProfile.first_name || ''} ${doctorProfile.last_name || ''}`.trim()
        : 'Your doctor';
      const patientName = patientProfile 
        ? `${patientProfile.first_name || ''} ${patientProfile.last_name || ''}`.trim()
        : 'Your patient';

      const timeText = reminderType === '15min' ? '15 minutes' : '1 hour';
      const formattedTime = appointmentTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      // Send notification to patient
      const patientMessage = appointment.consultation_link
        ? `Your appointment with ${doctorName} starts in ${timeText} at ${formattedTime}. Join here: ${appointment.consultation_link}`
        : `Your appointment with ${doctorName} starts in ${timeText} at ${formattedTime}. Please wait for the consultation link.`;

      const { error: patientNotifError } = await supabase.rpc('send_notification', {
        _user_id: appointment.user_id,
        _title: `Appointment Reminder - ${timeText}`,
        _message: patientMessage,
        _type: 'appointment_reminder',
        _link: '/dashboard'
      });

      if (patientNotifError) {
        console.error(`Failed to send patient notification for ${appointment.id}:`, patientNotifError);
      } else {
        console.log(`Sent ${reminderType} reminder to patient for appointment ${appointment.id}`);
        notificationsSent.push(`patient-${appointment.id}-${reminderType}`);
      }

      // Send notification to doctor
      const doctorMessage = `Your consultation with ${patientName} starts in ${timeText} at ${formattedTime}. ${
        appointment.consultation_link 
          ? 'Meeting link has been shared.' 
          : 'Remember to share the meeting link!'
      }`;

      const { error: doctorNotifError } = await supabase.rpc('send_notification', {
        _user_id: appointment.doctor_id,
        _title: `Consultation Reminder - ${timeText}`,
        _message: doctorMessage,
        _type: 'appointment_reminder',
        _link: '/dashboard/provider'
      });

      if (doctorNotifError) {
        console.error(`Failed to send doctor notification for ${appointment.id}:`, doctorNotifError);
      } else {
        console.log(`Sent ${reminderType} reminder to doctor for appointment ${appointment.id}`);
        notificationsSent.push(`doctor-${appointment.id}-${reminderType}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${appointments?.length || 0} appointments`,
        notificationsSent: notificationsSent.length,
        details: notificationsSent
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('Error in appointment-reminders function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
