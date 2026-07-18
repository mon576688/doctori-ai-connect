# Harden Doctori AI Security

Goal: close remaining gaps beyond the last scan fixes, without changing product behavior.

## 1. Supabase Auth dashboard (user action — I'll link)
- Enable **leaked password protection**
- Shorten **OTP expiry** to 10 min
- Schedule **Postgres upgrade** to latest
- Enforce **min password length 10** + require mixed chars
- Restrict **Site URL + Redirect URLs** to `doctoriai.com`, `www.doctoriai.com`, `doctoriai.lovable.app` only

## 2. Edge functions
- Add per-IP rate limiting (reuse `check_rate_limit` RPC) to: `ai-chat-assistant`, `send-email`, `analyze-medical`, `medicine-lookup`, `drug-interaction-checker`, `search-providers`
- Enforce max body size (reject >100 KB) on all functions
- Ensure every function returns `corsHeaders` on error paths (audit pass)
- Log auth failures to `audit_logs` via a helper

## 3. Database / RLS audit
- Re-run linter and confirm no `USING (true)` policies remain
- Add explicit `REVOKE ALL ... FROM anon` on any table without public read
- Add trigger to block privilege escalation on `user_roles` (already partially covered — verify)
- Tighten `activity_logs` / `audit_logs` so only admins can SELECT

## 4. Frontend hardening
- Add **Content Security Policy** meta tag in `index.html` (script-src self + Supabase + Lovable AI + Jitsi; frame-src Jitsi; connect-src Supabase)
- Add `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` via meta where supported
- Sanitize any `dangerouslySetInnerHTML` usage (audit — likely none)
- Ensure Zod validation on every public form (contact, newsletter, register, blood donor, review)

## 5. Storage buckets
- Confirm `medical-records`, `chat-pdfs`, `provider-docs` have signed-URL-only access, no public listing
- Add file-type + size validation on upload paths (10 MB, PDF/JPG/PNG/DOCX only)

## 6. Monitoring
- Add a simple `security_events` table + trigger to record failed admin RPC calls and role changes
- Surface recent security events in Admin Dashboard

## Out of scope
- WAF/CDN-level protection (Lovable hosting-managed)
- 2FA (separate feature request — ask if wanted)

## Technical notes
- Rate limit: wrap each edge function entry with `check_rate_limit(ip, 'fn-name', 30, 15)` returning 429 on false
- CSP: start report-only via meta, tighten after 1 week of console review
- Migrations gated on user approval per platform rules
