

# Appointment-Locked Messaging & Consultation System

## Overview
Transform the messaging system from an open inbox to an appointment-centric chat. Doctors will not receive unsolicited messages. Chat is only activated upon appointment booking, and meeting links are auto-generated via Jitsi when a consultation starts. A 24-hour grace period after consultation end allows follow-up questions.

---

## Part 1: Database Migration

### Add columns to `appointments` table
- `is_chat_enabled` (boolean, default `false`) -- controls messaging access
- `session_start_time` (timestamptz, nullable) -- actual consultation start
- `session_end_time` (timestamptz, nullable) -- actual consultation end

### Update `book_appointment_slot` function
Add `is_chat_enabled = true` to the INSERT statement so chat is enabled on booking.

### Backfill existing data
```sql
UPDATE appointments SET is_chat_enabled = true WHERE status = 'scheduled';
```

### Update RLS on `direct_messages` (INSERT)
Replace the current open INSERT policy with an appointment-gated one:
```sql
DROP POLICY "Users can send messages" ON direct_messages;
CREATE POLICY "Users can send messages to appointment contacts" 
ON direct_messages FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM appointments
    WHERE is_chat_enabled = true
    AND (
      (user_id = sender_id AND doctor_id = receiver_id)
      OR (doctor_id = sender_id AND user_id = receiver_id)
    )
    AND (
      session_end_time IS NULL 
      OR session_end_time > now() - interval '24 hours'
    )
  )
);
```
This implements the 24-hour grace period suggestion -- patients can still message within 24 hours after a consultation ends.

---

## Part 2: Remove "New Conversation" from Inbox

### `src/components/messaging/Inbox.tsx`
- Remove the "New Conversation" dialog and button entirely (lines ~485-528)
- Replace `fetchDoctorOptions` with `fetchAppointmentContacts` that queries contacts from appointments where `is_chat_enabled = true`
- Update the empty state to show: "Your conversations will appear here once you book an appointment with a doctor."
- Add a **read-only mode**: if all shared appointments with a contact have `session_end_time` set and all are older than 24 hours, disable the message input and show "Consultation ended -- chat is read-only"
- When a selected contact's chat is read-only, replace the input area with a muted banner: "This conversation is read-only. Book a new appointment to message again."

---

## Part 3: Doctor's "Start Consultation" Enhancements

### `src/components/provider/ConsultationAppointments.tsx`
When the doctor clicks **Start Consultation**:
1. Generate a Jitsi meeting link: `https://meet.jit.si/doctoriai-{appointmentId.slice(0,8)}-{randomHash}`
2. Save it to `consultation_link`, set `consultation_status = 'in_progress'`, `session_start_time = now()`
3. Auto-post the meeting link as a **rich system message** in `direct_messages`:
   - Content: `[SYSTEM] Video Consultation Started. Join your consultation with Dr. {name}: {link}`
   - This message will render as a styled card in the Inbox (see Part 5)
4. Send notification to patient

When the doctor clicks **End Consultation**:
1. Set `consultation_status = 'completed'`, `status = 'completed'`, `session_end_time = now()`
2. Auto-post a system message: `[SYSTEM] Consultation ended. You can still send follow-up messages for the next 24 hours.`
3. Send notification to patient

### `src/components/provider/SendMeetingLink.tsx`
- Add **Jitsi Meet** as a platform option alongside Zoom/Google Meet/WhatsApp/Phone
- When Jitsi is selected, auto-generate the link (no manual input needed)
- Also post the link as a direct message to the patient

---

## Part 4: Patient View -- Chat & Join from Appointments

### `src/components/AppointmentsList.tsx` (patient view)
For scheduled appointments where `is_chat_enabled = true`:
- Show a **"Chat with Doctor"** button that navigates to the Inbox with the doctor pre-selected
- Show **"Join Consultation"** button when `consultation_link` is available and `consultation_status = 'in_progress'`
- After consultation ends (within 24h), show "View Chat" to access read-only history

---

## Part 5: Rich Meeting Link Card in Chat

### `src/components/messaging/Inbox.tsx` (message rendering)
- Detect messages starting with `[SYSTEM]` prefix
- Render them as styled cards instead of regular bubbles:
  - Different background color (e.g., blue/green tinted)
  - If contains a URL, render a "Join Consultation" button
  - System icon instead of user avatar alignment

---

## Part 6: Profile Pages (No Changes Needed)

After investigation, `DoctorProfile.tsx` and `ProviderProfile.tsx` do NOT have direct message buttons -- `MessageSquare` is only used for the "Reviews" section header. No changes needed here.

---

## Files to Modify

1. **Database migration** -- add 3 columns, update `book_appointment_slot`, update RLS policy, backfill data
2. `src/components/messaging/Inbox.tsx` -- remove "New Conversation", add appointment-based contacts, read-only mode, system message rendering
3. `src/components/provider/ConsultationAppointments.tsx` -- auto-generate Jitsi link on start, auto-post system messages, post end message
4. `src/components/provider/SendMeetingLink.tsx` -- add Jitsi option, auto-post link as DM
5. `src/components/AppointmentsList.tsx` -- add "Chat with Doctor" button for patients
6. `src/lib/bookingUtils.ts` -- add `generateJitsiLink()` helper

## Technical Notes

- Jitsi links require no API key or account -- they are free and instant
- The 24-hour grace period is enforced at the database level via RLS, not just the UI
- System messages use a `[SYSTEM]` prefix convention to differentiate from user messages in the existing `direct_messages` table (no schema change needed)
- The `book_appointment_slot` function already runs as SECURITY DEFINER, so it can set `is_chat_enabled = true` regardless of RLS

