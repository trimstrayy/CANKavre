# CAN Kavre — System Audit & Deployment Readiness Report

This document outlines the bugs, security vulnerabilities, content gaps, and structural improvements identified during the audit of the CAN Kavre system. Review and resolve these items before deploying the application to production.

---

## 🛡️ Part 1: Security Vulnerabilities & Critical Bugs

Below are the identified security flaws and critical bugs ranked by severity.

### 1. Privilege Escalation via Registration Payload (CRITICAL)
* **Location:** [server/index.js:L42-L55](file:///d:/PROJECTS/CANKavre/server/index.js#L42-L55)
* **Description:** The signup endpoint accepts the `role` parameter directly from the client request body (`role || 'member'`) without validating it against the registering user's permissions. An attacker can submit a registration request with `role: "committee"` and immediately create an account with full administrative privileges.
* **Impact:** Complete administrative compromise of the local SQLite server.
* **Recommended Fix:** Hardcode the default role during public registration to `'member'`. Do not allow the client to specify their own role. Administrative privileges should only be granted by an existing administrator through a dedicated management endpoint.
  ```javascript
  // Change:
  stmt.run(fullName || null, email, hashed, role || 'member', ...);
  // To:
  stmt.run(fullName || null, email, hashed, 'member', ...);
  ```

### 2. Email Verification Token Leak in API Response (HIGH)
* **Location:** [server/index.js:L77-L83](file:///d:/PROJECTS/CANKavre/server/index.js#L77-L83)
* **Description:** When the Express server is run and the SMTP email transporter is not configured, `sendVerificationEmail` returns a mock response containing the `verificationUrl`. The registration endpoint (`/api/register`) then returns this URL in the JSON response back to the client.
* **Impact:** In production, if the mail system fails, misconfigures, or becomes temporarily unreachable, the verification URL is exposed to the frontend. Any user can sign up with any email and immediately verify it by inspecting the network response, bypassing email ownership checks.
* **Recommended Fix:** Restrict the inclusion of `verificationUrl` in the API response strictly to development environments.
  ```javascript
  // Change:
  ...(emailResult.mock ? { verificationUrl: emailResult.verificationUrl } : {})
  // To:
  ...(emailResult.mock && process.env.NODE_ENV !== 'production' ? { verificationUrl: emailResult.verificationUrl } : {})
  ```

### 3. Inaccessible Admin Portal in Production (HIGH)
* **Location:** [src/hooks/useAdmin.ts:L7-L18](file:///d:/PROJECTS/CANKavre/src/hooks/useAdmin.ts#L7-L18)
* **Description:** The `useAdmin` hook checks if `window.location.hostname === 'admin.localhost'`. If the hostname is anything else, it returns a stub disabling all administrative actions. 
* **Impact:** When the system is deployed to a production domain (e.g., `cankavre.org.np` or `admin.cankavre.org.np`), this check evaluates to `false`, locking admins out of the admin panel, scanner, and management pages.
* **Recommended Fix:** Dynamically configure the allowed admin domain using a Vite environment variable or adapt the check to match standard subdomains.
  ```typescript
  const isAdminHost = typeof window !== 'undefined' && 
    (window.location.hostname === 'admin.localhost' || 
     window.location.hostname.startsWith('admin.'));
  ```

### 4. Express Backend Fallback Missing for Content APIs (HIGH)
* **Location:** [src/lib/api.ts:L857-L922](file:///d:/PROJECTS/CANKavre/src/lib/api.ts#L857-L922)
* **Description:** The app claims that Supabase is optional and that it supports a local Express backend. While `getPrograms` has fallback fetch logic for the local server, the general content endpoints (`committeeMembersApi`, `noticesApi`, `eventsApi`, `pressReleasesApi`) do not. They call `assertSupabase()`, which throws an error if Supabase credentials are missing.
* **Impact:** If deployed using the local Express/SQLite stack without Supabase, the About Page (Committees), Notices Page, Events Page, and Press Releases Page will fail to fetch or write data and crash.
* **Recommended Fix:** Implement fallback REST calls in `contentApi` using `fetchLocalApi` to query `/api/committee_members`, `/api/notices`, etc.

### 5. Event Registration is Supabase-Only (HIGH)
* **Location:** [src/lib/registration.ts:L161-L273](file:///d:/PROJECTS/CANKavre/src/lib/registration.ts#L161-L273)
* **Description:** Event registration (`registerForEvent` and `registerForEventDirect`) operates entirely on Supabase. It has no Express backend fallback, and the Express server does not provide an endpoint for event registrations.
* **Impact:** Using the local Express server setup, users cannot register for events, and scanning event QR codes will fail.
* **Recommended Fix:** Create a `/api/events/register` endpoint in `server/index.js` and modify `registration.ts` to fall back to it.

### 6. Hardcoded JWT Secret Fallback (MEDIUM)
* **Location:** [server/auth.js:L3](file:///d:/PROJECTS/CANKavre/server/auth.js#L3)
* **Description:** The authentication server defaults to a hardcoded string `change_this_secret_for_dev` if `JWT_SECRET` is not set in `.env`.
* **Impact:** If the server is deployed without setting this variable, tokens can be forged, compromising all administrative endpoints.
* **Recommended Fix:** Throw an error and stop the server if `process.env.JWT_SECRET` is missing in production.

### 7. Database RLS Policy Bug in Supabase (MEDIUM)
* **Location:** [supabase/migrations/00001_initial_schema.sql:L892-L896](file:///d:/PROJECTS/CANKavre/supabase/migrations/00001_initial_schema.sql#L892-L896)
* **Description:** The select policy `program_reg_select_own_or_committee` for `program_registrations` only permits user select statements if `user_id = auth.uid()`. It does not verify if the user's email matches the registered email (unlike `event_registrations` which performs this check).
* **Impact:** Public users who register for programs and then login won't be able to query or see their own program registrations if the record wasn't explicitly linked to their `user_id` during insert.
* **Recommended Fix:** Add the email comparison to the selection policy.
  ```sql
  CREATE POLICY "program_reg_select_own_or_committee"
      ON program_registrations FOR SELECT USING (
          user_id = auth.uid() OR
          email = (SELECT email FROM profiles WHERE id = auth.uid()) OR
          EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
      );
  ```

### 8. Insecure CORS Configuration (LOW)
* **Location:** [server/index.js:L14](file:///d:/PROJECTS/CANKavre/server/index.js#L14)
* **Description:** CORS is initialized globally (`app.use(cors())`) without origin limits.
* **Impact:** Allows any origin to fetch endpoints.
* **Recommended Fix:** Set CORS options to limit origins to `FRONTEND_URL` in production.

---

## 📋 Part 2: Deployment Readiness Checkpoints

Reviewing the checkpoints from [CONTENT_REPLACEMENT_CHECKLIST.md](file:///d:/PROJECTS/CANKavre/CONTENT_REPLACEMENT_CHECKLIST.md):

| Section | Checkpoint Description | Status | Action Needed |
| :--- | :--- | :---: | :--- |
| **Section 1** | Organization Overview, Mission, Vision, and Objectives | **Done** | Content is updated on the homepage and about page. |
| **Section 2** | Current 10th Executive Committee Members (14 members) | **Pending** | Needs actual names, contact numbers, and photos (currently mock placeholders in `About.tsx`). |
| **Section 2.2** | Past Committees (7th, 8th, 9th) | **Pending** | Complete member lists needed (currently only 2 members seeded per term). |
| **Section 2.3** | Subcommittees (Health, Education, Agriculture, etc.) | **Pending** | Needs coordinator names, contact details, and member lists. |
| **Section 3** | Programs & Initiatives Details | **Pending** | Replace general descriptions with actual local campaign details and target metrics. |
| **Section 4** | IT School Clubs | **Pending** | Replace placeholder counts and establish actual student enrollment statistics. |
| **Section 5** | Upcoming & Past Events Calendar | **Pending** | Seed upcoming schedules for the current year. |
| **Section 6** | Image Gallery | **Pending** | Replace Unsplash placeholders with authentic photos of CAN Kavre events. |
| **Section 7** | Achievement Metrics | **Pending** | Verify total members (currently 152+), IT Clubs (13+), and beneficiaries (2000+). |
| **Section 8/9**| Press Releases & Notices | **Pending** | Remove mock articles; verify dates and redirect URLs. |
| **Section 10**| Membership Fee Structures | **Pending** | Confirm Life Membership (NRS 6,000) and Individual Membership (NRS 800) fees with the executive board. |
| **Section 11**| Primary Contact Details | **Done** | Address, phone, and emails are updated. Map embed is still needed. |
| **Section 12**| Downloads & Resources (PDFs, Forms) | **Pending** | Upload actual Constitution document, Membership Form, and Annual Reports. |
| **Section 13/14**| Multimedia & Social Media Links | **Pending** | Provide URLs for Facebook, YouTube, and introductory videos. |
| **Section 15**| Nepali Translations | **Pending** | Manually audit and fix auto-translated Devanagari text on the site. |

---

## 🚀 Part 3: Architectural & Operational Recommendations

To ensure high availability and stability, implement the following operational improvements:

1. **Scraper-Based Translation Rate Limits:**
   The backend translation utility [server/translation.js](file:///d:/PROJECTS/CANKavre/server/translation.js) uses `@vitalets/google-translate-api` (a scraper). In production, frequent writes by admins will trigger Google's rate-limiting blocks (HTTP 429). While the code fails soft, it is recommended to transition to a key-based official API or rely solely on manual translations entered by admins.
   
2. **Database Migration to Supabase:**
   If using Supabase in production, run the migration script:
   `npm run migrate:supabase`
   Ensure the `SUPABASE_SERVICE_ROLE_KEY` is used for migrations to bypass Row Level Security policies.

3. **Secure Environment Variables Configuration:**
   Create a secure `.env` file in the deployment environment matching [server/.env.example](file:///d:/PROJECTS/CANKavre/server/.env.example). Ensure the `FRONTEND_URL` is set correctly to redirect email verification links to the client application.
