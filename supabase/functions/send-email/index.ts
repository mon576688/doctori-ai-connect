import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  template: 'appointment_confirmation' | 'appointment_reminder' | 'provider_approved' | 'provider_rejected' | 'welcome';
  data: Record<string, unknown>;
}

const getEmailTemplate = (template: string, data: Record<string, unknown>): string => {
  switch (template) {
    case 'appointment_confirmation':
      return `
        <h1>Appointment Confirmed!</h1>
        <p>Dear ${data.patientName},</p>
        <p>Your appointment has been successfully scheduled.</p>
        <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Doctor:</strong> ${data.doctorName}</p>
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Time:</strong> ${data.time}</p>
          <p><strong>Type:</strong> ${data.appointmentType}</p>
        </div>
        <p>Please arrive 15 minutes before your scheduled time.</p>
        <p>Best regards,<br>Doctori AI Team</p>
      `;
    
    case 'appointment_reminder':
      return `
        <h1>Appointment Reminder</h1>
        <p>Dear ${data.patientName},</p>
        <p>This is a reminder for your upcoming appointment.</p>
        <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Doctor:</strong> ${data.doctorName}</p>
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Time:</strong> ${data.time}</p>
        </div>
        <p>Best regards,<br>Doctori AI Team</p>
      `;
    
    case 'provider_approved':
      return `
        <h1>Congratulations! Your Application is Approved</h1>
        <p>Dear ${data.providerName},</p>
        <p>We are pleased to inform you that your healthcare provider application has been approved.</p>
        <p>You can now access your provider dashboard and start accepting patients.</p>
        <a href="${data.dashboardUrl}" style="display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Go to Dashboard
        </a>
        <p>Best regards,<br>Doctori AI Team</p>
      `;
    
    case 'provider_rejected':
      return `
        <h1>Application Status Update</h1>
        <p>Dear ${data.providerName},</p>
        <p>We regret to inform you that your healthcare provider application was not approved at this time.</p>
        <p>If you believe this was an error or would like more information, please contact our support team.</p>
        <p>Best regards,<br>Doctori AI Team</p>
      `;
    
    case 'welcome':
      return `
        <h1>Welcome to Doctori AI!</h1>
        <p>Dear ${data.name},</p>
        <p>Thank you for joining Doctori AI. We're excited to have you on board!</p>
        <p>With Doctori AI, you can:</p>
        <ul>
          <li>Chat with our AI health assistant</li>
          <li>Book appointments with healthcare providers</li>
          <li>Track your health reminders</li>
          <li>Access health tips and resources</li>
        </ul>
        <a href="${data.loginUrl}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Get Started
        </a>
        <p>Best regards,<br>Doctori AI Team</p>
      `;
    
    default:
      return `<p>${JSON.stringify(data)}</p>`;
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const resend = new Resend(resendApiKey);
    const { to, subject, template, data }: EmailRequest = await req.json();

    const html = getEmailTemplate(template, data);

    const emailResponse = await resend.emails.send({
      from: "Doctori AI <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-email function:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
