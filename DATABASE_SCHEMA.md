# CAN Kavre — Complete Database Schema

> **Purpose:** All tables required to move from hardcoded data to a fully database-driven system.  
> **Engine:** SQLite 3 (current: `server/data.sqlite3`) — portable to PostgreSQL/MySQL if needed.  
> **Generated:** 2026-02-17

---

## Overview

The live site (cankavre.org.np) runs on **WordPress + MySQL** with standard `wp_` prefixed tables.  
This schema defines the **equivalent tables** your localhost system needs so every piece of content currently hardcoded in React components or managed by WordPress becomes database-backed.

| # | Table | Maps to (Live Site) | Currently in Code |
|---|-------|---------------------|-------------------|
| 1 | `users` | `wp_users` + `wp_usermeta` | `server/db.js` — **already exists** |
| 2 | `committee_members` | WordPress custom post / page content | `About.tsx` → `initialCommitteeMembers` |
| 3 | `past_committees` | WordPress page content | `About.tsx` → `initialPastCommittees` |
| 4 | `subcommittees` | WordPress page content | `About.tsx` → `initialSubcommittees` |
| 5 | `it_clubs` | WordPress page content | `About.tsx` → `initialItClubs` |
| 6 | `membership_types` | CAN Federation registration portal data | `Membership.tsx` → `membershipTypes` |
| 7 | `notices` | `wp_posts` (type: notice/announcement) | `Notice.tsx` → `initialNotices` |
| 8 | `events` | `wp_posts` (type: event) | `Events.tsx` → `initialEvents` |
| 9 | `gallery_images` | WordPress media library + gallery plugin | `Events.tsx` → `initialGalleryImages` |
| 10 | `press_releases` | `wp_posts` (type: post) | `PressReleases.tsx` → `initialPressReleases` |
| 11 | `categories` | `wp_terms` + `wp_term_taxonomy` | `PressReleases.tsx` → `categories` |
| 12 | `downloads` | WordPress media attachments | `Downloads.tsx` → `initialGeneralDownloads` |
| 13 | `reports` | WordPress media attachments | `Downloads.tsx` → `initialReports` |
| 14 | `programs` | `wp_posts` (type: page/program) | `Programs.tsx` → `programs` |
| 15 | `upcoming_programs` | `wp_posts` (type: event) | `Programs.tsx` → `upcomingPrograms` |
| 16 | `headlines` | WordPress featured posts / sticky posts | `Index.tsx` → `headlines` |
| 17 | `hero_slides` | WordPress slider plugin (e.g., Smart Slider) | `Index.tsx` → `heroSlides` |
| 18 | `pending_approvals` | No equivalent (new feature) | `Admin.tsx` → `pendingApprovals` |
| 19 | `feedback` | WordPress contact form plugin (CF7/WPForms) | `Footer.tsx` → feedback form |
| 20 | `newsletter_subscribers` | No equivalent (new feature) | `Footer.tsx` → newsletter form |
| 21 | `settings` | `wp_options` | General site config |

---

## Table Definitions (SQL)

### 1. `users` ✅ Already Exists

