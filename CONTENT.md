# CAN Kavre Website Content Inventory

Last updated: June 6, 2026

Use this document as the source map for Gemini when reviewing or rewriting website copy. It separates the current hardcoded content in the codebase from the content provided by CAN Kavre leadership in the image and follow-up notes.

## Source Legend
- Hardcoded content: text currently embedded in TSX, translation, search, or page files.
- Provided content: text supplied by the user in the image or direct message.
- Unverified content: content currently on the site that still needs confirmation from CAN Kavre.

## Global Content

### Current hardcoded content
- Top banner text: "Let's Build eNepal Together, We CAN."
- Navbar labels: Home, About Us, Committee, Programs, News, Calendar, Downloads.
- Footer quick links and newsletter/feedback forms.
- Search index text and site-wide summaries.

### Provided content
- Organization name: CAN Federation Kavre / CAN Kavre.
- Established: 2058 B.S.
- Slogan: "Let’s Build eNepal Together, We CAN."
- Address: Secretariat Office, Banepa-Godamchok, Kavrepalanchok, Nepal.
- Phone numbers: 9841315182 / 9851237483.
- Emails: cankavre@gmail.com, info@cankavre.org.np (coming soon), support@cankavre.org.np (coming soon).
- Office hours: Sunday - Friday, 10:00 AM - 5:00 PM.
- Registration status: registration number currently under renewal; PAN/VAT to be updated soon.

## Page 1: Home `/`

### Current site content
- Hero banner and slides with the slogan-driven headline.
- Welcome banner with "Computer Association of Nepal / Kavre Branch / Established 2058 B.S."
- News ticker with sample headlines such as "Let's Build eNepal Together, We CAN." and "Career Opportunities in ICT 2080".
- Stats block showing 25+, 13+, 152+, and 200+.
- Mission, vision, and objectives accordion.
- Latest news cards, upcoming events, and quick links.

### Hardcoded content sources
- [src/pages/Index.tsx](src/pages/Index.tsx)
- [src/lib/translations.ts](src/lib/translations.ts)
- [src/lib/staticSearchEntries.ts](src/lib/staticSearchEntries.ts)

### Provided content to use
- Slogan: "Let’s Build eNepal Together, We CAN."
- Mission: Promote ICT development and digital transformation.
- Vision: Build a digitally empowered Kavre through innovation, ICT advancement, digital literacy, entrepreneurship, and professional collaboration for a smart Nepal.
- Objectives: Promote ICT development and digital transformation; support ICT professionals, students, and entrepreneurs; organize training, workshops, exhibitions, and awareness programs; encourage innovation, research, and technology-based opportunities; strengthen coordination among government, private sector, and educational institutions.

### Gemini notes
- Keep the same layout, but replace any unverified headline, stat, or event copy.
- Do not invent numbers for the stats until CAN Kavre confirms them.

## Page 2: About `/about`

### Current site content
- About intro and history paragraph.
- Current committee cards with placeholder names and contacts.
- Past committees for 9th, 8th, and 7th committees.
- Subcommittees with placeholder focus areas and member counts.
- IT club cards with placeholder student counts and establishment years.
- About-page stats cards for members, IT clubs, beneficiaries, and years active.

### Hardcoded content sources
- [src/pages/About.tsx](src/pages/About.tsx)
- [src/lib/translations.ts](src/lib/translations.ts)

### Current hardcoded committee data
- Ram Chandra Nyaupane
- Shrawan Kumar Acharya
- Dipak Sapkota
- Devaki Acharya
- Kewal Prasad Timalsina
- Rukesh Rajbhandari
- Rishi Ram Gautam, Rita Shrestha, Vivek Timalsina, Shyam Gopal Shrestha, Abodh Bhushan Khoju Shrestha, Ujwal Thapa Magar, Prakash Paudel, Umesh Adhikari

### Provided content to use
- Organization history: CAN Federation Kavre is a district-level ICT organization based at the Secretariat Office in Banepa-Godamchok, Kavrepalanchok.
- Founded in 2058 B.S.
- Operates under the coordination of Bagmati Province.
- Works through ICT awareness, training, and collaboration.
- Registration number is under renewal; PAN/VAT will be updated soon.

### Gemini notes
- Replace the placeholder committee and subcommittee data only when verified names, photos, and contacts are available.
- Keep the tabbed structure, but treat the current list as unverified until the organization confirms it.

## Page 3: Programs `/programs`

### Current site content
- Achievement counters: 13+ IT clubs, 2000+ citizens trained, 100+ programs, 13+ municipalities covered.
- Six program cards:
    - Digital Literacy Campaign
    - IT Club Development
    - ICT in Agriculture
    - Women in Tech
    - E-Governance Support
    - Health & ICT
- Upcoming program examples and CTA sections.

### Hardcoded content sources
- [src/pages/Programs.tsx](src/pages/Programs.tsx)
- [src/lib/staticSearchEntries.ts](src/lib/staticSearchEntries.ts)

### Provided content to use
- No verified program list was supplied in the image.
- Use only the mission/vision/objective language from the provided content until actual program records are available.

### Gemini notes
- This page still contains a lot of generic ICT placeholder copy.
- Ask for actual program names, dates, beneficiaries, outcomes, and photos before finalizing.

