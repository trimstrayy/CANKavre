# CAN Kavre — Content & System Architecture Guide

> **Version:** 1.0  
> **Date:** 2026-02-23  
> **Database:** Supabase (PostgreSQL)  
> **Frontend:** React + TypeScript + Vite + ShadCN UI + TailwindCSS  
> **Auth:** Supabase Auth (replacing custom JWT)

---

## Table of Contents

1. [Content Description — All Pages & Components](#1-content-description--all-pages--components)
2. [Supabase Database Schema](#2-supabase-database-schema)
3. [Event Management & QR Attendance System](#3-event-management--qr-attendance-system)
4. [Migration Plan (SQLite → Supabase)](#4-migration-plan-sqlite--supabase)

---

## 1. Content Description — All Pages & Components

### 1.1 Homepage (`Index.tsx` — Route: `/`)

| Section | Content | Current Source | DB Target | Bilingual |
|---------|---------|----------------|-----------|-----------|
| **Headline Ticker** | Scrolling news marquee — 5 items with title & date (auto-rotates) | Hardcoded array | `headlines` | ✅ EN/NE |
| **Hero Carousel** | 3 full-width slides: 10th Committee, ICT Training, Community Development — each with image, title, subtitle, CTA button | Hardcoded array | `hero_slides` | ✅ EN/NE |
| **Welcome Banner** | Organization introduction paragraph + "Lets Build e-Nepal" tagline | Hardcoded via `t()` | `settings` | ✅ EN/NE |
| **Latest News** | 3 most recent news cards — title, date, excerpt, "Read more" link | Hardcoded array | `press_releases` (latest 3, `is_published=true`) | ✅ EN/NE |
| **Upcoming Events Sidebar** | Event cards showing date badge, title, location with map pin icon | Hardcoded array | `events` (where `status='upcoming'`, limit 3) | ✅ EN/NE |
| **Quick Links** | 6 icon tiles: Programs, Downloads, Gallery, Activities, About, Membership | Hardcoded (static navigation) | N/A (stays static) | ✅ EN/NE |
| **Stats Counter** | 4 animated counters: 18+ years, 13+ IT Clubs, 152+ members, 200+ events | Hardcoded values | `settings` (keys: `stat_years`, `stat_clubs`, `stat_members`, `stat_events`) | ✅ EN/NE |
| **Mission/Vision/Objectives** | 3 accordion panels — Mission statement, Vision "e-Nepal 2025", 8 strategic objectives | Hardcoded via `t()` | `settings` (keys: `mission`, `vision`, `objectives`) | ✅ EN/NE |
| **CTA Section** | "Join CAN Kavre" call-to-action with "Become a Member" button → `/membership` | Hardcoded (static) | N/A | ✅ EN/NE |

### 1.2 About Page (`About.tsx` — Route: `/about`)

| Section | Content | Current Source | DB Target | Bilingual |
|---------|---------|----------------|-----------|-----------|
| **Organization History** | Founding story, CAN Nepal affiliation, Kavrepalanchok district role | Hardcoded text | `settings` (key: `about_history`) | ✅ EN/NE |
| **Current Committee** | 14 executive members: President (Ram Chandra Nyaupane), Sr. VP, VP, Secretary, Treasurer, Joint Secretary, 8 Members — each with name, position, contact, photo | DB: `committee_members` API + hardcoded fallback | `committee_members` (where `term_id IS NULL`, `is_active=true`) | ✅ EN/NE |
| **Past Committees** | 3 historical terms: 7th Committee (2077-2079), 6th Committee (2072-2077), Adhoc Committee (2079-2080) — each with member list | Hardcoded arrays | `past_committees` + `committee_members` (via `term_id` FK) | ✅ EN/NE |
| **Subcommittees** | 6 thematic groups: Health IT, Education IT, Agriculture IT, Women IT, E-Village, Business & ICT Meet — each with focus area & member count | Hardcoded array | `subcommittees` | ✅ EN/NE |
| **IT Clubs** | 4 clubs with name, student count, establishment year, location | Hardcoded array | `it_clubs` | ✅ EN/NE |

**Admin Features:** Committee members support full CRUD via `ContentModal` component. Add/Edit/Delete with fields: name, nameNe, position, positionNe, contact, photo, sortOrder.

### 1.3 Programs Page (`Programs.tsx` — Route: `/programs`)

| Section | Content | Current Source | DB Target | Bilingual |
|---------|---------|----------------|-----------|-----------|
| **Featured Programs Carousel** | 6 flagship programs: Digital Literacy (Laptop icon), IT Club Development (GraduationCap), ICT in Agriculture (Wheat), Women in Tech (Heart), E-Governance Support (Building), Health & ICT (Thermometer) — each with title, description, 3-4 feature bullets | Hardcoded array | `programs` (where `is_active=true`, ordered by `sort_order`) | ✅ EN/NE |
| **Upcoming Programs** | Dynamic list of programs with title, deadline date, category badge | DB: `programs` table via `getPrograms()` API | `upcoming_programs` | ✅ EN/NE |

**Program Categories (8):** `digital-literacy`, `it-club`, `agriculture`, `women-in-tech`, `e-governance`, `health-ict`, `cybersecurity`, `general`

**Admin Features:** Full CRUD for upcoming programs via `ProgramModal` with fields: title, titleNe, description, descriptionNe, deadline, category.

### 1.4 Events & Gallery Page (`Events.tsx` — Route: `/events`)

| Section | Content | Current Source | DB Target | Bilingual |
|---------|---------|----------------|-----------|-----------|
| **Events List** | 4 event cards: CAN ICT Conference 2080 (200 attendees, completed), Digital Literacy Camp (75, upcoming), IT Club Inter-School Competition (120, upcoming), E-Governance Workshop (50, ongoing) — each with title, date, time, location, attendees count, status badge, cover image | DB: `events` API + hardcoded fallback | `events` | ✅ EN/NE |
| **Photo Gallery** | 6-image masonry grid with lightbox viewer (zoom, title overlay) — currently stock photos | Hardcoded array (6 Unsplash images) | `gallery_images` (optionally linked to `events.id`) | ✅ EN/NE |

**Event Statuses:** `upcoming` (blue), `ongoing` (green), `completed` (gray), `cancelled` (red — new)  
**Admin Features:** Full CRUD for events via `ContentModal`. Gallery has client-side add/remove mode (no backend persistence yet).

### 1.5 Notice Board (`Notice.tsx` — Route: `/notice`)

| Section | Content | Current Source | DB Target | Bilingual |
|---------|---------|----------------|-----------|-----------|
| **Notice List** | 5 notices with visual priority styling — cards show title, content excerpt, date, priority badge (colored border), type badge | DB: `notices` API + hardcoded fallback | `notices` | ✅ EN/NE |

**Priority Levels:** `high` (red border + badge), `medium` (yellow), `low` (green)  
**Types:** `announcement` (megaphone icon), `deadline` (clock icon), `info` (info icon)

**Admin Features:** Full CRUD via `ContentModal` with fields: title, titleNe, content, contentNe, date, priority (select), type (select).

### 1.6 Press Releases (`PressReleases.tsx` — Route: `/press-releases`)

| Section | Content | Current Source | DB Target | Bilingual |
|---------|---------|----------------|-----------|-----------|
| **Search Bar** | Text input for full-text search across titles and excerpts | Client-side filter | Client-side (or Supabase full-text search) | ✅ EN/NE |
| **Category Filter** | Dropdown: All, Events, IT Club, Training, Partnership, Organization | Hardcoded options | `categories` table | ✅ EN/NE |
| **Press Release Cards** | 6 articles: ICT Day Blood Donation, IT Club Program, Digital Literacy Training, CAN Bagmati Partnership, Calendar Launch, Health IT Initiative — each with title, excerpt, date, category badge, external link to `cankavre.org.np` | DB: `press_releases` API + hardcoded fallback | `press_releases` + `categories` (via `category_id` FK) | ✅ EN/NE |

**Admin Features:** Full CRUD via `ContentModal` with fields: title, titleNe, excerpt, excerptNe, date, category, categoryNe, link.

### 1.7 Downloads (`Downloads.tsx` — Route: `/downloads`)

| Section | Content | Current Source | DB Target | Bilingual |
|---------|---------|----------------|-----------|-----------|
| **General Downloads** | 4 items: CAN Constitution (PDF, 2.4MB), Membership Registration Form (PDF, 1.2MB), Annual Report 2080/81 (PDF, 5.8MB), IT Club Guidelines (PDF, 3.1MB) | Hardcoded array | `downloads` | ✅ EN/NE |
| **Reports by Category** | 8 reports across 4 tabs — Secretary (2), Treasurer (2), Coordinator (2), IT Club (2) — each with title, author, date, file type, file size | Hardcoded array | `reports` (filtered by `report_type`) | ✅ EN/NE |

**File Types:** PDF, Document, Image, Spreadsheet  
**Report Types:** `secretary`, `treasurer`, `coordinator`, `itclub`  
**No admin features yet** — purely hardcoded, no backend integration.

### 1.8 Membership (`Membership.tsx` — Route: `/membership`)

| Section | Content | Current Source | DB Target | Bilingual |
|---------|---------|----------------|-----------|-----------|
| **Membership Types** | 3 tiers with fee, description, 4 benefits each: Life (NRS 6,000 one-time, BadgeCheck icon), Individual (NRS 800/yr, User icon), Institutional (NRS 5,000/yr, Building2 icon) | Hardcoded `MembershipType[]` array | `membership_types` | ✅ EN/NE |
| **Required Documents** | 4 items: Citizenship Certificate (both sides), Academic Certificates (min SLC/SEE), Passport Photo (white bg), Professional/IT Certificate (optional) | Hardcoded array | `membership_documents` (new) or `settings` JSON | ✅ EN/NE |
| **Registration Link** | External button → `https://canfederation.org/member_registration` | Static URL | `settings` (key: `registration_url`) | ❌ |
| **Login Form** | Tabs: Committee / Subcommittee — email + password fields (shows toast only, no real auth) | Client-side only | Supabase Auth | ✅ EN/NE |

### 1.9 Authentication (`Auth.tsx` — Route: `/auth`)

| Section | Content | Current Source | DB Target | Bilingual |
|---------|---------|----------------|-----------|-----------|
| **Login Form** | Email + Password + Role toggle (Committee/Member) | Backend: `POST /api/login` | Supabase `auth.signInWithPassword()` | ✅ EN/NE |
| **Register Form** | Full Name + Email + Password + Confirm Password + Role selector | Backend: `POST /api/register` | Supabase `auth.signUp()` with metadata | ✅ EN/NE |

**Roles:** `committee` (full admin — CRUD all content, approve submissions, scan QR), `subcommittee` (submit content for approval), `member` (view content, register for events)  
**Auth Flow:** JWT stored in localStorage → validated on page load via `/api/users/me` (will become `supabase.auth.getSession()`)  
**Post-Login Redirect:** Committee → `/programs`, Member → `/`

### 1.10 Admin Dashboard (`Admin.tsx` — Route: `/admin`)

| Section | Content | Current Source | DB Target | Bilingual |
|---------|---------|----------------|-----------|-----------|
| **Pending Approvals** | 3 mock items: "New Event: Digital Workshop" (Health Sub), "Press Release: ICT Day" (Education Sub), "Notice: Membership Deadline" (Women IT Sub) — approve/reject buttons | Hardcoded `pendingApprovals[]` + client-side state | `pending_approvals` | Partial |
| **Content Management Grid** | 7 section cards: Committees (8), Subcommittees (4), Events (12), News/Press (24), Gallery (86), Downloads (15), Notices (8) — each with icon, title, count, link | Hardcoded `adminSections[]` | Dynamic counts from each table | Partial |
| **Settings** | Placeholder tab — no content | Not implemented | `settings` table CRUD | ❌ |

### 1.11 Layout Components

#### Navbar (`Navbar.tsx`)

| Element | Content | Notes |
|---------|---------|-------|
| **Logo Area** | "CAN Federation Kavre" text + Nepal tricolor stripe (red, green, blue) | Static |
| **Navigation Links** | Home, About Us, Committee (dropdown → Current Committee, Past Committees, Subcommittees), Programs, News (dropdown → Notices, Press Releases, Downloads), Events & Gallery, Downloads | Static routes |
| **Language Switcher** | EN ↔ NE toggle button (`LanguageSwitcher` component) | Toggles `LanguageContext` |
| **Search Bar** | Expandable text input → triggers `SearchContext.performSearch()` → `SearchPanel` dropdown | Searches `staticSearchEntries` + dynamic entries |
| **Auth Area** | Logged out: "Login" button → `/auth`. Logged in: User avatar + name + role badge + "Logout" dropdown | `AuthContext` |
| **Badge** | "Lets Build e-Nepal" floating pill badge | Static |
| **Mobile** | Hamburger → Sheet drawer with all nav items, search, auth | Responsive |

#### Footer (`Footer.tsx`)

| Column | Content | DB Target |
|--------|---------|-----------|
| **About (Col 1)** | Organization description paragraph + Social links: Facebook (`facebook.com/cankavre`), YouTube (`youtube.com/@cankavre`) | `settings` |
| **Contact (Col 2)** | Address: Banepa, Kavrepalanchok, Bagmati Province, Nepal. Phone: listed. Email: `cankavre@gmail.com`. Newsletter form: email input + subscribe button (toast only, no backend) | `settings` + `newsletter_subscribers` |
| **Quick Links (Col 3)** | 6 links: About Us, Programs, Events, Membership, Downloads, Contact | Static routes |
| **Feedback (Col 4)** | Name + Email + Message form with math CAPTCHA (e.g., "3 + 7 = ?"). Submit shows toast — no backend. | `feedback` table |
| **Bottom Bar** | "© 2026 CAN Federation Kavre" + version badge + tricolor stripes | `settings` |

### 1.12 Shared Components

| Component | Purpose | Fields/Props | Used By |
|-----------|---------|--------------|---------|
| `ContentModal` | Generic CRUD dialog for adding/editing content | `FieldDef[]` with types: `text`, `textarea`, `date`, `number`, `select` | About, Events, Notice, PressReleases |
| `ProgramModal` | Specialized program CRUD with 8 category presets | title, titleNe, description, descriptionNe, deadline, category | Programs |
| `SearchPanel` | Global search results dropdown with highlighted matches | Displays `SearchHit[]` with score-based ranking | Navbar |
| `EditableField` | Inline editable text — click to edit, blur to save | value, onSave, isEditing | Programs (featured) |
| `EditButton` | Floating edit toggle button for admin users | Checks `useAdmin()` hook for `committee` role | Various pages |
| `LanguageSwitcher` | EN/NE toggle button with flag icons | Toggles `LanguageContext.toggleLanguage()` | Navbar |
| `SplashScreen` | Full-screen loading animation on initial app load | Auto-hides after assets load | App.tsx (root) |
| `NavLink` | Navigation link with active state styling | `to`, `label` props — uses `useLocation()` | Navbar |

### 1.13 Translation System (`translations.ts`)

- **150+ translation keys** organized by section (nav, hero, welcome, news, stats, mission, footer, about, programs, events, downloads, press, notices, membership, auth, admin)
- **Languages:** English (`en`), Nepali (`ne` — Devanagari script)
- **Coverage:** Every UI string, page title, form label, placeholder, button text, status badge, error/success message, empty state text
- **Access Pattern:** `const { t, isNepali } = useLanguage()` → `t('key')` returns localized string
- **Missing:** Some content (e.g., featured programs descriptions) use inline bilingual objects rather than translation keys

### 1.14 Search System (`staticSearchEntries.ts` + `SearchContext.tsx`)

- **70+ pre-built search entries** covering all pages & content
- **Entry Structure:** `{ id, route, title, content, description, tags }`
- **Algorithm:** Case-insensitive substring matching. Scores: title match (highest) > description > content > tags
- **Dynamic Registration:** Pages call `useRegisterSearchSource(id, entries)` to add DB-fetched content to search index
- **UI:** `SearchPanel` shows results with highlighted query term, result count, and route links
- **Coverage:** Programs (hero, 6 programs, 3 upcoming, CTA), Downloads (4 general, 8 reports), Notices (5), Press Releases (6), Events (4 events, 6 gallery), Core pages (home, about, membership, auth, admin)

### 1.15 State Management

| Context | State | Functions | Persistence |
|---------|-------|-----------|-------------|
| `AuthContext` | `user` (User\|null), `token` (string\|null), `isLoading` (bool) | `login(token, user)`, `logout()`, `refreshUser()` | localStorage (`auth_token`) |
| `LanguageContext` | `language` ('en'\|'ne') | `toggleLanguage()`, `t(key)`, `isNepali` | localStorage |
| `SearchContext` | `isVisible`, `query`, `results` (SearchHit[]) | `openSearch()`, `closeSearch()`, `performSearch(q)`, `updateEntries()`, `removeEntries()` | In-memory |

### 1.16 API Layer (`api.ts`)

| Function | Endpoint | Method | Auth | Purpose |
|----------|----------|--------|------|---------|
| `registerUser()` | `/api/register` | POST | ❌ | Create new user account |
| `loginUser()` | `/api/login` | POST | ❌ | Authenticate, receive JWT |
| `getMe()` | `/api/users/me` | GET | ✅ | Validate current session |
| `getPrograms()` | `/api/programs` | GET | ❌ | List all programs |
| `createProgram()` | `/api/programs` | POST | ✅ committee | Create new program |
| `updateProgram()` | `/api/programs/:id` | PUT | ✅ committee | Update program |
| `deleteProgram()` | `/api/programs/:id` | DELETE | ✅ committee | Delete program |
| `contentApi<T>(table).getAll()` | `/api/{table}` | GET | ❌ | Generic: list all records |
| `contentApi<T>(table).create()` | `/api/{table}` | POST | ✅ committee | Generic: create record |
| `contentApi<T>(table).update()` | `/api/{table}/:id` | PUT | ✅ committee | Generic: update record |
| `contentApi<T>(table).delete()` | `/api/{table}/:id` | DELETE | ✅ committee | Generic: delete record |

**Tables with `contentApi`:** `committee_members`, `notices`, `events`, `press_releases`

---

## 2. Supabase Database Schema

### 2.1 Why Supabase?

| Feature | Benefit for CAN Kavre |
|---------|----------------------|
| **PostgreSQL** | Production-grade relational DB with full SQL, JSON, full-text search |
| **Auth** | Built-in user management, JWT, OAuth — replaces custom `auth.js` |
| **Storage** | File uploads for photos, documents, reports, QR codes — replaces local file paths |
| **Realtime** | Live updates for notices, events, attendance counts — no polling |
| **Row Level Security (RLS)** | Granular per-role permissions without custom middleware |
| **Edge Functions** | Serverless Deno for QR generation, email sending, attendance verification |
| **Free Tier** | 500MB DB, 1GB storage, 50K auth users, 500K edge function invocations/month |
| **Dashboard** | Built-in table editor, SQL editor, logs — replaces need for custom admin DB tools |

### 2.2 Complete Table Inventory

| # | Table | Purpose | Status | RLS |
|---|-------|---------|--------|-----|
| 1 | `profiles` | Extended user data (Supabase Auth handles core auth) | Replace `users` | ✅ |
| 2 | `committee_members` | Current & past executive committee members | Existing → migrate | ✅ |
| 3 | `past_committees` | Historical committee terms/periods | New (from hardcoded) | ✅ |
| 4 | `subcommittees` | 6 thematic working groups | New (from hardcoded) | ✅ |
| 5 | `subcommittee_members` | Junction: users ↔ subcommittees | **Brand new** | ✅ |
| 6 | `it_clubs` | IT clubs list with details | New (from hardcoded) | ✅ |
| 7 | `membership_types` | 3 membership tiers + fees + benefits | New (from hardcoded) | ✅ |
| 8 | `membership_applications` | **Track membership requests** | **Brand new** | ✅ |
| 9 | `categories` | Shared taxonomy for press releases & downloads | New (from hardcoded) | ✅ |
| 10 | `notices` | Notice board entries | Existing → migrate | ✅ |
| 11 | `events` | Event listings with full details | Existing → migrate | ✅ |
| 12 | `event_registrations` | **QR attendance tracking** | **Brand new** | ✅ |
| 13 | `gallery_images` | Photo gallery linked to events | New (from hardcoded) | ✅ |
| 14 | `press_releases` | News articles / press releases | Existing → migrate | ✅ |
| 15 | `downloads` | General downloadable files | New (from hardcoded) | ✅ |
| 16 | `reports` | Categorized report files | New (from hardcoded) | ✅ |
| 17 | `programs` | Flagship program pages (6 featured) | Existing → migrate | ✅ |
| 18 | `upcoming_programs` | Scheduled program instances with registration | New (from hardcoded) | ✅ |
| 19 | `program_registrations` | **User signup for programs** (with optional QR) | **Brand new** | ✅ |
| 20 | `headlines` | Homepage ticker items | New (from hardcoded) | ✅ |
| 21 | `hero_slides` | Homepage carousel slides | New (from hardcoded) | ✅ |
| 22 | `pending_approvals` | Content moderation queue (subcommittee → committee) | New (from mock data) | ✅ |
| 23 | `feedback` | Visitor feedback form submissions | New (from client-only) | ✅ |
| 24 | `newsletter_subscribers` | Email subscription list | New (from client-only) | ✅ |
| 25 | `settings` | Key-value site configuration | New (from hardcoded) | ✅ |
| 26 | `audit_log` | **Admin activity tracking** | **Brand new** | ✅ |
| 27 | `contact_messages` | **Contact form messages** (separate from feedback) | **Brand new** | ✅ |
| 28 | `tags` | **Tagging system for searchability** | **Brand new** | ✅ |
| 29 | `content_tags` | **Junction: content ↔ tags** | **Brand new** | ✅ |
| 30 | `page_views` | **Basic analytics tracking** | **Brand new** | ✅ |

### 2.3 Shared Utilities

```sql
-- ============================================================
-- SHARED: Auto-update timestamp trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- SHARED: Generate sequential registration codes
-- ============================================================
CREATE OR REPLACE FUNCTION generate_registration_code(prefix TEXT)
RETURNS TEXT AS $$
DECLARE
    seq_val INT;
    code TEXT;
BEGIN
    -- Use current year + a random suffix
    seq_val := FLOOR(RANDOM() * 99999)::INT;
    code := prefix || '-' || EXTRACT(YEAR FROM NOW())::TEXT || '-' || LPAD(seq_val::TEXT, 5, '0');
    RETURN code;
END;
$$ LANGUAGE plpgsql;
```

### 2.4 SQL Table Definitions

---

#### Table 1: `profiles` — Extended User Data

Supabase Auth manages `auth.users` (id, email, encrypted_password, etc.). This table extends it with app-specific fields.

```sql
CREATE TABLE profiles (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name       TEXT NOT NULL,
    full_name_ne    TEXT,                                 -- Nepali (Devanagari)
    email           TEXT UNIQUE NOT NULL,
    phone           TEXT,
    avatar_url      TEXT,                                 -- Supabase Storage path
    role            TEXT NOT NULL DEFAULT 'member'
                    CHECK (role IN ('committee', 'subcommittee', 'member')),
    bio             TEXT,                                 -- short user bio
    bio_ne          TEXT,
    organization    TEXT,                                 -- company/institution
    is_active       BOOLEAN DEFAULT TRUE,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on Supabase Auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, full_name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'member')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

**RLS Policies:**
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Committee can update any profile"
    ON profiles FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );

CREATE POLICY "Committee can delete profiles"
    ON profiles FOR DELETE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );
```

---

#### Table 2: `committee_members`

```sql
CREATE TABLE committee_members (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    name_ne     TEXT NOT NULL,
    position    TEXT NOT NULL,                            -- 'President', 'Senior Vice President', etc.
    position_ne TEXT NOT NULL,
    contact     TEXT,                                     -- phone or email
    photo_url   TEXT,                                     -- Supabase Storage path
    user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,  -- link to profile if member has account
    term_id     INT REFERENCES past_committees(id) ON DELETE SET NULL,  -- NULL = current committee
    sort_order  INT DEFAULT 0,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE committee_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Committee members are viewable by everyone"
    ON committee_members FOR SELECT USING (true);

CREATE POLICY "Committee can manage members"
    ON committee_members FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );
```

**Data (14 current members):**

| sort_order | position | name | name_ne |
|------------|----------|------|---------|
| 1 | President | Ram Chandra Nyaupane | रामचन्द्र न्यौपाने |
| 2 | Senior Vice President | Shrawan Kumar Acharya | श्रवण कुमार आचार्य |
| 3 | Vice President | Dipak Sapkota | दिपक सापकोटा |
| 4 | Secretary | Devaki Acharya | देवकी आचार्य |
| 5 | Treasurer | Kewal Prasad Timalsina | केवल प्रसाद तिमल्सिना |
| 6 | Joint Secretary | Rukesh Rajbhandari | रुकेश राजभण्डारी |
| 7-14 | Member | Rishi Ram Gautam, Rita Shrestha, Vivek Timalsina, Shyam Gopal Shrestha, Abodh Bhushan Khoju Shrestha, Ujwal Thapa Magar, Prakash Paudel, Umesh Adhikari | (Nepali equivalents) |

---

#### Table 3: `past_committees`

```sql
CREATE TABLE past_committees (
    id          SERIAL PRIMARY KEY,
    period      TEXT NOT NULL,                            -- '7th Committee (2077-2079)'
    period_ne   TEXT NOT NULL,
    category    TEXT,                                     -- '10th', '9th', '7th', etc.
    start_year  INT,                                     -- BS year start
    end_year    INT,                                     -- BS year end
    sort_order  INT DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE past_committees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Past committees viewable by everyone" ON past_committees FOR SELECT USING (true);
CREATE POLICY "Committee can manage" ON past_committees FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);
```

---

#### Table 4: `subcommittees`

```sql
CREATE TABLE subcommittees (
    id            SERIAL PRIMARY KEY,
    name          TEXT NOT NULL,
    name_ne       TEXT NOT NULL,
    focus         TEXT,                                   -- area of focus description
    focus_ne      TEXT,
    member_count  INT DEFAULT 0,
    type          TEXT CHECK (type IN (
        'health', 'education', 'agriculture', 'women', 'evillage', 'business'
    )),
    coordinator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    is_active     BOOLEAN DEFAULT TRUE,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER subcommittees_updated_at
    BEFORE UPDATE ON subcommittees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE subcommittees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Subcommittees viewable by everyone" ON subcommittees FOR SELECT USING (true);
CREATE POLICY "Committee can manage subcommittees" ON subcommittees FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);
```

**Data (6 subcommittees):** Health IT, Education IT, Agriculture IT, Women IT, E-Village, Business & ICT Meet

---

#### Table 5: `subcommittee_members` (Junction)

```sql
CREATE TABLE subcommittee_members (
    id              SERIAL PRIMARY KEY,
    subcommittee_id INT NOT NULL REFERENCES subcommittees(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role            TEXT DEFAULT 'member' CHECK (role IN ('coordinator', 'secretary', 'member')),
    joined_at       TIMESTAMPTZ DEFAULT NOW(),
    left_at         TIMESTAMPTZ,
    is_active       BOOLEAN DEFAULT TRUE,
    UNIQUE(subcommittee_id, user_id)
);

ALTER TABLE subcommittee_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Viewable by everyone" ON subcommittee_members FOR SELECT USING (true);
CREATE POLICY "Committee can manage" ON subcommittee_members FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);

-- Auto-update member_count on subcommittees
CREATE OR REPLACE FUNCTION update_subcommittee_member_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE subcommittees SET member_count = (
        SELECT COUNT(*) FROM subcommittee_members
        WHERE subcommittee_id = COALESCE(NEW.subcommittee_id, OLD.subcommittee_id)
        AND is_active = TRUE
    ) WHERE id = COALESCE(NEW.subcommittee_id, OLD.subcommittee_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_subcommittee_count
    AFTER INSERT OR UPDATE OR DELETE ON subcommittee_members
    FOR EACH ROW EXECUTE FUNCTION update_subcommittee_member_count();
```

---

#### Table 6: `it_clubs`

```sql
CREATE TABLE it_clubs (
    id            SERIAL PRIMARY KEY,
    name          TEXT NOT NULL,
    name_ne       TEXT NOT NULL,
    students      INT DEFAULT 0,
    established   INT,                                   -- establishment year (BS or AD)
    location      TEXT,
    location_ne   TEXT,
    school_name   TEXT,                                   -- associated school/college
    school_name_ne TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    logo_url      TEXT,                                   -- Supabase Storage
    is_active     BOOLEAN DEFAULT TRUE,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER it_clubs_updated_at BEFORE UPDATE ON it_clubs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE it_clubs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "IT clubs viewable by everyone" ON it_clubs FOR SELECT USING (true);
CREATE POLICY "Committee can manage IT clubs" ON it_clubs FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);
```

---

#### Table 7: `membership_types`

```sql
CREATE TABLE membership_types (
    id              SERIAL PRIMARY KEY,
    type            TEXT NOT NULL,                        -- 'Life Membership'
    type_ne         TEXT NOT NULL,
    fee             TEXT NOT NULL,                        -- 'NRS 6,000' (display)
    fee_ne          TEXT NOT NULL,
    fee_amount      NUMERIC(10,2),                       -- 6000.00 (numeric)
    is_recurring    BOOLEAN DEFAULT FALSE,               -- true = annual
    renewal_period  TEXT DEFAULT 'yearly',                -- 'yearly', 'one-time'
    description     TEXT,
    description_ne  TEXT,
    benefits        JSONB DEFAULT '[]'::JSONB,            -- ["benefit 1", "benefit 2"]
    benefits_ne     JSONB DEFAULT '[]'::JSONB,
    icon            TEXT,                                 -- icon key for UI
    color           TEXT DEFAULT 'primary',               -- color theme
    sort_order      INT DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE membership_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Membership types viewable by everyone" ON membership_types FOR SELECT USING (true);
CREATE POLICY "Committee can manage" ON membership_types FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);
```

**Seed Data:**

| type | fee_amount | is_recurring |
|------|-----------|--------------|
| Life Membership | 6000.00 | FALSE |
| Individual Membership | 800.00 | TRUE |
| Institutional Membership | 5000.00 | TRUE |

---

#### Table 8: `membership_applications` (New)

```sql
CREATE TABLE membership_applications (
    id                  SERIAL PRIMARY KEY,
    user_id             UUID REFERENCES profiles(id) ON DELETE SET NULL,
    membership_type_id  INT NOT NULL REFERENCES membership_types(id) ON DELETE RESTRICT,
    full_name           TEXT NOT NULL,
    full_name_ne        TEXT,
    email               TEXT NOT NULL,
    phone               TEXT NOT NULL,
    address             TEXT,
    address_ne          TEXT,
    organization        TEXT,                             -- for institutional
    citizenship_doc_url TEXT,                             -- Supabase Storage
    photo_url           TEXT,
    academic_doc_url    TEXT,
    professional_doc_url TEXT,
    status              TEXT DEFAULT 'pending'
                        CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    reviewed_by         UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at         TIMESTAMPTZ,
    review_notes        TEXT,
    payment_status      TEXT DEFAULT 'unpaid'
                        CHECK (payment_status IN ('unpaid', 'paid', 'verified')),
    payment_receipt_url TEXT,
    expires_at          DATE,                             -- for recurring memberships
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER membership_apps_updated_at BEFORE UPDATE ON membership_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications"
    ON membership_applications FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );
CREATE POLICY "Authenticated users can apply"
    ON membership_applications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Committee can update applications"
    ON membership_applications FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );
```

---

#### Table 9: `categories`

```sql
CREATE TABLE categories (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL UNIQUE,
    name_ne     TEXT NOT NULL,
    slug        TEXT UNIQUE,
    description TEXT,
    parent_id   INT REFERENCES categories(id) ON DELETE SET NULL,
    sort_order  INT DEFAULT 0,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Committee can manage categories" ON categories FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);

-- Seed
INSERT INTO categories (name, name_ne, slug) VALUES
    ('Events', 'कार्यक्रमहरू', 'events'),
    ('IT Club', 'आइटी क्लब', 'it-club'),
    ('Training', 'तालिम', 'training'),
    ('Partnership', 'साझेदारी', 'partnership'),
    ('Organization', 'संगठन', 'organization'),
    ('Digital Literacy', 'डिजिटल साक्षरता', 'digital-literacy'),
    ('Health ICT', 'स्वास्थ्य आइसिटी', 'health-ict'),
    ('E-Governance', 'ई-शासन', 'e-governance');
```

---

#### Table 10: `notices`

```sql
CREATE TABLE notices (
    id           SERIAL PRIMARY KEY,
    title        TEXT NOT NULL,
    title_ne     TEXT NOT NULL,
    content      TEXT,
    content_ne   TEXT,
    date         DATE DEFAULT CURRENT_DATE,
    expiry_date  DATE,                                   -- auto-hide after this date
    priority     TEXT DEFAULT 'medium'
                 CHECK (priority IN ('high', 'medium', 'low')),
    type         TEXT DEFAULT 'info'
                 CHECK (type IN ('announcement', 'deadline', 'info', 'urgent')),
    attachment_url TEXT,                                  -- optional file attachment
    author_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
    is_pinned    BOOLEAN DEFAULT FALSE,                  -- sticky to top
    is_published BOOLEAN DEFAULT TRUE,
    view_count   INT DEFAULT 0,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER notices_updated_at BEFORE UPDATE ON notices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published notices viewable by everyone"
    ON notices FOR SELECT USING (is_published = true OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee'));
CREATE POLICY "Committee can manage notices" ON notices FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('committee', 'subcommittee'))
);
```

---

#### Table 11: `events` ⭐

```sql
CREATE TABLE events (
    id                      SERIAL PRIMARY KEY,
    title                   TEXT NOT NULL,
    title_ne                TEXT NOT NULL,
    slug                    TEXT UNIQUE,                  -- URL-friendly slug
    date                    DATE,
    time                    TEXT,                         -- '10:00 AM'
    end_date                DATE,                         -- multi-day events
    end_time                TEXT,
    location                TEXT,
    location_ne             TEXT,
    venue_address           TEXT,                         -- full street address
    venue_map_url           TEXT,                         -- Google Maps embed/link
    description             TEXT,
    description_ne          TEXT,
    full_content            TEXT,                         -- detailed event page content (Markdown)
    full_content_ne         TEXT,
    max_attendees           INT,                          -- capacity limit (NULL = unlimited)
    attendees               INT DEFAULT 0,                -- current checked-in count (auto-updated)
    registered_count        INT DEFAULT 0,                -- total registered (auto-updated)
    status                  TEXT DEFAULT 'upcoming'
                            CHECK (status IN ('draft', 'upcoming', 'ongoing', 'completed', 'cancelled')),
    image_url               TEXT,                         -- cover image (Supabase Storage)
    is_registration_open    BOOLEAN DEFAULT TRUE,
    registration_deadline   DATE,
    registration_fee        NUMERIC(10,2) DEFAULT 0,      -- 0 = free event
    registration_fee_ne     TEXT,
    contact_email           TEXT,                         -- event contact
    contact_phone           TEXT,
    category_id             INT REFERENCES categories(id) ON DELETE SET NULL,
    organizer               TEXT DEFAULT 'CAN Federation Kavre',
    organizer_ne            TEXT DEFAULT 'क्यान महासंघ काभ्रे',
    author_id               UUID REFERENCES profiles(id) ON DELETE SET NULL,
    is_featured             BOOLEAN DEFAULT FALSE,        -- show on homepage
    is_published            BOOLEAN DEFAULT TRUE,
    view_count              INT DEFAULT 0,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-generate slug from title
CREATE OR REPLACE FUNCTION generate_event_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := LOWER(REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
        NEW.slug := TRIM(BOTH '-' FROM NEW.slug);
        -- Ensure uniqueness
        IF EXISTS (SELECT 1 FROM events WHERE slug = NEW.slug AND id != COALESCE(NEW.id, 0)) THEN
            NEW.slug := NEW.slug || '-' || EXTRACT(EPOCH FROM NOW())::INT;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_event_slug
    BEFORE INSERT OR UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION generate_event_slug();

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published events viewable by everyone"
    ON events FOR SELECT USING (is_published = true OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee'));
CREATE POLICY "Committee can manage events" ON events FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('committee', 'subcommittee'))
);
```

---

#### Table 12: `event_registrations` ⭐ QR Attendance System

```sql
CREATE TABLE event_registrations (
    id                  SERIAL PRIMARY KEY,
    event_id            INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id             UUID REFERENCES profiles(id) ON DELETE SET NULL,

    -- Registrant info (supports non-logged-in registration too)
    full_name           TEXT NOT NULL,
    full_name_ne        TEXT,
    email               TEXT NOT NULL,
    phone               TEXT,
    organization        TEXT,
    designation         TEXT,                              -- job title

    -- Unique registration identifier for QR code
    registration_code   TEXT UNIQUE NOT NULL,              -- 'EVT-2026-00123'

    -- QR code
    qr_code_url         TEXT,                              -- Supabase Storage path to generated QR image
    qr_data             TEXT,                              -- the URL/string encoded in QR

    -- Attendance tracking
    is_attended         BOOLEAN DEFAULT FALSE,
    checked_in_at       TIMESTAMPTZ,
    checked_in_by       UUID REFERENCES profiles(id),     -- admin who scanned
    check_in_method     TEXT DEFAULT 'qr'
                        CHECK (check_in_method IN ('qr', 'manual', 'import')),

    -- Status lifecycle
    status              TEXT DEFAULT 'registered'
                        CHECK (status IN ('registered', 'confirmed', 'attended', 'cancelled', 'no-show')),

    -- Payment (for paid events)
    payment_status      TEXT DEFAULT 'not-required'
                        CHECK (payment_status IN ('not-required', 'pending', 'paid', 'refunded')),
    payment_amount      NUMERIC(10,2),
    payment_receipt_url TEXT,

    -- Metadata
    registration_source TEXT DEFAULT 'web'
                        CHECK (registration_source IN ('web', 'admin', 'import', 'walk-in')),
    notes               TEXT,
    feedback_rating     INT CHECK (feedback_rating BETWEEN 1 AND 5),
    feedback_comment    TEXT,

    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(event_id, email)                               -- prevent double registration
);

CREATE TRIGGER event_reg_updated_at BEFORE UPDATE ON event_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Indexes for fast lookups
CREATE INDEX idx_event_reg_code ON event_registrations(registration_code);
CREATE INDEX idx_event_reg_event ON event_registrations(event_id);
CREATE INDEX idx_event_reg_attended ON event_registrations(event_id, is_attended);
CREATE INDEX idx_event_reg_email ON event_registrations(email);
CREATE INDEX idx_event_reg_status ON event_registrations(event_id, status);

-- Auto-update registered_count and attendees on events table
CREATE OR REPLACE FUNCTION sync_event_counts()
RETURNS TRIGGER AS $$
DECLARE
    target_event_id INT;
BEGIN
    target_event_id := COALESCE(NEW.event_id, OLD.event_id);

    UPDATE events SET
        registered_count = (
            SELECT COUNT(*) FROM event_registrations
            WHERE event_id = target_event_id AND status != 'cancelled'
        ),
        attendees = (
            SELECT COUNT(*) FROM event_registrations
            WHERE event_id = target_event_id AND is_attended = TRUE
        )
    WHERE id = target_event_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_event_counts_trigger
    AFTER INSERT OR UPDATE OR DELETE ON event_registrations
    FOR EACH ROW EXECUTE FUNCTION sync_event_counts();

-- RLS
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register for events"
    ON event_registrations FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own registrations"
    ON event_registrations FOR SELECT USING (
        email = (SELECT email FROM profiles WHERE id = auth.uid()) OR
        user_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );

CREATE POLICY "Committee can update registrations (mark attendance)"
    ON event_registrations FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );

CREATE POLICY "Users can cancel own registration"
    ON event_registrations FOR UPDATE USING (
        user_id = auth.uid() AND status = 'registered'
    );
```

---

#### Table 13: `gallery_images`

```sql
CREATE TABLE gallery_images (
    id          SERIAL PRIMARY KEY,
    src         TEXT NOT NULL,                            -- Supabase Storage path
    thumbnail   TEXT,                                     -- thumbnail version
    title       TEXT,
    title_ne    TEXT,
    caption     TEXT,
    caption_ne  TEXT,
    event_id    INT REFERENCES events(id) ON DELETE SET NULL,
    album       TEXT,                                     -- grouping name
    width       INT,                                      -- original dimensions
    height      INT,
    file_size   TEXT,
    sort_order  INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,                    -- show on homepage/highlights
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gallery viewable by everyone" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Committee can manage gallery" ON gallery_images FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);
```

---

#### Table 14: `press_releases`

```sql
CREATE TABLE press_releases (
    id           SERIAL PRIMARY KEY,
    title        TEXT NOT NULL,
    title_ne     TEXT NOT NULL,
    slug         TEXT UNIQUE,
    excerpt      TEXT,
    excerpt_ne   TEXT,
    body         TEXT,                                    -- full article (Markdown/HTML)
    body_ne      TEXT,
    date         DATE DEFAULT CURRENT_DATE,
    category_id  INT REFERENCES categories(id) ON DELETE SET NULL,
    link         TEXT,                                    -- external link (cankavre.org.np)
    image_url    TEXT,                                    -- featured image
    author_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
    author_name  TEXT,                                    -- display name override
    is_featured  BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    view_count   INT DEFAULT 0,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER press_releases_updated_at BEFORE UPDATE ON press_releases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE press_releases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published press releases viewable" ON press_releases FOR SELECT USING (
    is_published = true OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);
CREATE POLICY "Committee can manage press releases" ON press_releases FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('committee', 'subcommittee'))
);
```

---

#### Table 15: `downloads`

```sql
CREATE TABLE downloads (
    id              SERIAL PRIMARY KEY,
    title           TEXT NOT NULL,
    title_ne        TEXT NOT NULL,
    description     TEXT,
    description_ne  TEXT,
    file_type       TEXT DEFAULT 'pdf'
                    CHECK (file_type IN ('pdf', 'image', 'document', 'spreadsheet', 'presentation', 'archive')),
    file_size       TEXT,                                 -- '2.4 MB'
    file_size_bytes BIGINT,                               -- exact bytes for sorting
    date            DATE,
    category_id     INT REFERENCES categories(id) ON DELETE SET NULL,
    download_url    TEXT NOT NULL,                        -- Supabase Storage path
    download_count  INT DEFAULT 0,
    version         TEXT,                                 -- file version (e.g., 'v2.1')
    is_published    BOOLEAN DEFAULT TRUE,
    uploaded_by     UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Downloads viewable by everyone" ON downloads FOR SELECT USING (is_published = true);
CREATE POLICY "Committee can manage downloads" ON downloads FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);
```

---

#### Table 16: `reports`

```sql
CREATE TABLE reports (
    id           SERIAL PRIMARY KEY,
    title        TEXT NOT NULL,
    title_ne     TEXT NOT NULL,
    author       TEXT,
    author_ne    TEXT,
    date         DATE,
    fiscal_year  TEXT,                                    -- '2080/81', '2079/80'
    report_type  TEXT NOT NULL
                 CHECK (report_type IN ('secretary', 'treasurer', 'coordinator', 'itclub', 'annual', 'audit')),
    file_type    TEXT DEFAULT 'pdf',
    file_size    TEXT,
    download_url TEXT NOT NULL,                           -- Supabase Storage
    summary      TEXT,                                    -- brief summary
    summary_ne   TEXT,
    download_count INT DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    uploaded_by  UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reports viewable by everyone" ON reports FOR SELECT USING (is_published = true);
CREATE POLICY "Committee can manage reports" ON reports FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);
```

---

#### Table 17: `programs`

```sql
CREATE TABLE programs (
    id              SERIAL PRIMARY KEY,
    title           TEXT NOT NULL,
    title_ne        TEXT NOT NULL,
    slug            TEXT UNIQUE,
    description     TEXT,
    description_ne  TEXT,
    full_content    TEXT,                                 -- detailed program page (Markdown)
    full_content_ne TEXT,
    icon            TEXT,                                 -- icon key: 'laptop', 'graduation-cap'
    color           TEXT DEFAULT 'primary',               -- UI color theme
    features        JSONB DEFAULT '[]'::JSONB,            -- feature list
    features_ne     JSONB DEFAULT '[]'::JSONB,
    image_url       TEXT,
    category        TEXT CHECK (category IN (
        'digital-literacy', 'it-club', 'agriculture', 'women-in-tech',
        'e-governance', 'health-ict', 'cybersecurity', 'general'
    )),
    target_audience TEXT,                                 -- who this program is for
    target_audience_ne TEXT,
    impact_stats    JSONB,                                -- {"participants": 500, "districts": 3}
    sort_order      INT DEFAULT 0,
    is_featured     BOOLEAN DEFAULT TRUE,                 -- show in featured carousel
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER programs_updated_at BEFORE UPDATE ON programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active programs viewable" ON programs FOR SELECT USING (is_active = true);
CREATE POLICY "Committee can manage programs" ON programs FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);
```

---

#### Table 18: `upcoming_programs`

```sql
CREATE TABLE upcoming_programs (
    id                  SERIAL PRIMARY KEY,
    title               TEXT NOT NULL,
    title_ne            TEXT NOT NULL,
    date                TEXT,                             -- date or range string
    start_date          DATE,
    end_date            DATE,
    deadline            DATE,                             -- registration deadline
    time                TEXT,
    location            TEXT,
    location_ne         TEXT,
    description         TEXT,
    description_ne      TEXT,
    spots               TEXT,                             -- '30 seats available'
    spots_ne            TEXT,
    max_participants    INT,
    current_participants INT DEFAULT 0,
    register_link       TEXT,                             -- external registration URL
    program_id          INT REFERENCES programs(id) ON DELETE SET NULL,
    category            TEXT,
    registration_fee    NUMERIC(10,2) DEFAULT 0,
    contact_email       TEXT,
    contact_phone       TEXT,
    is_registration_open BOOLEAN DEFAULT TRUE,
    is_active           BOOLEAN DEFAULT TRUE,
    author_id           UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER upcoming_programs_updated_at BEFORE UPDATE ON upcoming_programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE upcoming_programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active upcoming programs viewable" ON upcoming_programs FOR SELECT USING (is_active = true);
CREATE POLICY "Committee can manage" ON upcoming_programs FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);
```

---

#### Table 19: `program_registrations` (QR Support)

```sql
CREATE TABLE program_registrations (
    id                  SERIAL PRIMARY KEY,
    program_id          INT NOT NULL REFERENCES upcoming_programs(id) ON DELETE CASCADE,
    user_id             UUID REFERENCES profiles(id) ON DELETE SET NULL,
    full_name           TEXT NOT NULL,
    full_name_ne        TEXT,
    email               TEXT NOT NULL,
    phone               TEXT,
    organization        TEXT,
    registration_code   TEXT UNIQUE NOT NULL,
    qr_code_url         TEXT,
    status              TEXT DEFAULT 'registered'
                        CHECK (status IN ('registered', 'confirmed', 'attended', 'cancelled', 'waitlist')),
    is_attended         BOOLEAN DEFAULT FALSE,
    checked_in_at       TIMESTAMPTZ,
    checked_in_by       UUID REFERENCES profiles(id),
    payment_status      TEXT DEFAULT 'not-required'
                        CHECK (payment_status IN ('not-required', 'pending', 'paid', 'refunded')),
    notes               TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(program_id, email)
);

CREATE TRIGGER program_reg_updated_at BEFORE UPDATE ON program_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_program_reg_code ON program_registrations(registration_code);

-- Auto-update participant count
CREATE OR REPLACE FUNCTION sync_program_participant_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE upcoming_programs SET current_participants = (
        SELECT COUNT(*) FROM program_registrations
        WHERE program_id = COALESCE(NEW.program_id, OLD.program_id)
        AND status != 'cancelled'
    ) WHERE id = COALESCE(NEW.program_id, OLD.program_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_program_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON program_registrations
    FOR EACH ROW EXECUTE FUNCTION sync_program_participant_count();

ALTER TABLE program_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can register" ON program_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Own + committee can view" ON program_registrations FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);
CREATE POLICY "Committee can update" ON program_registrations FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);
```

---

#### Table 20: `headlines`

```sql
CREATE TABLE headlines (
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    title_ne    TEXT NOT NULL,
    date        DATE DEFAULT CURRENT_DATE,
    link        TEXT,                                     -- route or URL to navigate on click
    sort_order  INT DEFAULT 0,
    is_active   BOOLEAN DEFAULT TRUE,
    expires_at  DATE,                                     -- auto-hide after this date
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE headlines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active headlines viewable" ON headlines FOR SELECT USING (
    is_active = true AND (expires_at IS NULL OR expires_at >= CURRENT_DATE)
);
CREATE POLICY "Committee can manage" ON headlines FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);
```

---

#### Table 21: `hero_slides`

```sql
CREATE TABLE hero_slides (
    id            SERIAL PRIMARY KEY,
    image_url     TEXT NOT NULL,                          -- Supabase Storage
    title         TEXT NOT NULL,
    title_ne      TEXT NOT NULL,
    subtitle      TEXT,
    subtitle_ne   TEXT,
    cta_text      TEXT,                                   -- button label
    cta_text_ne   TEXT,
    link          TEXT,                                   -- button destination
    sort_order    INT DEFAULT 0,
    is_active     BOOLEAN DEFAULT TRUE,
    starts_at     DATE,                                   -- scheduled display
    ends_at       DATE,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active slides viewable" ON hero_slides FOR SELECT USING (
    is_active = true AND
    (starts_at IS NULL OR starts_at <= CURRENT_DATE) AND
    (ends_at IS NULL OR ends_at >= CURRENT_DATE)
);
CREATE POLICY "Committee can manage" ON hero_slides FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);
```

---

#### Table 22: `pending_approvals`

```sql
CREATE TABLE pending_approvals (
    id            SERIAL PRIMARY KEY,
    title         TEXT NOT NULL,
    content_type  TEXT NOT NULL
                  CHECK (content_type IN ('event', 'notice', 'press_release', 'download', 'program', 'gallery')),
    content_body  JSONB NOT NULL,                         -- full submission data as JSON
    author_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reviewer_id   UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status        TEXT DEFAULT 'pending'
                  CHECK (status IN ('pending', 'approved', 'rejected', 'revision_requested')),
    remarks       TEXT,                                   -- reviewer feedback
    target_table  TEXT NOT NULL,                          -- table to insert upon approval
    target_id     INT,                                    -- ID of created record after approval
    priority      TEXT DEFAULT 'normal'
                  CHECK (priority IN ('urgent', 'normal', 'low')),
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at   TIMESTAMPTZ
);

ALTER TABLE pending_approvals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authors and committee can view" ON pending_approvals FOR SELECT USING (
    author_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);
CREATE POLICY "Subcommittee and committee can submit" ON pending_approvals FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('committee', 'subcommittee'))
);
CREATE POLICY "Committee can review" ON pending_approvals FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);
```

---

#### Table 23: `feedback`

```sql
CREATE TABLE feedback (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    phone       TEXT,
    subject     TEXT,
    message     TEXT NOT NULL,
    page_url    TEXT,                                     -- which page they submitted from
    is_read     BOOLEAN DEFAULT FALSE,
    is_starred  BOOLEAN DEFAULT FALSE,                    -- mark important
    replied_at  TIMESTAMPTZ,
    replied_by  UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reply_text  TEXT,
    ip_address  INET,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit feedback" ON feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Committee can view feedback" ON feedback FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);
CREATE POLICY "Committee can update feedback" ON feedback FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);
```

---

#### Table 24: `newsletter_subscribers`

```sql
CREATE TABLE newsletter_subscribers (
    id              SERIAL PRIMARY KEY,
    email           TEXT UNIQUE NOT NULL,
    full_name       TEXT,
    is_active       BOOLEAN DEFAULT TRUE,
    source          TEXT DEFAULT 'footer',                -- where they subscribed from
    subscribed_at   TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    confirm_token   TEXT,                                 -- for double opt-in
    is_confirmed    BOOLEAN DEFAULT FALSE
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Committee can view subscribers" ON newsletter_subscribers FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);
CREATE POLICY "Unsubscribe via token" ON newsletter_subscribers FOR UPDATE USING (true);
```

---

#### Table 25: `settings`

```sql
CREATE TABLE settings (
    key         TEXT PRIMARY KEY,
    value       TEXT,
    value_ne    TEXT,                                     -- Nepali value where applicable
    category    TEXT DEFAULT 'general',                   -- group settings
    description TEXT,                                     -- what this setting does
    updated_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_by  UUID REFERENCES profiles(id) ON DELETE SET NULL
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings viewable by everyone" ON settings FOR SELECT USING (true);
CREATE POLICY "Committee can manage settings" ON settings FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);

-- Seed data
INSERT INTO settings (key, value, value_ne, category, description) VALUES
    ('site_name', 'CAN Federation Kavre', 'क्यान महासंघ काभ्रे', 'general', 'Organization name'),
    ('site_tagline', 'Lets Build e-Nepal', 'ई-नेपाल बनाऔं', 'general', 'Site tagline'),
    ('contact_email', 'cankavre@gmail.com', NULL, 'contact', 'Primary email'),
    ('contact_phone', '+977-XXX-XXXXXXX', NULL, 'contact', 'Primary phone'),
    ('address', 'Banepa, Kavrepalanchok, Bagmati Province, Nepal', 'बनेपा, काभ्रेपलाञ्चोक, बागमती प्रदेश, नेपाल', 'contact', 'Physical address'),
    ('facebook_url', 'https://facebook.com/cankavre', NULL, 'social', 'Facebook page'),
    ('youtube_url', 'https://youtube.com/@cankavre', NULL, 'social', 'YouTube channel'),
    ('registration_url', 'https://canfederation.org/member_registration', NULL, 'membership', 'External registration portal'),
    ('stat_years', '18', '१८', 'stats', 'Years of operation'),
    ('stat_clubs', '13', '१३', 'stats', 'Number of IT clubs'),
    ('stat_members', '152', '१५२', 'stats', 'Total members'),
    ('stat_events', '200', '२००', 'stats', 'Total events conducted'),
    ('mission', 'To promote ICT development in Kavrepalanchok district...', 'काभ्रेपलाञ्चोक जिल्लामा आइसिटी विकास प्रवर्द्धन...', 'about', 'Mission statement'),
    ('vision', 'e-Nepal 2025 — A digitally empowered Kavre...', 'ई-नेपाल २०२५ — डिजिटल रूपमा सशक्त काभ्रे...', 'about', 'Vision statement'),
    ('copyright_text', '© 2026 CAN Federation Kavre. All rights reserved.', NULL, 'footer', 'Copyright notice');
```

---

#### Table 26: `audit_log`

```sql
CREATE TABLE audit_log (
    id          SERIAL PRIMARY KEY,
    user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
    user_email  TEXT,                                     -- denormalized for history
    action      TEXT NOT NULL
                CHECK (action IN ('create', 'update', 'delete', 'check_in', 'approve', 'reject', 'login', 'logout', 'export')),
    table_name  TEXT NOT NULL,
    record_id   INT,
    old_data    JSONB,                                   -- previous state
    new_data    JSONB,                                   -- new state
    description TEXT,                                    -- human-readable summary
    ip_address  INET,
    user_agent  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_table ON audit_log(table_name);
CREATE INDEX idx_audit_action ON audit_log(action);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Committee can view audit log" ON audit_log FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);
CREATE POLICY "System can insert audit entries" ON audit_log FOR INSERT WITH CHECK (true);
```

---

#### Table 27: `contact_messages`

```sql
CREATE TABLE contact_messages (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    phone       TEXT,
    subject     TEXT NOT NULL,
    message     TEXT NOT NULL,
    category    TEXT DEFAULT 'general'
                CHECK (category IN ('general', 'membership', 'event', 'sponsorship', 'complaint', 'suggestion')),
    status      TEXT DEFAULT 'new'
                CHECK (status IN ('new', 'read', 'replied', 'archived')),
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    replied_at  TIMESTAMPTZ,
    ip_address  INET,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Committee can view" ON contact_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);
CREATE POLICY "Committee can update" ON contact_messages FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);
```

---

#### Table 28: `tags`

```sql
CREATE TABLE tags (
    id      SERIAL PRIMARY KEY,
    name    TEXT NOT NULL UNIQUE,
    name_ne TEXT,
    slug    TEXT UNIQUE
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tags viewable by everyone" ON tags FOR SELECT USING (true);
CREATE POLICY "Committee can manage tags" ON tags FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);
```

---

#### Table 29: `content_tags` (Polymorphic Junction)

```sql
CREATE TABLE content_tags (
    id          SERIAL PRIMARY KEY,
    tag_id      INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL
                CHECK (content_type IN ('event', 'notice', 'press_release', 'program', 'download')),
    content_id  INT NOT NULL,
    UNIQUE(tag_id, content_type, content_id)
);

CREATE INDEX idx_content_tags_lookup ON content_tags(content_type, content_id);

ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Content tags viewable" ON content_tags FOR SELECT USING (true);
CREATE POLICY "Committee can manage" ON content_tags FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);
```

---

#### Table 30: `page_views` (Analytics)

```sql
CREATE TABLE page_views (
    id          SERIAL PRIMARY KEY,
    page_path   TEXT NOT NULL,                            -- '/events', '/programs', etc.
    page_title  TEXT,
    referrer    TEXT,
    user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
    session_id  TEXT,                                     -- anonymous session tracking
    device_type TEXT,                                     -- 'mobile', 'desktop', 'tablet'
    browser     TEXT,
    country     TEXT,
    ip_address  INET,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_page_views_path ON page_views(page_path);
CREATE INDEX idx_page_views_date ON page_views(created_at);

-- Partition by month for performance (optional, good for production)
-- CREATE TABLE page_views (...) PARTITION BY RANGE (created_at);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "System can insert views" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Committee can view analytics" ON page_views FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
);
```

---

### 2.5 Entity-Relationship Diagram

```
auth.users (Supabase managed)
    │
    └── profiles (1:1)
            │
            ├──→ committee_members (uploaded photos, user_id link)
            ├──→ subcommittee_members.user_id ←── subcommittees
            ├──→ membership_applications (user_id, reviewed_by)
            │
            ├──→ notices.author_id
            ├──→ events.author_id
            │       │
            │       ├──→ event_registrations (many)
            │       │       ├── .user_id → profiles
            │       │       └── .checked_in_by → profiles
            │       └──→ gallery_images.event_id
            │
            ├──→ press_releases.author_id
            ├──→ upcoming_programs.author_id
            │       └──→ program_registrations (many)
            │               ├── .user_id → profiles
            │               └── .checked_in_by → profiles
            │
            ├──→ pending_approvals (author_id, reviewer_id)
            ├──→ audit_log.user_id
            ├──→ feedback.replied_by
            ├──→ contact_messages.assigned_to
            ├──→ downloads.uploaded_by
            ├──→ reports.uploaded_by
            └──→ settings.updated_by

past_committees ←── committee_members.term_id

categories ──┬── press_releases.category_id
             ├── downloads.category_id
             └── events.category_id

programs ──→ upcoming_programs.program_id

membership_types ──→ membership_applications.membership_type_id

tags ──→ content_tags ──→ (events, notices, press_releases, programs, downloads)
```

### 2.6 Supabase Storage Buckets

| Bucket | Purpose | Max Size | Allowed Types | Access |
|--------|---------|----------|---------------|--------|
| `avatars` | User profile photos | 2MB | image/* | Public read, owner write |
| `committee-photos` | Committee member photos | 5MB | image/* | Public read, committee write |
| `event-images` | Event cover images | 10MB | image/* | Public read, committee write |
| `gallery` | Event photo gallery | 10MB | image/* | Public read, committee write |
| `downloads` | PDF/document files | 50MB | pdf, doc, docx, xls, xlsx, pptx, zip | Public read, committee write |
| `reports` | Report files | 50MB | pdf, doc, docx, xls, xlsx | Public read, committee write |
| `hero-slides` | Homepage slider images | 10MB | image/* | Public read, committee write |
| `qr-codes` | Generated QR code images | 1MB | image/png | Authenticated read, server write |
| `membership-docs` | Citizenship, academic docs | 10MB | image/*, pdf | Owner + committee read/write |

### 2.7 Database Views (Convenience Queries)

```sql
-- Current committee members (excludes past)
CREATE VIEW current_committee AS
SELECT * FROM committee_members WHERE term_id IS NULL AND is_active = TRUE ORDER BY sort_order;

-- Active headlines (not expired)
CREATE VIEW active_headlines AS
SELECT * FROM headlines WHERE is_active = TRUE AND (expires_at IS NULL OR expires_at >= CURRENT_DATE)
ORDER BY sort_order;

-- Upcoming events
CREATE VIEW upcoming_events AS
SELECT * FROM events WHERE status = 'upcoming' AND is_published = TRUE ORDER BY date ASC;

-- Event attendance summary
CREATE VIEW event_attendance_summary AS
SELECT
    e.id AS event_id,
    e.title,
    e.date,
    COUNT(er.id) AS total_registered,
    COUNT(er.id) FILTER (WHERE er.is_attended = TRUE) AS total_attended,
    COUNT(er.id) FILTER (WHERE er.status = 'no-show') AS total_no_show,
    CASE WHEN COUNT(er.id) > 0
        THEN ROUND(COUNT(er.id) FILTER (WHERE er.is_attended = TRUE)::NUMERIC / COUNT(er.id) * 100, 1)
        ELSE 0 END AS attendance_rate
FROM events e
LEFT JOIN event_registrations er ON er.event_id = e.id AND er.status != 'cancelled'
GROUP BY e.id, e.title, e.date;

-- Admin dashboard stats
CREATE VIEW admin_dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM profiles WHERE is_active = TRUE) AS total_users,
    (SELECT COUNT(*) FROM events WHERE is_published = TRUE) AS total_events,
    (SELECT COUNT(*) FROM notices WHERE is_published = TRUE) AS total_notices,
    (SELECT COUNT(*) FROM press_releases WHERE is_published = TRUE) AS total_press_releases,
    (SELECT COUNT(*) FROM programs WHERE is_active = TRUE) AS total_programs,
    (SELECT COUNT(*) FROM downloads WHERE is_published = TRUE) AS total_downloads,
    (SELECT COUNT(*) FROM gallery_images) AS total_gallery_images,
    (SELECT COUNT(*) FROM it_clubs WHERE is_active = TRUE) AS total_it_clubs,
    (SELECT COUNT(*) FROM pending_approvals WHERE status = 'pending') AS pending_approvals,
    (SELECT COUNT(*) FROM feedback WHERE is_read = FALSE) AS unread_feedback,
    (SELECT COUNT(*) FROM contact_messages WHERE status = 'new') AS new_messages,
    (SELECT COUNT(*) FROM newsletter_subscribers WHERE is_active = TRUE) AS newsletter_count;
```

---

## 3. Event Management & QR Attendance System

### 3.1 System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                       REGISTRATION FLOW                          │
│                                                                  │
│  1. User visits /events/:id (event detail page)                  │
│  2. Clicks "Register" button                                    │
│  3. Fills form: name, email, phone, organization                │
│  4. Supabase Edge Function:                                     │
│       a. Validates event exists & registration open              │
│       b. Checks capacity (max_attendees)                        │
│       c. Checks duplicate (email + event_id unique)             │
│       d. Generates unique registration_code (EVT-2026-XXXXX)   │
│       e. Generates QR code image → stores in Supabase Storage   │
│       f. Inserts into event_registrations (is_attended=false)   │
│       g. Sends confirmation email with QR attached              │
│  5. User sees success page with:                                │
│       - Registration code                                       │
│       - QR code image (downloadable)                            │
│       - Event details recap                                     │
│       - "Add to Calendar" button                                │
│  6. User saves QR on phone for event day                        │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                        CHECK-IN FLOW                             │
│                                                                  │
│  1. Admin opens /admin/scan (mobile-friendly page)               │
│  2. Selects active event from dropdown                          │
│  3. Camera activates (html5-qrcode library)                     │
│  4. Scans attendee's QR code                                    │
│  5. QR contains: https://cankavre.org.np/verify/EVT-2026-00123  │
│  6. Backend logic:                                              │
│       a. Extract registration_code from URL                     │
│       b. Find in event_registrations table                      │
│       c. Verify admin is authenticated with 'committee' role    │
│       d. Check if already attended:                             │
│          - YES → ⚠️ "Already checked in at 10:32 AM"           │
│          - NO  → ✅ Mark is_attended=true, set checked_in_at    │
│       e. Return attendee info + event stats                     │
│  7. Admin screen shows:                                         │
│       ✅ "Welcome, Ram Chandra Nyaupane!" (green flash)          │
│       ⚠️ "Already checked in at 10:32 AM" (yellow flash)        │
│       ❌ "Invalid ticket" (red flash)                            │
│  8. Audio feedback: beep (success) / buzz (error)               │
│  9. Auto-resets scanner after 3 seconds                         │
│  10. Live counter updates: "47/120 checked in"                  │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 QR Code Specification

| Aspect | Detail |
|--------|--------|
| **Content** | `https://cankavre.org.np/verify/{registration_code}` |
| **Example** | `https://cankavre.org.np/verify/EVT-2026-04821-KX7P` |
| **Format** | PNG image, 400×400px, 2px margin |
| **Colors** | Dark: `#1a365d` (navy), Light: `#ffffff` (white) |
| **Error Correction** | Level M (15% recovery) |
| **Storage** | `qr-codes/{event_id}/{registration_code}.png` in Supabase Storage |
| **Security** | Contains ONLY the registration code — NO personal data (name, email, phone) |

**Registration Code Format:** `EVT-{YEAR}-{RANDOM_5_DIGITS}-{RANDOM_4_ALPHA}`  
Example: `EVT-2026-04821-KX7P`

### 3.3 New Frontend Routes

| Route | Component | Purpose | Auth Required |
|-------|-----------|---------|---------------|
| `/events/:id` | `EventDetail` | Full event detail page with register button | ❌ |
| `/events/:id/register` | `EventRegister` | Registration form | ❌ |
| `/events/:id/register/success` | `RegistrationSuccess` | QR code display + confirmation | ❌ |
| `/verify/:code` | `VerifyAttendance` | QR scan landing page — triggers check-in | ✅ committee |
| `/admin/scan` | `AdminScanner` | Camera-based QR scanner for event staff | ✅ committee |
| `/admin/events/:id/attendance` | `AttendanceReport` | Live attendance dashboard per event | ✅ committee |
| `/admin/events/:id/registrations` | `RegistrationsList` | All registrations with export | ✅ committee |
| `/my/registrations` | `MyRegistrations` | User's own event registrations + QR codes | ✅ any |

### 3.4 Required Libraries

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x",
    "qrcode.react": "^4.0.0",
    "html5-qrcode": "^2.3.8",
    "uuid": "^9.0.0"
  }
}
```

### 3.5 Supabase Edge Functions

#### `generate-registration` — Registration Handler

```typescript
// supabase/functions/generate-registration/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import QRCode from 'https://esm.sh/qrcode@1.5.3'

serve(async (req) => {
    const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { event_id, full_name, full_name_ne, email, phone, organization, user_id } = await req.json()

    // 1. Validate event
    const { data: event, error: eventErr } = await supabase
        .from('events').select('*').eq('id', event_id).single()
    if (!event) return new Response(JSON.stringify({ error: 'Event not found' }), { status: 404 })
    if (!event.is_registration_open) return new Response(JSON.stringify({ error: 'Registration closed' }), { status: 400 })
    if (event.registration_deadline && new Date(event.registration_deadline) < new Date()) {
        return new Response(JSON.stringify({ error: 'Registration deadline passed' }), { status: 400 })
    }
    if (event.max_attendees && event.registered_count >= event.max_attendees) {
        return new Response(JSON.stringify({ error: 'Event is full' }), { status: 400 })
    }

    // 2. Check duplicate
    const { data: existing } = await supabase
        .from('event_registrations').select('id, registration_code')
        .eq('event_id', event_id).eq('email', email).single()
    if (existing) {
        return new Response(JSON.stringify({
            error: 'Already registered', registration_code: existing.registration_code
        }), { status: 409 })
    }

    // 3. Generate unique code
    const rand5 = String(Math.floor(Math.random() * 99999)).padStart(5, '0')
    const rand4 = Math.random().toString(36).slice(2, 6).toUpperCase()
    const regCode = `EVT-${new Date().getFullYear()}-${rand5}-${rand4}`

    // 4. Generate QR code
    const verifyUrl = `https://cankavre.org.np/verify/${regCode}`
    const qrBuffer = await QRCode.toBuffer(verifyUrl, {
        width: 400, margin: 2,
        color: { dark: '#1a365d', light: '#ffffff' },
        errorCorrectionLevel: 'M'
    })

    // 5. Upload QR to Storage
    const qrPath = `qr-codes/${event_id}/${regCode}.png`
    await supabase.storage.from('qr-codes').upload(qrPath, qrBuffer, { contentType: 'image/png' })
    const { data: { publicUrl: qrUrl } } = supabase.storage.from('qr-codes').getPublicUrl(qrPath)

    // 6. Insert registration
    const { data: registration, error } = await supabase
        .from('event_registrations')
        .insert({
            event_id:           event_id,
            user_id:            user_id || null,
            full_name:          full_name,
            full_name_ne:       full_name_ne || null,
            email:              email,
            phone:              phone || null,
            organization:       organization || null,
            registration_code:  regCode,
            qr_code_url:        qrUrl,
            qr_data:            verifyUrl,
            status:             'registered'
        })
        .select().single()

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

    // 7. Log audit
    await supabase.from('audit_log').insert({
        user_id: user_id || null,
        action: 'create',
        table_name: 'event_registrations',
        record_id: registration.id,
        new_data: { event_id, full_name, email, registration_code: regCode },
        description: `Registered for event: ${event.title}`
    })

    // 8. TODO: Send email via Resend/SendGrid with QR attachment

    return new Response(JSON.stringify({
        success: true,
        registration_code: regCode,
        qr_code_url: qrUrl,
        event_title: event.title,
        event_date: event.date,
        event_location: event.location
    }), { headers: { 'Content-Type': 'application/json' } })
})
```

#### `verify-attendance` — Check-In Handler

```typescript
// supabase/functions/verify-attendance/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
    const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return new Response('Unauthorized', { status: 401 })

    // Verify JWT and get admin user
    const { data: { user: authUser } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (!authUser) return new Response('Invalid token', { status: 401 })

    const { data: admin } = await supabase
        .from('profiles').select('role, full_name').eq('id', authUser.id).single()
    if (!admin || admin.role !== 'committee') {
        return new Response(JSON.stringify({
            status: 'error', message: 'Admin access required'
        }), { status: 403 })
    }

    const { registration_code } = await req.json()

    // 1. Find registration with event details
    const { data: reg } = await supabase
        .from('event_registrations')
        .select('*, events(id, title, title_ne, date, location)')
        .eq('registration_code', registration_code)
        .single()

    if (!reg) {
        return new Response(JSON.stringify({
            status: 'invalid', message: 'Invalid ticket — registration not found'
        }), { status: 404 })
    }

    // 2. Check if cancelled
    if (reg.status === 'cancelled') {
        return new Response(JSON.stringify({
            status: 'cancelled', message: 'This registration was cancelled',
            attendee: reg.full_name
        }))
    }

    // 3. Check if already checked in
    if (reg.is_attended) {
        const checkedInTime = new Date(reg.checked_in_at).toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit'
        })
        return new Response(JSON.stringify({
            status: 'duplicate',
            message: `Already checked in at ${checkedInTime}`,
            attendee: reg.full_name,
            checked_in_at: reg.checked_in_at
        }))
    }

    // 4. Mark as attended
    const now = new Date().toISOString()
    const { error } = await supabase
        .from('event_registrations')
        .update({
            is_attended: true,
            checked_in_at: now,
            checked_in_by: authUser.id,
            check_in_method: 'qr',
            status: 'attended'
        })
        .eq('id', reg.id)

    if (error) return new Response(JSON.stringify({ status: 'error', message: error.message }), { status: 500 })

    // 5. Get updated counts
    const { data: counts } = await supabase
        .from('event_registrations')
        .select('is_attended')
        .eq('event_id', reg.event_id)
        .neq('status', 'cancelled')

    const totalReg = counts?.length || 0
    const totalAttended = counts?.filter(r => r.is_attended).length || 0

    // 6. Audit log
    await supabase.from('audit_log').insert({
        user_id: authUser.id,
        user_email: authUser.email,
        action: 'check_in',
        table_name: 'event_registrations',
        record_id: reg.id,
        new_data: { is_attended: true, checked_in_at: now },
        description: `Checked in ${reg.full_name} for ${reg.events?.title}`
    })

    return new Response(JSON.stringify({
        status: 'success',
        message: `Welcome, ${reg.full_name}!`,
        attendee: {
            name: reg.full_name,
            email: reg.email,
            phone: reg.phone,
            organization: reg.organization,
            event: reg.events?.title,
            event_date: reg.events?.date,
            registration_code: reg.registration_code
        },
        stats: {
            total_registered: totalReg,
            total_attended: totalAttended,
            attendance_rate: totalReg > 0 ? Math.round(totalAttended / totalReg * 100) : 0
        }
    }), { headers: { 'Content-Type': 'application/json' } })
})
```

### 3.6 Attendance Reporting Queries

```sql
-- Total registrations for an event
SELECT COUNT(*) AS total_registered
FROM event_registrations
WHERE event_id = :event_id AND status != 'cancelled';

-- Attendance rate
SELECT
    COUNT(*) FILTER (WHERE status != 'cancelled') AS registered,
    COUNT(*) FILTER (WHERE is_attended = TRUE) AS attended,
    COUNT(*) FILTER (WHERE status = 'no-show') AS no_shows,
    ROUND(
        COUNT(*) FILTER (WHERE is_attended = TRUE)::NUMERIC /
        NULLIF(COUNT(*) FILTER (WHERE status != 'cancelled'), 0) * 100, 1
    ) AS attendance_rate_pct
FROM event_registrations
WHERE event_id = :event_id;

-- Check-in timeline (live dashboard — grouped by 15-min slots)
SELECT
    DATE_TRUNC('quarter_hour', checked_in_at) AS time_slot,
    COUNT(*) AS check_ins
FROM event_registrations
WHERE event_id = :event_id AND is_attended = TRUE
GROUP BY time_slot ORDER BY time_slot;

-- List of no-shows (post-event followup)
SELECT full_name, email, phone, organization
FROM event_registrations
WHERE event_id = :event_id AND is_attended = FALSE AND status != 'cancelled';

-- Export full attendee list (CSV download)
SELECT
    full_name, email, phone, organization, designation,
    registration_code, status, is_attended,
    checked_in_at, check_in_method, payment_status,
    feedback_rating, feedback_comment, created_at
FROM event_registrations
WHERE event_id = :event_id
ORDER BY created_at;

-- Organization-wise breakdown
SELECT
    COALESCE(organization, 'Individual') AS org,
    COUNT(*) AS total,
    COUNT(*) FILTER (WHERE is_attended = TRUE) AS attended
FROM event_registrations
WHERE event_id = :event_id AND status != 'cancelled'
GROUP BY org ORDER BY total DESC;

-- Admin who checked in the most
SELECT
    p.full_name AS admin_name,
    COUNT(*) AS check_ins
FROM event_registrations er
JOIN profiles p ON p.id = er.checked_in_by
WHERE er.event_id = :event_id AND er.is_attended = TRUE
GROUP BY p.full_name ORDER BY check_ins DESC;
```

### 3.7 Security Architecture

| Threat | Mitigation |
|--------|------------|
| **QR contains personal data** | QR encodes ONLY the registration code URL — no PII |
| **Anyone scans and marks attended** | `verify-attendance` function checks `role = 'committee'` via Supabase Auth JWT. RLS enforces UPDATE restriction. |
| **Double check-in** | `is_attended` boolean check before update. Response shows original check-in time. |
| **QR code forgery** | Codes are random (`EVT-2026-04821-KX7P`), not sequential. Verification hits database. |
| **Registration spam** | `UNIQUE(event_id, email)` constraint. Optional: rate limiting via Edge Function. |
| **Capacity overflow** | `max_attendees` check at registration time + concurrent safety via DB constraint. |
| **Unauthorized data export** | RLS policies restrict `SELECT` on registrations to owner + committee. Audit log tracks exports. |
| **Offline scanning** | Scanner requires internet. For poor connectivity: batch scan mode saves codes locally, syncs when back online. |
| **SQL injection** | Supabase client uses parameterized queries. Edge Functions never concatenate user input. |
| **Token theft** | JWTs are short-lived (Supabase default: 1hr). Refresh tokens stored in httpOnly cookies. |

### 3.8 Email Notifications (via Resend or Supabase SMTP)

| Trigger | Recipient | Email Content |
|---------|-----------|---------------|
| Registration completed | Registrant | ✅ Confirmation + QR code image + event details + "Add to Calendar" link |
| Event reminder (1 day before) | All registered | 📅 Reminder + QR code + venue details + Google Maps link |
| Check-in confirmation | Attendee | 🎉 "Thanks for attending!" + feedback form link |
| Event cancelled | All registered | ❌ Cancellation notice + any refund info |
| Registration approaching capacity | Committee | ⚠️ "Event at 80% capacity" alert |
| Post-event summary | Committee | 📊 Attendance report (registered vs attended, rate, timeline) |

### 3.9 Admin Scanner UI Requirements

```
┌─────────────────────────────────────────┐
│  🔍 SCAN ATTENDANCE     [Event: ▼]     │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │         📷 CAMERA FEED         │   │
│  │     (html5-qrcode scanner)     │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ✅ Welcome, Ram Chandra!        │   │
│  │    Organization: CAN Kavre      │   │
│  │    Checked in at: 10:32 AM      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ── Live Stats ──────────────           │
│  Registered: 120                        │
│  Checked In: 47  (39.2%)               │
│  ████████████░░░░░░░░░░░░░░ 39%        │
│                                         │
│  [Manual Check-in]  [View Full List]    │
└─────────────────────────────────────────┘
```

**Features:**
- Event selector dropdown (only active events)
- Camera viewfinder with scan animation
- Result flash: green (success), yellow (duplicate), red (invalid)
- Audio feedback: beep/buzz
- Auto-reset after 3 seconds
- Live attendance counter + progress bar
- Manual check-in button (search by name/email for walk-ins)
- "View Full List" link → attendance report page
- Works on mobile (responsive design)
- Torch/flashlight toggle for dark venues

---

## 4. Migration Plan (SQLite → Supabase)

### Phase 1: Supabase Project Setup
1. Create project at [supabase.com](https://supabase.com)
2. Execute all SQL from Section 2.3–2.4 in SQL Editor
3. Configure Storage buckets (Section 2.6)
4. Create database views (Section 2.7)
5. Set environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
6. Install `@supabase/supabase-js` in frontend

### Phase 2: Replace Auth System
1. Remove `server/auth.js` (JWT middleware) and `server/create_test_users.js`
2. Create `src/lib/supabase.ts` — Supabase client initialization
3. Rewrite `AuthContext.tsx`:
   - `login()` → `supabase.auth.signInWithPassword()`
   - `register()` → `supabase.auth.signUp({ options: { data: { full_name, role } } })`
   - `logout()` → `supabase.auth.signOut()`
   - `refreshUser()` → `supabase.auth.getSession()`
4. Update `Auth.tsx` to use new auth functions
5. Auto-profile creation via `on_auth_user_created` trigger

### Phase 3: Replace API Layer
1. Remove `server/index.js` Express server
2. Remove `server/db.js` SQLite connection
3. Rewrite `src/lib/api.ts`:
   ```typescript
   // Before (Express REST)
   const res = await fetch(`${API_URL}/api/events`)
   const data = await res.json()

   // After (Supabase)
   const { data, error } = await supabase.from('events')
     .select('*').eq('is_published', true).order('date', { ascending: false })
   ```
4. Replace `contentApi<T>(table)` factory with typed Supabase queries
5. Update React Query hooks to use Supabase

### Phase 4: Migrate Existing SQLite Data
1. Export: `sqlite3 server/data.sqlite3 ".dump"` → SQL file
2. Transform INSERT statements: SQLite → PostgreSQL syntax
3. Map `users` → `profiles` (create auth.users first via Supabase Admin API)
4. Map old integer IDs to new serial IDs
5. Upload via Supabase SQL Editor or `supabase db seed`

### Phase 5: Move Hardcoded Content → Database
1. Seed `headlines` (5 items from `Index.tsx`)
2. Seed `hero_slides` (3 slides from `Index.tsx`)
3. Seed `membership_types` (3 tiers from `Membership.tsx`)
4. Seed `categories` (5 categories from `PressReleases.tsx`)
5. Seed `programs` (6 featured from `Programs.tsx`)
6. Seed `subcommittees` (6 from `About.tsx`)
7. Seed `it_clubs` (4 from `About.tsx`)
8. Seed `past_committees` + link historical `committee_members`
9. Seed `settings` (15+ key-value pairs)
10. Upload files to Storage: downloads (4), reports (8)
11. Upload gallery images (6) to `gallery` bucket
12. Update all page components to fetch from Supabase instead of hardcoded arrays

### Phase 6: Implement Event Management & QR System
1. Deploy Edge Functions (`generate-registration`, `verify-attendance`)
2. Build `EventDetail` page with registration button
3. Build `EventRegister` form component
4. Build `RegistrationSuccess` page (QR display)
5. Build `AdminScanner` page (camera + verification)
6. Build `AttendanceReport` dashboard
7. Set up email integration (Resend or Supabase SMTP)
8. Test end-to-end with real mobile devices

### Phase 7: Production Hardening
1. Enable Supabase email confirmation (double opt-in)
2. Set up database backups (Supabase Pro plan auto-backups)
3. Configure custom domain (`api.cankavre.org.np`)
4. Set up monitoring and alerts
5. Performance: add database indexes, enable connection pooling
6. Security audit: review all RLS policies, test edge cases

---

## Appendix: Coverage Verification

### All hardcoded content → database mapping completeness

| Content Block | File | Hardcoded Items | Target Table | Covered? |
|---------------|------|-----------------|--------------|----------|
| Headlines | Index.tsx | 5 | `headlines` | ✅ |
| Hero slides | Index.tsx | 3 | `hero_slides` | ✅ |
| Latest news | Index.tsx | 3 | `press_releases` | ✅ |
| Upcoming events | Index.tsx | 3 | `events` | ✅ |
| Quick links | Index.tsx | 6 | Static (no DB) | ✅ |
| Stats | Index.tsx | 4 | `settings` | ✅ |
| Mission/Vision | Index.tsx | 3 | `settings` | ✅ |
| Committee | About.tsx | 14 | `committee_members` | ✅ |
| Past committees | About.tsx | 3 terms | `past_committees` | ✅ |
| Subcommittees | About.tsx | 6 | `subcommittees` | ✅ |
| IT clubs | About.tsx | 4 | `it_clubs` | ✅ |
| Featured programs | Programs.tsx | 6 | `programs` | ✅ |
| Upcoming programs | Programs.tsx | DB-driven | `upcoming_programs` | ✅ |
| Events | Events.tsx | 4 | `events` | ✅ |
| Gallery | Events.tsx | 6 | `gallery_images` | ✅ |
| Notices | Notice.tsx | 5 | `notices` | ✅ |
| Press releases | PressReleases.tsx | 6 | `press_releases` | ✅ |
| Categories | PressReleases.tsx | 5 | `categories` | ✅ |
| Downloads | Downloads.tsx | 4 | `downloads` | ✅ |
| Reports | Downloads.tsx | 8 | `reports` | ✅ |
| Membership types | Membership.tsx | 3 | `membership_types` | ✅ |
| Required docs | Membership.tsx | 4 | `settings` or code | ✅ |
| Pending approvals | Admin.tsx | 3 mock | `pending_approvals` | ✅ |
| Admin sections | Admin.tsx | 7 | Dynamic from DB views | ✅ |
| Feedback form | Footer.tsx | Client-only | `feedback` | ✅ |
| Newsletter form | Footer.tsx | Client-only | `newsletter_subscribers` | ✅ |
| Contact info | Footer.tsx | Hardcoded | `settings` | ✅ |
| Social links | Footer.tsx | 2 | `settings` | ✅ |
| Nav links | Navbar.tsx | Static | Static (no DB) | ✅ |
| Users/Auth | Auth.tsx | API-driven | `profiles` + Supabase Auth | ✅ |
| Search entries | staticSearchEntries.ts | 70+ | Dynamic from all tables | ✅ |
| Translations | translations.ts | 150+ keys | Code (no DB needed) | ✅ |
| Event registrations | N/A (new) | — | `event_registrations` | ✅ |
| Program registrations | N/A (new) | — | `program_registrations` | ✅ |
| Membership applications | N/A (new) | — | `membership_applications` | ✅ |
| Contact messages | N/A (new) | — | `contact_messages` | ✅ |
| Tags | N/A (new) | — | `tags` + `content_tags` | ✅ |
| Page analytics | N/A (new) | — | `page_views` | ✅ |
| Admin audit trail | N/A (new) | — | `audit_log` | ✅ |

**Total: 30 tables covering 100% of existing + new content needs.**

---

*This document serves as the complete reference for CAN Kavre's content architecture, Supabase database design (30 tables, all with RLS), and event management system with QR-based attendance tracking.*