```sql
CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName    TEXT,
    email       TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL,
    role        TEXT NOT NULL DEFAULT 'member',  -- 'committee' | 'subcommittee' | 'member'
    phone       TEXT,
    avatar      TEXT,                            -- profile photo URL
    isActive    INTEGER DEFAULT 1,
    createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**WordPress equivalent:** `wp_users` (ID, user_login, user_pass, user_email, user_registered) + `wp_usermeta` (role stored as `wp_capabilities`).

---

### 2. `committee_members`

```sql
CREATE TABLE IF NOT EXISTS committee_members (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    nameNe      TEXT NOT NULL,               -- Nepali (Devanagari)
    position    TEXT NOT NULL,               -- 'President', 'Senior Vice President', etc.
    positionNe  TEXT NOT NULL,
    contact     TEXT,
    photo       TEXT,                        -- photo URL/path
    termId      INTEGER,                     -- FK → past_committees.id (NULL = current)
    sortOrder   INTEGER DEFAULT 0,
    isActive    INTEGER DEFAULT 1,
    createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**WordPress equivalent:** Custom post type or page content with ACF fields. On the live site, committee data is embedded in the 10th Convention article body.

**Live site data to extract (14 members):**

| position | name | nameNe |
|----------|------|--------|
| President | Ram Chandra Nyaupane | रामचन्द्र न्यौपाने |
| Senior Vice President | Shrawan Kumar Acharya | श्रवण कुमार आचार्य |
| Vice President | Dipak Sapkota | दिपक सापकोटा |
| Secretary | Devaki Acharya | देवकी आचार्य |
| Treasurer | Kewal Prasad Timalsina | केवल प्रसाद तिमल्सिना |
| Joint Secretary | Rukesh Rajbhandari | रुकेश राजभण्डारी |
| Member | Rishi Ram Gautam | ऋषिराम गौतम |
| Member | Rita Shrestha | रीता श्रेष्ठ |
| Member | Vivek Timalsina | विवेक तिमल्सिना |
| Member | Shyam Gopal Shrestha | श्याम गोपाल श्रेष्ठ |
| Member | Abodh Bhushan Khoju Shrestha | अवोध भुषण खोजु श्रेष्ठ |
| Member | Ujwal Thapa Magar | उज्वल थापा मगर |
| Member | Prakash Paudel | प्रकाश पौडेल |
| Member | Umesh Adhikari | उमेश अधिकारी |

---

### 3. `past_committees`

```sql
CREATE TABLE IF NOT EXISTS past_committees (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    period      TEXT NOT NULL,               -- '7th Committee (2077-2079)'
    periodNe    TEXT NOT NULL,
    category    TEXT,                        -- '7th', '6th', etc.
    sortOrder   INTEGER DEFAULT 0,
    createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Relationship:** `committee_members.termId` → `past_committees.id`. Current committee has `termId = NULL`.

---

### 4. `subcommittees`

```sql
CREATE TABLE IF NOT EXISTS subcommittees (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    nameNe      TEXT NOT NULL,
    focus       TEXT,
    focusNe     TEXT,
    memberCount INTEGER DEFAULT 0,
    type        TEXT,                        -- 'health', 'education', 'agriculture', 'women', 'evillage', 'business'
    isActive    INTEGER DEFAULT 1,
    createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Live site data (6 sub-committees):** Health IT, Education IT, Agriculture IT, Women IT, E-Village, Business & ICT Meet.

---

### 5. `it_clubs`

```sql
CREATE TABLE IF NOT EXISTS it_clubs (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    nameNe      TEXT NOT NULL,
    students    INTEGER DEFAULT 0,
    established INTEGER,                     -- year (e.g. 2019)
    location    TEXT,
    locationNe  TEXT,
    isActive    INTEGER DEFAULT 1,
    createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**WordPress equivalent:** Likely a custom post type or a dedicated page listing clubs.

---

### 6. `membership_types`

```sql
CREATE TABLE IF NOT EXISTS membership_types (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    type            TEXT NOT NULL,            -- 'Life Membership'
    typeNe          TEXT NOT NULL,
    fee             TEXT NOT NULL,            -- 'NRS 6,000'
    feeNe           TEXT NOT NULL,
    feeAmount       REAL,                    -- 6000.00 (numeric for sorting/logic)
    isRecurring     INTEGER DEFAULT 0,       -- 0 = one-time, 1 = annual
    description     TEXT,
    descriptionNe   TEXT,
    benefits        TEXT,                    -- JSON array of benefit strings
    benefitsNe      TEXT,                    -- JSON array of Nepali benefit strings
    sortOrder       INTEGER DEFAULT 0,
    isActive        INTEGER DEFAULT 1,
    createdAt       DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Live site equivalent:** Managed by CAN Federation central portal (`canfederation.org`).

| type | feeAmount | isRecurring |
|------|-----------|-------------|
| Life Membership | 6000 | 0 |
| Individual Membership | 800 | 1 |
| Institutional Membership | 5000 | 1 |

---

### 7. `notices`

```sql
CREATE TABLE IF NOT EXISTS notices (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    titleNe     TEXT NOT NULL,
    content     TEXT,
    contentNe   TEXT,
    date        TEXT,                        -- ISO date string
    priority    TEXT DEFAULT 'medium',       -- 'high' | 'medium' | 'low'
    type        TEXT DEFAULT 'info',         -- 'announcement' | 'deadline' | 'info'
    authorId    INTEGER,                     -- FK → users.id
    isPublished INTEGER DEFAULT 1,
    createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**WordPress equivalent:** `wp_posts` with `post_type = 'post'` and category "Notice" or a custom post type.

---

### 8. `events`

```sql
CREATE TABLE IF NOT EXISTS events (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    titleNe     TEXT NOT NULL,
    date        TEXT,                        -- event date (ISO)
    time        TEXT,                        -- e.g. '10:00 AM'
    location    TEXT,
    locationNe  TEXT,
    description TEXT,
    descriptionNe TEXT,
    attendees   INTEGER DEFAULT 0,
    status      TEXT DEFAULT 'upcoming',     -- 'upcoming' | 'ongoing' | 'completed'
    image       TEXT,                        -- cover image URL
    authorId    INTEGER,                     -- FK → users.id
    isPublished INTEGER DEFAULT 1,
    createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**WordPress equivalent:** `wp_posts` with event category or a plugin like "The Events Calendar".

---

### 9. `gallery_images`

```sql
CREATE TABLE IF NOT EXISTS gallery_images (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    src         TEXT NOT NULL,               -- image URL or file path
    title       TEXT,
    titleNe     TEXT,
    eventId     INTEGER,                     -- FK → events.id (optional link)
    sortOrder   INTEGER DEFAULT 0,
    uploadedBy  INTEGER,                     -- FK → users.id
    createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**WordPress equivalent:** `wp_posts` (type: attachment) + gallery plugin metadata.

---

### 10. `press_releases`

```sql
CREATE TABLE IF NOT EXISTS press_releases (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    titleNe     TEXT NOT NULL,
    excerpt     TEXT,
    excerptNe   TEXT,
    body        TEXT,                        -- full article content (Markdown/HTML)
    bodyNe      TEXT,
    date        TEXT,
    categoryId  INTEGER,                     -- FK → categories.id
    link        TEXT,                        -- external link if any
    image       TEXT,                        -- featured image
    authorId    INTEGER,                     -- FK → users.id
    isPublished INTEGER DEFAULT 1,
    createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**WordPress equivalent:** `wp_posts` (type: post). This is the core blog content table.

---

### 11. `categories`

```sql
CREATE TABLE IF NOT EXISTS categories (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL UNIQUE,        -- 'Events', 'IT Club', 'Training', etc.
    nameNe      TEXT NOT NULL,
    slug        TEXT UNIQUE,
    parentId    INTEGER,                     -- FK → categories.id (for hierarchy)
    sortOrder   INTEGER DEFAULT 0,
    createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**WordPress equivalent:** `wp_terms` + `wp_term_taxonomy` + `wp_term_relationships`.

**Seed data:** Events, IT Club, Training, Partnership, Organization.

---

### 12. `downloads`

```sql
CREATE TABLE IF NOT EXISTS downloads (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    titleNe     TEXT NOT NULL,
    description TEXT,
    descriptionNe TEXT,
    fileType    TEXT DEFAULT 'pdf',          -- 'pdf' | 'image' | 'document'
    fileSize    TEXT,                        -- e.g. '2.4 MB'
    date        TEXT,
    categoryId  INTEGER,                     -- FK → categories.id
    downloadUrl TEXT NOT NULL,               -- file path or URL
    downloadCount INTEGER DEFAULT 0,
    isPublished INTEGER DEFAULT 1,
    createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**WordPress equivalent:** `wp_posts` (type: attachment) with download plugin.

---

### 13. `reports`

```sql
CREATE TABLE IF NOT EXISTS reports (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    titleNe     TEXT NOT NULL,
    author      TEXT,
    authorNe    TEXT,
    date        TEXT,
    reportType  TEXT NOT NULL,               -- 'secretary' | 'treasurer' | 'coordinator' | 'itclub'
    fileType    TEXT DEFAULT 'pdf',
    fileSize    TEXT,
    downloadUrl TEXT NOT NULL,
    isPublished INTEGER DEFAULT 1,
    createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**WordPress equivalent:** Uploaded as media attachments or linked from pages.

---

### 14. `programs`

```sql
CREATE TABLE IF NOT EXISTS programs (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    titleNe     TEXT NOT NULL,
    description TEXT,
    descriptionNe TEXT,
    icon        TEXT,                        -- icon key: 'laptop', 'graduationCap', etc.
    color       TEXT DEFAULT 'primary',      -- 'primary' | 'secondary' | 'accent'
    features    TEXT,                        -- JSON array
    featuresNe  TEXT,                        -- JSON array
    image       TEXT,
    sortOrder   INTEGER DEFAULT 0,
    isActive    INTEGER DEFAULT 1,
    createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**WordPress equivalent:** Custom post type or pages under "Programs" parent.

**Seed data (6):** Digital Literacy, IT Club Dev, ICT in Agriculture, Women in Tech, E-Governance Support, Health & ICT.

---

### 15. `upcoming_programs`

```sql
CREATE TABLE IF NOT EXISTS upcoming_programs (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    titleNe     TEXT NOT NULL,
    date        TEXT,                        -- date or date range string
    location    TEXT,
    locationNe  TEXT,
    spots       TEXT,                        -- e.g. '30 seats available'
    spotsNe     TEXT,
    registerLink TEXT,                       -- external registration URL
    programId   INTEGER,                     -- FK → programs.id (optional)
    isActive    INTEGER DEFAULT 1,
    createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

### 16. `headlines`

```sql
CREATE TABLE IF NOT EXISTS headlines (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    titleNe     TEXT NOT NULL,
    date        TEXT,
    link        TEXT,                        -- route or URL to navigate on click
    sortOrder   INTEGER DEFAULT 0,
    isActive    INTEGER DEFAULT 1,
    createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**WordPress equivalent:** Sticky posts or a "Breaking News" ticker plugin.

---

### 17. `hero_slides`

```sql
CREATE TABLE IF NOT EXISTS hero_slides (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    image       TEXT NOT NULL,               -- image URL
    title       TEXT NOT NULL,
    titleNe     TEXT NOT NULL,
    subtitle    TEXT,
    subtitleNe  TEXT,
    link        TEXT,                        -- optional CTA link
    sortOrder   INTEGER DEFAULT 0,
    isActive    INTEGER DEFAULT 1,
    createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**WordPress equivalent:** Slider plugin (Smart Slider, Revolution Slider, or theme built-in).

---

### 18. `pending_approvals` (Localhost-Only — New Feature)

```sql
CREATE TABLE IF NOT EXISTS pending_approvals (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    contentType TEXT NOT NULL,               -- 'Event', 'Press Release', 'Notice', 'Download', etc.
    contentBody TEXT,                        -- JSON or Markdown of the submitted content
    authorId    INTEGER NOT NULL,            -- FK → users.id (subcommittee user who submitted)
    reviewerId  INTEGER,                     -- FK → users.id (committee user who reviewed)
    status      TEXT DEFAULT 'pending',      -- 'pending' | 'approved' | 'rejected'
    remarks     TEXT,                        -- reviewer remarks
    targetTable TEXT,                        -- table name to insert into upon approval
    createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewedAt  DATETIME
);
```

---

### 19. `feedback`

```sql
CREATE TABLE IF NOT EXISTS feedback (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    phone       TEXT,
    message     TEXT NOT NULL,
    isRead      INTEGER DEFAULT 0,
    repliedAt   DATETIME,
    createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**WordPress equivalent:** Contact Form 7 / WPForms submissions (stored in `wp_posts` or plugin-specific tables).

---

### 20. `newsletter_subscribers` (Localhost-Only — New Feature)

```sql
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    email       TEXT UNIQUE NOT NULL,
    isActive    INTEGER DEFAULT 1,
    subscribedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    unsubscribedAt DATETIME
);
```

---

### 21. `settings`

```sql
CREATE TABLE IF NOT EXISTS settings (
    key         TEXT PRIMARY KEY,
    value       TEXT,
    updatedAt   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**WordPress equivalent:** `wp_options` (option_name, option_value).

**Example rows:**

| key | value |
|-----|-------|
| `site_name` | `CAN Federation Kavre` |
| `site_name_ne` | `क्यान महासंघ काभ्रे` |
| `contact_email` | `cankavre@gmail.com` |
| `contact_phone` | `+977-XXX-XXXXXXX` |
| `address` | `Banepa, Kavrepalanchok, Bagmati Province, Nepal` |
| `address_ne` | `बनेपा, काभ्रेपलाञ्चोक, बागमती प्रदेश, नेपाल` |
| `facebook_url` | `https://facebook.com/cankavre` |
| `youtube_url` | `https://youtube.com/@cankavre` |

---

## Entity-Relationship Summary

```
users ──────────────┬──── pending_approvals (authorId, reviewerId)
                    ├──── notices (authorId)
                    ├──── events (authorId)
                    ├──── press_releases (authorId)
                    └──── gallery_images (uploadedBy)

past_committees ────── committee_members (termId)

categories ─────────┬──── press_releases (categoryId)
                    └──── downloads (categoryId)

events ─────────────── gallery_images (eventId)

programs ───────────── upcoming_programs (programId)
```

---

## WordPress Tables to Query (Live Site)

If you gain database access to the live WordPress installation at `cankavre.org.np`, these are the key `wp_` tables to export:

| WP Table | What to Extract | Maps to Local Table |
|----------|-----------------|---------------------|
| `wp_posts` | All posts (type: post, page, attachment) | `press_releases`, `notices`, `events`, `downloads`, `programs` |
| `wp_postmeta` | Custom field values (committee data, event details) | Various — field-specific mapping |
| `wp_terms` | Categories and tags | `categories` |
| `wp_term_taxonomy` | Category/tag type info | `categories` |
| `wp_term_relationships` | Post ↔ Category links | `press_releases.categoryId`, `downloads.categoryId` |
| `wp_users` | Admin/editor accounts | `users` |
| `wp_usermeta` | User roles, profile data | `users.role`, `users.phone` |
| `wp_options` | Site title, tagline, URLs, plugin settings | `settings` |
| `wp_comments` | Comment data (if any) | Not mapped (skip unless needed) |

### Recommended Export Commands (wp-cli or phpMyAdmin)

```bash
# If you have wp-cli access on the server:
wp db export cankavre_backup.sql --tables=wp_posts,wp_postmeta,wp_terms,wp_term_taxonomy,wp_term_relationships,wp_users,wp_usermeta,wp_options

# Or via mysqldump:
mysqldump -u DB_USER -p DB_NAME wp_posts wp_postmeta wp_terms wp_term_taxonomy wp_term_relationships wp_users wp_usermeta wp_options > cankavre_backup.sql
```

---

## Migration Script Skeleton

Once you have the WordPress data, use this mapping to populate your SQLite tables:

```
wp_posts (post_type='post', category='Notice')    → notices
wp_posts (post_type='post', category='Event')      → events
wp_posts (post_type='post', category='Press')       → press_releases
wp_posts (post_type='attachment')                    → downloads, gallery_images
wp_posts (post_type='page', parent='Programs')       → programs
wp_terms + wp_term_taxonomy                           → categories
wp_users + wp_usermeta                                → users
wp_options                                            → settings
```

Manual extraction needed for:
- **Committee member names** — embedded in article body text (already extracted and hardcoded)
- **Sub-committee list** — from page content (already extracted)
- **Hero slider images** — from slider plugin data in `wp_options` or `wp_postmeta`

---

## Quick Setup — Create All Tables

Run this in a single script to initialize the complete database:

```sql
-- server/migrations/001_init.sql

-- 1. Users (already exists, but add new columns)
ALTER TABLE users ADD COLUMN phone TEXT;
ALTER TABLE users ADD COLUMN avatar TEXT;
ALTER TABLE users ADD COLUMN isActive INTEGER DEFAULT 1;
ALTER TABLE users ADD COLUMN updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP;

-- 2-21. All other tables
CREATE TABLE IF NOT EXISTS committee_members ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, nameNe TEXT NOT NULL, position TEXT NOT NULL, positionNe TEXT NOT NULL, contact TEXT, photo TEXT, termId INTEGER, sortOrder INTEGER DEFAULT 0, isActive INTEGER DEFAULT 1, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP );

CREATE TABLE IF NOT EXISTS past_committees ( id INTEGER PRIMARY KEY AUTOINCREMENT, period TEXT NOT NULL, periodNe TEXT NOT NULL, category TEXT, sortOrder INTEGER DEFAULT 0, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP );

CREATE TABLE IF NOT EXISTS subcommittees ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, nameNe TEXT NOT NULL, focus TEXT, focusNe TEXT, memberCount INTEGER DEFAULT 0, type TEXT, isActive INTEGER DEFAULT 1, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP );

CREATE TABLE IF NOT EXISTS it_clubs ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, nameNe TEXT NOT NULL, students INTEGER DEFAULT 0, established INTEGER, location TEXT, locationNe TEXT, isActive INTEGER DEFAULT 1, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP );

CREATE TABLE IF NOT EXISTS membership_types ( id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT NOT NULL, typeNe TEXT NOT NULL, fee TEXT NOT NULL, feeNe TEXT NOT NULL, feeAmount REAL, isRecurring INTEGER DEFAULT 0, description TEXT, descriptionNe TEXT, benefits TEXT, benefitsNe TEXT, sortOrder INTEGER DEFAULT 0, isActive INTEGER DEFAULT 1, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP );

CREATE TABLE IF NOT EXISTS notices ( id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, titleNe TEXT NOT NULL, content TEXT, contentNe TEXT, date TEXT, priority TEXT DEFAULT 'medium', type TEXT DEFAULT 'info', authorId INTEGER, isPublished INTEGER DEFAULT 1, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP );

CREATE TABLE IF NOT EXISTS events ( id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, titleNe TEXT NOT NULL, date TEXT, time TEXT, location TEXT, locationNe TEXT, description TEXT, descriptionNe TEXT, attendees INTEGER DEFAULT 0, status TEXT DEFAULT 'upcoming', image TEXT, authorId INTEGER, isPublished INTEGER DEFAULT 1, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP );

CREATE TABLE IF NOT EXISTS gallery_images ( id INTEGER PRIMARY KEY AUTOINCREMENT, src TEXT NOT NULL, title TEXT, titleNe TEXT, eventId INTEGER, sortOrder INTEGER DEFAULT 0, uploadedBy INTEGER, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP );

CREATE TABLE IF NOT EXISTS press_releases ( id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, titleNe TEXT NOT NULL, excerpt TEXT, excerptNe TEXT, body TEXT, bodyNe TEXT, date TEXT, categoryId INTEGER, link TEXT, image TEXT, authorId INTEGER, isPublished INTEGER DEFAULT 1, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP );

CREATE TABLE IF NOT EXISTS categories ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, nameNe TEXT NOT NULL, slug TEXT UNIQUE, parentId INTEGER, sortOrder INTEGER DEFAULT 0, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP );

CREATE TABLE IF NOT EXISTS downloads ( id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, titleNe TEXT NOT NULL, description TEXT, descriptionNe TEXT, fileType TEXT DEFAULT 'pdf', fileSize TEXT, date TEXT, categoryId INTEGER, downloadUrl TEXT NOT NULL, downloadCount INTEGER DEFAULT 0, isPublished INTEGER DEFAULT 1, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP );

CREATE TABLE IF NOT EXISTS reports ( id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, titleNe TEXT NOT NULL, author TEXT, authorNe TEXT, date TEXT, reportType TEXT NOT NULL, fileType TEXT DEFAULT 'pdf', fileSize TEXT, downloadUrl TEXT NOT NULL, isPublished INTEGER DEFAULT 1, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP );

CREATE TABLE IF NOT EXISTS programs ( id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, titleNe TEXT NOT NULL, description TEXT, descriptionNe TEXT, icon TEXT, color TEXT DEFAULT 'primary', features TEXT, featuresNe TEXT, image TEXT, sortOrder INTEGER DEFAULT 0, isActive INTEGER DEFAULT 1, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP );

CREATE TABLE IF NOT EXISTS upcoming_programs ( id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, titleNe TEXT NOT NULL, date TEXT, location TEXT, locationNe TEXT, spots TEXT, spotsNe TEXT, registerLink TEXT, programId INTEGER, isActive INTEGER DEFAULT 1, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP );

CREATE TABLE IF NOT EXISTS headlines ( id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, titleNe TEXT NOT NULL, date TEXT, link TEXT, sortOrder INTEGER DEFAULT 0, isActive INTEGER DEFAULT 1, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP );

CREATE TABLE IF NOT EXISTS hero_slides ( id INTEGER PRIMARY KEY AUTOINCREMENT, image TEXT NOT NULL, title TEXT NOT NULL, titleNe TEXT NOT NULL, subtitle TEXT, subtitleNe TEXT, link TEXT, sortOrder INTEGER DEFAULT 0, isActive INTEGER DEFAULT 1, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP );

CREATE TABLE IF NOT EXISTS pending_approvals ( id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, contentType TEXT NOT NULL, contentBody TEXT, authorId INTEGER NOT NULL, reviewerId INTEGER, status TEXT DEFAULT 'pending', remarks TEXT, targetTable TEXT, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, reviewedAt DATETIME );

CREATE TABLE IF NOT EXISTS feedback ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, message TEXT NOT NULL, isRead INTEGER DEFAULT 0, repliedAt DATETIME, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP );

CREATE TABLE IF NOT EXISTS newsletter_subscribers ( id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, isActive INTEGER DEFAULT 1, subscribedAt DATETIME DEFAULT CURRENT_TIMESTAMP, unsubscribedAt DATETIME );

CREATE TABLE IF NOT EXISTS settings ( key TEXT PRIMARY KEY, value TEXT, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP );
```

---

*This schema covers every data entity in the CAN Kavre system. Use it to request database access from the live site hosting provider, export WordPress data, and migrate to your SQLite-backed localhost system.*
