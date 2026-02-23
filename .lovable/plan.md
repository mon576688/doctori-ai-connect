

# Implementation Plan: Chat Enhancements, Booking Type Selection, and Email Notifications

## Overview

Four features to implement:
1. Chat sidebar showing previous session summaries for quick reference
2. "Download PDF" button after each consultation
3. Symptom tips panel for new users
4. Online vs. Physical booking selection with email notifications to both doctor and patient

---

## Feature 1: Chat History Sidebar with Summaries

**Current state:** The sidebar (`ChatHistory.tsx`) shows session titles, timestamps, symptoms, and urgency badges -- but no summary text.

**Changes:**

- **`src/components/chat/ChatHistory.tsx`**: Add a short summary preview (first 80 chars of the last assistant message) beneath each session entry. When a session is selected, show a mini-summary card at the top of the sidebar with symptoms, urgency, and specialty recommendation pulled from the `chat_sessions` table fields (`primary_symptoms`, `urgency_level`, `specialty_recommendation`).

- **`src/pages/Chat.tsx`**: Pass additional session metadata (specialty_recommendation) from `useChatSession` to `ChatHistory` for display.

---

## Feature 2: Download PDF Button After Consultation

**Current state:** A "View Summary" button appears at phase `summary`. `PDFService` already exists with `generateHealthReport()`.

**Changes:**

- **`src/pages/Chat.tsx`**: Add a "Download PDF" button next to the existing "View Summary" button when `phase === 'summary'`. On click, it calls `PDFService.generateHealthReport()` using the current session state (symptoms, urgency, specialty, conversation messages). The PDF downloads directly without navigating away.

---

## Feature 3: Symptom Description Tips for New Users

**Changes:**

- **`src/pages/Chat.tsx`**: When the chat is in `initial` phase and there are no user messages yet, display a tips card above the input area with 4-5 practical tips:
  - "Describe when symptoms started (e.g., 2 days ago)"
  - "Mention the location of pain or discomfort"
  - "Rate your pain on a scale of 1-10"
  - "List any medications you are currently taking"
  - "Mention if symptoms worsen at specific times"
- The tips card auto-hides once the user sends their first message.

---

## Feature 4: Online vs. Physical Booking Selection + Email Notifications

### 4a. Booking Type Selection

**Changes:**

- **`src/contexts/BookingContext.tsx`**: Add `consultationType: 'online' | 'physical' | null` to BookingState and a `setConsultationType` setter.

- **`src/pages/booking/ReviewConfirm.tsx`**: Before the confirm button, add a radio group or toggle card for selecting:
  - **Online Consultation** -- Video/audio call (shows note: "Doctor will share a meeting link")
  - **Physical Visit** -- Visit doctor's chamber (shows the provider's address)
- Store the selection in BookingContext. Pass `consultation_type` when inserting the appointment via `book_appointment_slot`.

- **Database migration**: The `appointments` table already has a `consultation_type` column (default `'video'`). Update the `book_appointment_slot` RPC to accept and store this value, or insert it directly in the `handleConfirm` function.

### 4b. Email Notifications to Both Doctor and Patient

**Current state:** `sendConfirmationEmail` in `ReviewConfirm.tsx` only sends to the patient. The `send-email` edge function exists with Resend integration.

**Changes:**

- **`src/pages/booking/ReviewConfirm.tsx`**: After booking confirmation, also send an email to the doctor/provider. Fetch the provider's email from their profile, then invoke `send-email` a second time with a `doctor_appointment_notification` template.

- **`supabase/functions/send-email/index.ts`**: Add a new `doctor_appointment_notification` template that includes:
  - Patient name
  - Appointment date and time
  - Consultation type (Online / Physical)
  - Any notes from the patient
- Also update the existing `appointment_confirmation` template to include the consultation type (online/physical).

---

## Technical Details

### Files to Create
None -- all changes are to existing files.

### Files to Modify
1. `src/components/chat/ChatHistory.tsx` -- Add summary preview text to each session item
2. `src/pages/Chat.tsx` -- Add PDF download button, symptom tips card
3. `src/contexts/BookingContext.tsx` -- Add `consultationType` state
4. `src/pages/booking/ReviewConfirm.tsx` -- Add consultation type selector, doctor email notification
5. `supabase/functions/send-email/index.ts` -- Add `doctor_appointment_notification` template, update confirmation template

### Database Changes
- Minor update to pass `consultation_type` value from the booking form into the appointments insert (column already exists).

### Dependencies
- No new dependencies needed. Uses existing `jspdf`, `PDFService`, and `send-email` edge function.