## Page 4: Events `/events`

### Current site content
- Event listing and gallery sections.
- Sample event headlines, dates, and images on the home page and event page.

### Hardcoded content sources
- [src/pages/Events.tsx](src/pages/Events.tsx)
- [src/pages/Index.tsx](src/pages/Index.tsx)
- [src/lib/staticSearchEntries.ts](src/lib/staticSearchEntries.ts)

### Provided content to use
- No verified event schedule or archive was supplied in the image.

### Gemini notes
- Replace generic event titles and dates with real event records if they exist.
- Keep the gallery page usable even if the archive is still incomplete.

## Page 5: Downloads `/downloads`

### Current site content
- Download categories for general resources and reports.
- Secretary, treasurer, coordinator, and IT club reports.

### Hardcoded content sources
- [src/pages/Downloads.tsx](src/pages/Downloads.tsx)
- [src/lib/staticSearchEntries.ts](src/lib/staticSearchEntries.ts)

### Provided content to use
- No verified download list was supplied in the image.

### Gemini notes
- Keep placeholders for now, but mark missing documents clearly.
- If CAN Kavre has annual reports or constitutions, add them here later.

## Page 6: Press Releases `/press-releases`

### Current site content
- Press release title, subtitle, search box, categories, and sample release entries.

### Hardcoded content sources
- [src/pages/PressReleases.tsx](src/pages/PressReleases.tsx)
- [src/lib/translations.ts](src/lib/translations.ts)
- [src/lib/staticSearchEntries.ts](src/lib/staticSearchEntries.ts)

### Provided content to use
- No verified press release titles were supplied in the image.

### Gemini notes
- Keep the section structure but confirm every release before publishing it as official news.

## Page 7: Notice Board `/notice`

### Current site content
- Notice board page with important/general/urgent notices and sample announcements.

### Hardcoded content sources
- [src/pages/Notice.tsx](src/pages/Notice.tsx)
- [src/lib/translations.ts](src/lib/translations.ts)
- [src/lib/staticSearchEntries.ts](src/lib/staticSearchEntries.ts)

### Provided content to use
- No verified notice board items were supplied in the image.

### Gemini notes
- Treat any current notice content as a placeholder until CAN Kavre confirms the notices.

## Page 8: Membership `/membership`

### Current site content
- Membership portal heading and subtitle.
- Membership types with fees and benefits.
- Required document list and application instructions.

### Hardcoded content sources
- [src/pages/Membership.tsx](src/pages/Membership.tsx)
- [src/lib/translations.ts](src/lib/translations.ts)

### Current hardcoded membership copy
- Life Membership: NRS 6,000, one-time fee for permanent membership with full voting rights.
- Individual Membership: NRS 800 / year, annual renewable membership.
- Institutional Membership: NRS 5,000 / year for companies, institutions, and organizations.

### Provided content to use
- No verified membership fee table was supplied in the image.

### Gemini notes
- This page is heavily hardcoded and should be reviewed carefully with the leadership.
- Verify every fee, benefit, and required document before final publication.

## Page 9: Auth `/auth`

### Current site content
- Committee login and member account tabs.
- Login, registration, password reset, and verification flows.
- Committee-only access logic.

### Hardcoded content sources
- [src/pages/Auth.tsx](src/pages/Auth.tsx)
- [src/lib/translations.ts](src/lib/translations.ts)
- [src/lib/api.ts](src/lib/api.ts)

### Provided content to use
- No auth-flow content was supplied in the image.

### Gemini notes
- This page is functional and role-based, not public content.
- Keep it separate from the public website copy.

## Page 10: Admin `/admin` and `/admin/scan`

### Current site content
- Dashboard overview, content management, program management, and scanner tools.

### Hardcoded content sources
- [src/pages/Admin.tsx](src/pages/Admin.tsx)
- [src/pages/AdminScanner.tsx](src/pages/AdminScanner.tsx)
- [src/components/layout/Navbar.tsx](src/components/layout/Navbar.tsx)

### Provided content to use
- No admin dashboard copy was supplied in the image.

### Gemini notes
- Keep this out of the public content rewrite unless you are documenting administrative labels.

## Shared Footer and Contact Content

### Current site content
- Organization description in the footer.
- Address, phone numbers, emails, office hours, newsletter, and feedback form.

### Hardcoded content sources
- [src/components/layout/Footer.tsx](src/components/layout/Footer.tsx)

### Provided content to use
- Secretariat Office, Banepa-Godamchok, Kavrepalanchok, Nepal.
- 9841315182 / 9851237483.
- cankavre@gmail.com.
- info@cankavre.org.np (coming soon).
- support@cankavre.org.np (coming soon).
- Sunday - Friday, 10:00 AM - 5:00 PM.

## What Gemini should do next
1. Replace all generic or placeholder text with the provided CAN Kavre content where available.
2. Keep unverified counts, committee names, program lists, and event archives clearly marked as needing confirmation.
3. Preserve the existing bilingual structure, but do not treat AI-generated Nepali text as final unless it has been reviewed.
4. If a page has no provided content yet, leave it structurally intact and mark it as pending.