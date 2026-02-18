# CAN Kavre — Live Site vs Localhost Feature Comparison

> **Live Site:** [https://www.cankavre.org.np/](https://www.cankavre.org.np/)  
> **Localhost Build:** Vite + React + TypeScript + Express backend  
> **Generated:** 2026-02-17

Legend:
- `[x]` — Expected in the Live site (present or implied)
- `[ ]` — Missing in the Live site but **present in the Localhost build** (new upgrade)

---

## 1. Core Organization Info

| # | Feature | Live | Localhost | Notes |
|---|---------|:----:|:---------:|-------|
| 1.1 | Organization name & logo (CAN Federation Kavre) | [x] | [x] | Live uses WordPress header; Localhost uses custom React Navbar with logo image |
| 1.2 | "Let's Build e-Nepal" top banner | [x] | [x] | Both display the tagline; Localhost adds Nepali-flag-colored stripes (red/green/blue) |
| 1.3 | About Us page | [x] | [x] | Live has basic static page; Localhost has rich tabbed layout with stats cards |
| 1.4 | Vision / Mission / Objectives section | [x] | [x] | Live mentions mission implicitly; Localhost has dedicated accordion with icons |
| 1.5 | 10th Convention (अधिवेशन) History | [x] | [x] | Live prominently features the 18th AGM + 10th Convention article; Localhost references it in history text & committee period labels |
| 1.6 | Executive Committee list — Pres. Ram Chandra Nyaupane | [x] | [x] | ✅ **RESOLVED** — Localhost now lists the actual 10th Convention elected body: President Ram Chandra Nyaupane, Sr. VP Shrawan Kumar Acharya, VP Dipak Sapkota, Sec. Devaki Acharya, Treasurer Kewal Prasad Timalsina, Joint Sec. Rukesh Rajbhandari, plus 8 members |
| 1.7 | Full elected body (Sr. VP, VP, Secretary, Treasurer, Joint Sec. + Members) | [x] | [x] | All 14 committee members now listed with Nepali names |
| 1.8 | Past Committee history (5th–7th periods) | [x] | [x] | Live references past leadership; Localhost has toggleable past-committees tab with 5th/6th/7th data |
| 1.9 | Member count / statistics (152+ members mentioned on Live) | [x] | [x] | Live quotes 152 in article; Localhost shows 500+ (aspirational) with animated stat cards |

### Checklist — Core Organization Info

- [x] Organization branding & logo
- [x] "Let's Build e-Nepal" banner
- [x] About Us page with history
- [x] Vision / Mission / Objectives
- [x] 10th Convention coverage
- [x] Full executive committee positions structure
- [x] ~~Actual committee member names from live site~~ ✅ **RESOLVED**
- [x] Past committee history
- [x] Member/stats counters

---

## 2. Membership System

| # | Feature | Live | Localhost | Notes |
|---|---------|:----:|:---------:|-------|
| 2.1 | Membership page | [x] | [x] | Live links to CAN Federation central portal; Localhost has dedicated `/membership` page |
| 2.2 | Membership types (Life, Individual, Institutional) | [x] | [x] | ✅ **RESOLVED** — Localhost now displays all 3 types with cards: Life (NRS 6,000), Individual (NRS 800/yr), Institutional (NRS 5,000/yr) |
| 2.3 | Fee structure (NRS 6,000 Life / NRS 800 Individual) | [x] | [x] | ✅ **RESOLVED** — Fee amounts displayed as prominent badges on each membership card with bilingual support |
| 2.4 | Required document uploads (Nationality, Academic certificates) | [x] | [x] | ✅ **RESOLVED** — Dedicated Required Documents section with: Citizenship, Academic Certificates, Photo, Professional Certificates |
| 2.5 | External registration redirect (canfederation.org) | [x] | [x] | Both link to `canfederation.org/member_registration` |
| 2.6 | Membership renewal notices | [x] | [x] | Localhost Notice page has "Membership Renewal Deadline Extended" notice |

### Checklist — Membership System

- [x] Membership page exists
- [x] ~~Membership types breakdown (Life / Individual / Institutional)~~ ✅ **RESOLVED**
- [x] ~~Fee structure display (NRS 6,000 / 800)~~ ✅ **RESOLVED**
- [x] ~~Document upload requirements listed~~ ✅ **RESOLVED**
- [x] Link to CAN Federation central registration
- [x] Renewal deadline notices

---

## 3. Committee & Sub-Committees

| # | Feature | Live | Localhost | Notes |
|---|---------|:----:|:---------:|-------|
| 3.1 | Current executive committee display | [x] | [x] | Localhost has card-based display with photo placeholders, position, and contact |
| 3.2 | Sub-committee listing | [x] | [x] | Localhost now defines 6 sub-committees: Health IT, Education IT, Agriculture IT, Women IT, E-Village, Business & ICT Meet |
| 3.3 | E-Village sub-committee | [x] | [x] | ✅ **RESOLVED** — Added "E-Village Subcommittee" (ई-गाउँ उपसमिति) focusing on smart village & e-governance at local level |
| 3.4 | Education sub-committee | [x] | [x] | Present as "Education IT Subcommittee" |
| 3.5 | Business Meet (ICT Business Meat) | [x] | [x] | Live features "व्यावसायी सँग आईसीटी बिजनेस मिट" article; Localhost has it in headlines/news |
| 3.6 | IT Club coordination | [x] | [x] | Localhost has dedicated IT Clubs tab with 4 clubs listed, plus IT Club coordinator reports |
| 3.7 | Committee member photo management | [x] | [x] | Localhost supports photo via `photo` field on `CommitteeMember` interface (currently empty placeholders) |
| 3.8 | Sub-committee member counts | [ ] | [x] | Live doesn't show individual sub-committee counts; Localhost displays member count per sub-committee |
| 3.9 | Sub-committee content submission workflow | [ ] | [x] | Not on live site; Localhost Admin has "Pending Approvals from Subcommittees" with approve/reject flow |

### Checklist — Committee & Sub-Committees

- [x] Executive committee cards
- [x] Sub-committee listing
- [x] ~~E-Village dedicated sub-committee~~ ✅ **RESOLVED**
- [x] Education IT sub-committee
- [x] Business Meet / ICT program integration
- [x] IT Club coordination & listing
- [x] Photo-ready member cards
- [ ] Sub-committee member counts *(Localhost-only enhancement)*
- [ ] Sub-committee content approval workflow *(Localhost-only enhancement)*

---

## 4. New Functional Upgrades (Localhost-Only)

These features exist **only in the Localhost build** and are not present on the live WordPress site.

| # | Feature | Live | Localhost | Notes |
|---|---------|:----:|:---------:|-------|
| 4.1 | Member Login Portal (`/auth`) | [ ] | [x] | Full login/register UI with committee & member account types |
| 4.2 | JWT-based Authentication (Backend) | [ ] | [x] | Express server with `bcrypt` password hashing, JWT token issuance, 7-day expiry |
| 4.3 | Role-Based Access Control (RBAC) | [ ] | [x] | `requireRole()` middleware; roles: `committee`, `member`; route-level protection |
| 4.4 | User Registration (Backend) | [ ] | [x] | `/api/register` endpoint with email uniqueness check, role assignment |
| 4.5 | Committee Admin Dashboard (`/admin`) | [ ] | [x] | Quick stats, pending approvals, content management sections, settings panel |
| 4.6 | Content Approval Workflow | [ ] | [x] | Sub-committee submissions → committee approve/reject flow in Admin dashboard |
| 4.7 | Role-separated Login (Committee vs Sub-committee) | [ ] | [x] | Membership page has tabs for Committee Login and Sub-committee Login |
| 4.8 | Member Profile Endpoint (`/api/users/me`) | [ ] | [x] | Returns authenticated user's profile data |
| 4.9 | User Management Endpoint (`/api/users`) | [ ] | [x] | Committee-only; lists all registered users |
| 4.10 | SQLite Database (`data.sqlite3`) | [ ] | [x] | Persistent storage for user accounts with `id, fullName, email, password, role, createdAt` |
| 4.11 | Inline Edit Buttons (open editing) | [ ] | [x] | `EditButton` component on multiple sections for quick content editing |
| 4.12 | Bilingual UI (English/Nepali toggle) | [ ] | [x] | `LanguageContext` with full translation keys; `LanguageSwitcher` component in Navbar |
| 4.13 | Splash Screen | [ ] | [x] | Animated intro screen on first load |
| 4.14 | Global Search Panel | [ ] | [x] | `SearchContext` + `SearchPanel` with static search entries; accessible from Navbar |
| 4.15 | Responsive SPA with Client-Side Routing | [ ] | [x] | React Router with dedicated pages; mobile-friendly with drawer navigation |

### Checklist — New Functional Upgrades

- [ ] **Member Login Portal** *(Localhost-only)*
- [ ] **JWT Authentication Backend** *(Localhost-only)*
- [ ] **RBAC (Role-Based Access Control)** *(Localhost-only)*
- [ ] **User Registration API** *(Localhost-only)*
- [ ] **Committee Admin Dashboard** *(Localhost-only)*
- [ ] **Content Approval Workflow** *(Localhost-only)*
- [ ] **Role-separated Login UI** *(Localhost-only)*
- [ ] **Member Profile Management API** *(Localhost-only)*
- [ ] **User Management API** *(Localhost-only)*
- [ ] **SQLite Persistent Database** *(Localhost-only)*
- [ ] **Inline Edit Buttons** *(Localhost-only)*
- [ ] **Bilingual UI (EN/NE)** *(Localhost-only)*
- [ ] **Splash Screen** *(Localhost-only)*
- [ ] **Global Search** *(Localhost-only)*
- [ ] **SPA with Client-Side Routing** *(Localhost-only)*

---

## 5. Dynamic Content

| # | Feature | Live | Localhost | Notes |
|---|---------|:----:|:---------:|-------|
| 5.1 | Notice Board | [x] | [x] | Live has basic notices; Localhost has rich `/notice` page with priority levels (high/medium/low), type badges, bilingual content |
| 5.2 | Recent News / Press Releases | [x] | [x] | Live shows news via WordPress posts; Localhost has `/press-releases` with search, category filtering, pagination |
| 5.3 | Headline Ticker / News Scroller | [x] | [x] | Both have scrolling headline bar; Localhost uses auto-rotating ticker with dot navigation |
| 5.4 | Events listing | [x] | [x] | Live lists events in posts; Localhost has structured `/events` page with status badges (upcoming/ongoing/completed), attendee counts |
| 5.5 | Photo Gallery | [x] | [x] | Live has basic image display; Localhost has lightbox gallery with add/remove editing, zoom, file upload |
| 5.6 | Contact Information (address, phone, email) | [x] | [x] | Both display Banepa address, phone, and `cankavre@gmail.com` |
| 5.7 | Feedback / Contact Form | [x] | [x] | Live has basic contact; Localhost has rich footer feedback form with captcha (math problem), name, email, phone, message |
| 5.8 | Newsletter Subscription | [ ] | [x] | Not on live site; Localhost has email subscription form in footer |
| 5.9 | Social Media Links (Facebook, YouTube) | [x] | [x] | Both link to Facebook and YouTube; Localhost adds styled icon buttons |
| 5.10 | Downloads / Resources section | [x] | [x] | Live has some downloadable content; Localhost has organized `/downloads` with tabs: General Resources, Secretary Reports, Treasurer Reports, Coordinator Reports, IT Club Reports |
| 5.11 | Programs / Initiatives page | [x] | [x] | Localhost has comprehensive `/programs` page with 6 program areas (Digital Literacy, IT Club Dev, ICT in Agriculture, Women in Tech, E-Governance, Health & ICT), upcoming registrations, achievement stats |
| 5.12 | Blog-style articles (WordPress posts) | [x] | [ ] | Live uses WordPress for blog posts with rich text; Localhost uses structured data arrays — **no CMS/blog engine** |
| 5.13 | Hero carousel / image slider | [x] | [x] | Both have image sliders; Localhost uses shadcn Carousel with Unsplash images |
| 5.14 | Quick Links sidebar | [x] | [x] | Live has sidebar widgets; Localhost has Quick Links section on homepage |

### Checklist — Dynamic Content

- [x] Notice Board with priority levels
- [x] Press Releases with search & filters
- [x] Headline ticker / scroller
- [x] Events with status tracking
- [x] Photo Gallery with lightbox
- [x] Contact information display
- [x] Feedback form with captcha
- [ ] Newsletter subscription *(Localhost-only enhancement)*
- [x] Social media integration
- [x] Downloads / documents section
- [x] Programs & initiatives page
- [ ] **CMS / blog-style article publishing** (Live has WordPress; Localhost needs a CMS or Markdown-based blog)
- [x] Hero image carousel
- [x] Quick Links

---

## Summary Scorecard

| Category | Live Features Matched | Localhost-Only Additions | Gaps to Fill |
|----------|:---------------------:|:------------------------:|:------------:|
| Core Organization Info | 9/9 ✅ | 0 | 0 |
| Membership System | 6/6 ✅ | 0 | 0 |
| Committee & Sub-Committees | 7/7 ✅ | 2 | 0 |
| New Functional Upgrades | 0/15 | 15 | 0 (all Localhost-only) |
| Dynamic Content | 11/12 | 1 | 1 (CMS/blog engine) |
| **TOTAL** | **33/49** | **18** | **1** |

---

## Action Items (Priority)

### ✅ Completed — Data Parity (Resolved 2026-02-17)
1. ~~**Update committee member names**~~ — All 14 members from 10th Convention now in `About.tsx`
2. ~~**Add membership types & fee structure**~~ — Life (NRS 6,000), Individual (NRS 800/yr), Institutional (NRS 5,000/yr) cards with benefits
3. ~~**List required documents**~~ — Citizenship, Academic Certificates, Photo, IT Certificates sections added
4. ~~**Add E-Village sub-committee**~~ — Added to sub-committees with Business & ICT Meet

### Remaining — Feature Additions
5. **Add a CMS or admin blog-post editor** to replace hard-coded press releases/news with database-driven content

### Enhancement — Nice to Have
6. Replace placeholder Unsplash images with actual CAN Kavre event photos
7. Connect the frontend Auth/Login forms to the backend Express API (`/api/login`, `/api/register`)
8. Wire the Admin dashboard content management to real database CRUD operations

---

*This document serves as a feature-parity checklist between the CAN Kavre live WordPress site and the new React-based Localhost system. Update this file as features are implemented.*
