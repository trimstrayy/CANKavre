-- ============================================================
-- CAN Kavre — Complete Initial Migration
-- Database: Supabase (PostgreSQL)
-- Date: 2026-02-23
-- Tables: 30 (profiles + 29 application tables)
-- ============================================================

-- ============================================================
-- 0. SHARED UTILITY FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Generate registration codes with prefix
CREATE OR REPLACE FUNCTION generate_registration_code(prefix TEXT)
RETURNS TEXT AS $$
DECLARE
    rand5 TEXT;
    rand4 TEXT;
BEGIN
    rand5 := LPAD(FLOOR(RANDOM() * 99999)::TEXT, 5, '0');
    rand4 := UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 4));
    RETURN prefix || '-' || EXTRACT(YEAR FROM NOW())::TEXT || '-' || rand5 || '-' || rand4;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- 1. PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE profiles (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name       TEXT NOT NULL,
    full_name_ne    TEXT,
    email           TEXT UNIQUE NOT NULL,
    phone           TEXT,
    avatar_url      TEXT,
    role            TEXT NOT NULL DEFAULT 'member'
                    CHECK (role IN ('committee', 'subcommittee', 'member')),
    bio             TEXT,
    bio_ne          TEXT,
    organization    TEXT,
    is_active       BOOLEAN DEFAULT TRUE,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'member')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_all"
    ON profiles FOR SELECT USING (true);

CREATE POLICY "profiles_update_own"
    ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_update_committee"
    ON profiles FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );

CREATE POLICY "profiles_delete_committee"
    ON profiles FOR DELETE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );


-- ============================================================
-- 2. PAST COMMITTEES (must come before committee_members FK)
-- ============================================================
CREATE TABLE past_committees (
    id          SERIAL PRIMARY KEY,
    period      TEXT NOT NULL,
    period_ne   TEXT NOT NULL,
    category    TEXT,
    start_year  INT,
    end_year    INT,
    sort_order  INT DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE past_committees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "past_committees_select_all"
    ON past_committees FOR SELECT USING (true);

CREATE POLICY "past_committees_manage_committee"
    ON past_committees FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );


-- ============================================================
-- 3. COMMITTEE MEMBERS
-- ============================================================
CREATE TABLE committee_members (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    name_ne     TEXT NOT NULL,
    position    TEXT NOT NULL,
    position_ne TEXT NOT NULL,
    contact     TEXT,
    photo_url   TEXT,
    user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
    term_id     INT REFERENCES past_committees(id) ON DELETE SET NULL,
    sort_order  INT DEFAULT 0,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE committee_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "committee_members_select_all"
    ON committee_members FOR SELECT USING (true);

CREATE POLICY "committee_members_manage_committee"
    ON committee_members FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );


-- ============================================================
-- 4. SUBCOMMITTEES
-- ============================================================
CREATE TABLE subcommittees (
    id            SERIAL PRIMARY KEY,
    name          TEXT NOT NULL,
    name_ne       TEXT NOT NULL,
    focus         TEXT,
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

CREATE POLICY "subcommittees_select_all"
    ON subcommittees FOR SELECT USING (true);

CREATE POLICY "subcommittees_manage_committee"
    ON subcommittees FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );


-- ============================================================
-- 5. SUBCOMMITTEE MEMBERS (junction)
-- ============================================================
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

CREATE POLICY "subcommittee_members_select_all"
    ON subcommittee_members FOR SELECT USING (true);

CREATE POLICY "subcommittee_members_manage_committee"
    ON subcommittee_members FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );

-- Auto-sync member_count
CREATE OR REPLACE FUNCTION sync_subcommittee_member_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE subcommittees SET member_count = (
        SELECT COUNT(*) FROM subcommittee_members
        WHERE subcommittee_id = COALESCE(NEW.subcommittee_id, OLD.subcommittee_id)
        AND is_active = TRUE
    ) WHERE id = COALESCE(NEW.subcommittee_id, OLD.subcommittee_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_subcommittee_count
    AFTER INSERT OR UPDATE OR DELETE ON subcommittee_members
    FOR EACH ROW EXECUTE FUNCTION sync_subcommittee_member_count();


-- ============================================================
-- 6. IT CLUBS
-- ============================================================
CREATE TABLE it_clubs (
    id            SERIAL PRIMARY KEY,
    name          TEXT NOT NULL,
    name_ne       TEXT NOT NULL,
    students      INT DEFAULT 0,
    established   INT,
    location      TEXT,
    location_ne   TEXT,
    school_name   TEXT,
    school_name_ne TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    logo_url      TEXT,
    is_active     BOOLEAN DEFAULT TRUE,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER it_clubs_updated_at
    BEFORE UPDATE ON it_clubs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE it_clubs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "it_clubs_select_all"
    ON it_clubs FOR SELECT USING (true);

CREATE POLICY "it_clubs_manage_committee"
    ON it_clubs FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );


-- ============================================================
-- 7. MEMBERSHIP TYPES
-- ============================================================
CREATE TABLE membership_types (
    id              SERIAL PRIMARY KEY,
    type            TEXT NOT NULL,
    type_ne         TEXT NOT NULL,
    fee             TEXT NOT NULL,
    fee_ne          TEXT NOT NULL,
    fee_amount      NUMERIC(10,2),
    is_recurring    BOOLEAN DEFAULT FALSE,
    renewal_period  TEXT DEFAULT 'yearly',
    description     TEXT,
    description_ne  TEXT,
    benefits        JSONB DEFAULT '[]'::JSONB,
    benefits_ne     JSONB DEFAULT '[]'::JSONB,
    icon            TEXT,
    color           TEXT DEFAULT 'primary',
    sort_order      INT DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE membership_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "membership_types_select_all"
    ON membership_types FOR SELECT USING (true);

CREATE POLICY "membership_types_manage_committee"
    ON membership_types FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );


-- ============================================================
-- 8. MEMBERSHIP APPLICATIONS
-- ============================================================
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
    organization        TEXT,
    citizenship_doc_url TEXT,
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
    expires_at          DATE,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER membership_apps_updated_at
    BEFORE UPDATE ON membership_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "membership_apps_select_own_or_committee"
    ON membership_applications FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );

CREATE POLICY "membership_apps_insert_auth"
    ON membership_applications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "membership_apps_update_committee"
    ON membership_applications FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );


-- ============================================================
-- 9. CATEGORIES
-- ============================================================
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

CREATE POLICY "categories_select_all"
    ON categories FOR SELECT USING (true);

CREATE POLICY "categories_manage_committee"
    ON categories FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );


-- ============================================================
-- 10. NOTICES
-- ============================================================
CREATE TABLE notices (
    id           SERIAL PRIMARY KEY,
    title        TEXT NOT NULL,
    title_ne     TEXT NOT NULL,
    content      TEXT,
    content_ne   TEXT,
    date         DATE DEFAULT CURRENT_DATE,
    expiry_date  DATE,
    priority     TEXT DEFAULT 'medium'
                 CHECK (priority IN ('high', 'medium', 'low')),
    type         TEXT DEFAULT 'info'
                 CHECK (type IN ('announcement', 'deadline', 'info', 'urgent')),
    attachment_url TEXT,
    author_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
    is_pinned    BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    view_count   INT DEFAULT 0,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER notices_updated_at
    BEFORE UPDATE ON notices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notices_select_published_or_committee"
    ON notices FOR SELECT USING (
        is_published = true OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );

CREATE POLICY "notices_manage_committee_or_sub"
    ON notices FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('committee', 'subcommittee'))
    );


-- ============================================================
-- 11. EVENTS
-- ============================================================
CREATE TABLE events (
    id                      SERIAL PRIMARY KEY,
    title                   TEXT NOT NULL,
    title_ne                TEXT NOT NULL,
    slug                    TEXT UNIQUE,
    date                    DATE,
    time                    TEXT,
    end_date                DATE,
    end_time                TEXT,
    location                TEXT,
    location_ne             TEXT,
    venue_address           TEXT,
    venue_map_url           TEXT,
    description             TEXT,
    description_ne          TEXT,
    full_content            TEXT,
    full_content_ne         TEXT,
    max_attendees           INT,
    attendees               INT DEFAULT 0,
    registered_count        INT DEFAULT 0,
    status                  TEXT DEFAULT 'upcoming'
                            CHECK (status IN ('draft', 'upcoming', 'ongoing', 'completed', 'cancelled')),
    image_url               TEXT,
    is_registration_open    BOOLEAN DEFAULT TRUE,
    registration_deadline   DATE,
    registration_fee        NUMERIC(10,2) DEFAULT 0,
    registration_fee_ne     TEXT,
    contact_email           TEXT,
    contact_phone           TEXT,
    category_id             INT REFERENCES categories(id) ON DELETE SET NULL,
    organizer               TEXT DEFAULT 'CAN Federation Kavre',
    organizer_ne            TEXT DEFAULT 'क्यान महासंघ काभ्रे',
    author_id               UUID REFERENCES profiles(id) ON DELETE SET NULL,
    is_featured             BOOLEAN DEFAULT FALSE,
    is_published            BOOLEAN DEFAULT TRUE,
    view_count              INT DEFAULT 0,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-generate slug
CREATE OR REPLACE FUNCTION generate_event_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := LOWER(REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
        NEW.slug := TRIM(BOTH '-' FROM NEW.slug);
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

CREATE POLICY "events_select_published_or_committee"
    ON events FOR SELECT USING (
        is_published = true OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );

CREATE POLICY "events_manage_committee_or_sub"
    ON events FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('committee', 'subcommittee'))
    );


-- ============================================================
-- 12. EVENT REGISTRATIONS (QR Attendance System)
-- ============================================================
CREATE TABLE event_registrations (
    id                  SERIAL PRIMARY KEY,
    event_id            INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id             UUID REFERENCES profiles(id) ON DELETE SET NULL,
    full_name           TEXT NOT NULL,
    full_name_ne        TEXT,
    email               TEXT NOT NULL,
    phone               TEXT,
    organization        TEXT,
    designation         TEXT,
    registration_code   TEXT UNIQUE NOT NULL,
    qr_code_url         TEXT,
    qr_data             TEXT,
    is_attended         BOOLEAN DEFAULT FALSE,
    checked_in_at       TIMESTAMPTZ,
    checked_in_by       UUID REFERENCES profiles(id),
    check_in_method     TEXT DEFAULT 'qr'
                        CHECK (check_in_method IN ('qr', 'manual', 'import')),
    status              TEXT DEFAULT 'registered'
                        CHECK (status IN ('registered', 'confirmed', 'attended', 'cancelled', 'no-show')),
    payment_status      TEXT DEFAULT 'not-required'
                        CHECK (payment_status IN ('not-required', 'pending', 'paid', 'refunded')),
    payment_amount      NUMERIC(10,2),
    payment_receipt_url TEXT,
    registration_source TEXT DEFAULT 'web'
                        CHECK (registration_source IN ('web', 'admin', 'import', 'walk-in')),
    notes               TEXT,
    feedback_rating     INT CHECK (feedback_rating IS NULL OR (feedback_rating BETWEEN 1 AND 5)),
    feedback_comment    TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, email)
);

CREATE TRIGGER event_reg_updated_at
    BEFORE UPDATE ON event_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Indexes for fast lookups
CREATE INDEX idx_event_reg_code ON event_registrations(registration_code);
CREATE INDEX idx_event_reg_event ON event_registrations(event_id);
CREATE INDEX idx_event_reg_attended ON event_registrations(event_id, is_attended);
CREATE INDEX idx_event_reg_email ON event_registrations(email);
CREATE INDEX idx_event_reg_status ON event_registrations(event_id, status);

-- Auto-update counts on events table
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
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_event_counts_trigger
    AFTER INSERT OR UPDATE OR DELETE ON event_registrations
    FOR EACH ROW EXECUTE FUNCTION sync_event_counts();

-- RLS
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "event_reg_insert_anyone"
    ON event_registrations FOR INSERT WITH CHECK (true);

CREATE POLICY "event_reg_select_own_or_committee"
    ON event_registrations FOR SELECT USING (
        user_id = auth.uid() OR
        email = (SELECT email FROM profiles WHERE id = auth.uid()) OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );

CREATE POLICY "event_reg_update_committee"
    ON event_registrations FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );

CREATE POLICY "event_reg_cancel_own"
    ON event_registrations FOR UPDATE USING (
        user_id = auth.uid()
    ) WITH CHECK (
        status = 'cancelled'
    );


-- ============================================================
-- 13. GALLERY IMAGES
-- ============================================================
CREATE TABLE gallery_images (
    id          SERIAL PRIMARY KEY,
    src         TEXT NOT NULL,
    thumbnail   TEXT,
    title       TEXT,
    title_ne    TEXT,
    caption     TEXT,
    caption_ne  TEXT,
    event_id    INT REFERENCES events(id) ON DELETE SET NULL,
    album       TEXT,
    width       INT,
    height      INT,
    file_size   TEXT,
    sort_order  INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gallery_select_all"
    ON gallery_images FOR SELECT USING (true);

CREATE POLICY "gallery_manage_committee"
    ON gallery_images FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );


-- ============================================================
-- 14. PRESS RELEASES
-- ============================================================
CREATE TABLE press_releases (
    id           SERIAL PRIMARY KEY,
    title        TEXT NOT NULL,
    title_ne     TEXT NOT NULL,
    slug         TEXT UNIQUE,
    excerpt      TEXT,
    excerpt_ne   TEXT,
    body         TEXT,
    body_ne      TEXT,
    date         DATE DEFAULT CURRENT_DATE,
    category_id  INT REFERENCES categories(id) ON DELETE SET NULL,
    link         TEXT,
    image_url    TEXT,
    author_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
    author_name  TEXT,
    is_featured  BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    view_count   INT DEFAULT 0,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER press_releases_updated_at
    BEFORE UPDATE ON press_releases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE press_releases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "press_releases_select_published_or_committee"
    ON press_releases FOR SELECT USING (
        is_published = true OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );

CREATE POLICY "press_releases_manage_committee_or_sub"
    ON press_releases FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('committee', 'subcommittee'))
    );


-- ============================================================
-- 15. DOWNLOADS
-- ============================================================
CREATE TABLE downloads (
    id              SERIAL PRIMARY KEY,
    title           TEXT NOT NULL,
    title_ne        TEXT NOT NULL,
    description     TEXT,
    description_ne  TEXT,
    file_type       TEXT DEFAULT 'pdf'
                    CHECK (file_type IN ('pdf', 'image', 'document', 'spreadsheet', 'presentation', 'archive')),
    file_size       TEXT,
    file_size_bytes BIGINT,
    date            DATE,
    category_id     INT REFERENCES categories(id) ON DELETE SET NULL,
    download_url    TEXT NOT NULL,
    download_count  INT DEFAULT 0,
    version         TEXT,
    is_published    BOOLEAN DEFAULT TRUE,
    uploaded_by     UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "downloads_select_published"
    ON downloads FOR SELECT USING (is_published = true);

CREATE POLICY "downloads_manage_committee"
    ON downloads FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );


-- ============================================================
-- 16. REPORTS
-- ============================================================
CREATE TABLE reports (
    id           SERIAL PRIMARY KEY,
    title        TEXT NOT NULL,
    title_ne     TEXT NOT NULL,
    author       TEXT,
    author_ne    TEXT,
    date         DATE,
    fiscal_year  TEXT,
    report_type  TEXT NOT NULL
                 CHECK (report_type IN ('secretary', 'treasurer', 'coordinator', 'itclub', 'annual', 'audit')),
    file_type    TEXT DEFAULT 'pdf',
    file_size    TEXT,
    download_url TEXT NOT NULL,
    summary      TEXT,
    summary_ne   TEXT,
    download_count INT DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    uploaded_by  UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reports_select_published"
    ON reports FOR SELECT USING (is_published = true);

CREATE POLICY "reports_manage_committee"
    ON reports FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );


-- ============================================================
-- 17. PROGRAMS
-- ============================================================
CREATE TABLE programs (
    id              SERIAL PRIMARY KEY,
    title           TEXT NOT NULL,
    title_ne        TEXT NOT NULL,
    slug            TEXT UNIQUE,
    description     TEXT,
    description_ne  TEXT,
    full_content    TEXT,
    full_content_ne TEXT,
    icon            TEXT,
    color           TEXT DEFAULT 'primary',
    features        JSONB DEFAULT '[]'::JSONB,
    features_ne     JSONB DEFAULT '[]'::JSONB,
    image_url       TEXT,
    category        TEXT CHECK (category IS NULL OR category IN (
        'digital-literacy', 'it-club', 'agriculture', 'women-in-tech',
        'e-governance', 'health-ict', 'cybersecurity', 'general'
    )),
    target_audience    TEXT,
    target_audience_ne TEXT,
    impact_stats    JSONB,
    sort_order      INT DEFAULT 0,
    is_featured     BOOLEAN DEFAULT TRUE,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER programs_updated_at
    BEFORE UPDATE ON programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "programs_select_active"
    ON programs FOR SELECT USING (is_active = true);

CREATE POLICY "programs_manage_committee"
    ON programs FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );


-- ============================================================
-- 18. UPCOMING PROGRAMS
-- ============================================================
CREATE TABLE upcoming_programs (
    id                  SERIAL PRIMARY KEY,
    title               TEXT NOT NULL,
    title_ne            TEXT NOT NULL,
    date                TEXT,
    start_date          DATE,
    end_date            DATE,
    deadline            DATE,
    time                TEXT,
    location            TEXT,
    location_ne         TEXT,
    description         TEXT,
    description_ne      TEXT,
    spots               TEXT,
    spots_ne            TEXT,
    max_participants    INT,
    current_participants INT DEFAULT 0,
    register_link       TEXT,
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

CREATE TRIGGER upcoming_programs_updated_at
    BEFORE UPDATE ON upcoming_programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE upcoming_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "upcoming_programs_select_active"
    ON upcoming_programs FOR SELECT USING (is_active = true);

CREATE POLICY "upcoming_programs_manage_committee"
    ON upcoming_programs FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );


-- ============================================================
-- 19. PROGRAM REGISTRATIONS
-- ============================================================
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

CREATE TRIGGER program_reg_updated_at
    BEFORE UPDATE ON program_registrations
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
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_program_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON program_registrations
    FOR EACH ROW EXECUTE FUNCTION sync_program_participant_count();

ALTER TABLE program_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "program_reg_insert_anyone"
    ON program_registrations FOR INSERT WITH CHECK (true);

CREATE POLICY "program_reg_select_own_or_committee"
    ON program_registrations FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );

CREATE POLICY "program_reg_update_committee"
    ON program_registrations FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );


-- ============================================================
-- 20. HEADLINES
-- ============================================================
CREATE TABLE headlines (
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    title_ne    TEXT NOT NULL,
    date        DATE DEFAULT CURRENT_DATE,
    link        TEXT,
    sort_order  INT DEFAULT 0,
    is_active   BOOLEAN DEFAULT TRUE,
    expires_at  DATE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE headlines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "headlines_select_active"
    ON headlines FOR SELECT USING (
        is_active = true AND (expires_at IS NULL OR expires_at >= CURRENT_DATE)
    );

CREATE POLICY "headlines_manage_committee"
    ON headlines FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );


-- ============================================================
-- 21. HERO SLIDES
-- ============================================================
CREATE TABLE hero_slides (
    id            SERIAL PRIMARY KEY,
    image_url     TEXT NOT NULL,
    title         TEXT NOT NULL,
    title_ne      TEXT NOT NULL,
    subtitle      TEXT,
    subtitle_ne   TEXT,
    cta_text      TEXT,
    cta_text_ne   TEXT,
    link          TEXT,
    sort_order    INT DEFAULT 0,
    is_active     BOOLEAN DEFAULT TRUE,
    starts_at     DATE,
    ends_at       DATE,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hero_slides_select_active"
    ON hero_slides FOR SELECT USING (
        is_active = true AND
        (starts_at IS NULL OR starts_at <= CURRENT_DATE) AND
        (ends_at IS NULL OR ends_at >= CURRENT_DATE)
    );

CREATE POLICY "hero_slides_manage_committee"
    ON hero_slides FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );


-- ============================================================
-- 22. PENDING APPROVALS
-- ============================================================
CREATE TABLE pending_approvals (
    id            SERIAL PRIMARY KEY,
    title         TEXT NOT NULL,
    content_type  TEXT NOT NULL
                  CHECK (content_type IN ('event', 'notice', 'press_release', 'download', 'program', 'gallery')),
    content_body  JSONB NOT NULL,
    author_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reviewer_id   UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status        TEXT DEFAULT 'pending'
                  CHECK (status IN ('pending', 'approved', 'rejected', 'revision_requested')),
    remarks       TEXT,
    target_table  TEXT NOT NULL,
    target_id     INT,
    priority      TEXT DEFAULT 'normal'
                  CHECK (priority IN ('urgent', 'normal', 'low')),
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at   TIMESTAMPTZ
);

ALTER TABLE pending_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pending_approvals_select_author_or_committee"
    ON pending_approvals FOR SELECT USING (
        author_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );

CREATE POLICY "pending_approvals_insert_sub_or_committee"
    ON pending_approvals FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('committee', 'subcommittee'))
    );

CREATE POLICY "pending_approvals_update_committee"
    ON pending_approvals FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );


-- ============================================================
-- 23. FEEDBACK
-- ============================================================
CREATE TABLE feedback (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    phone       TEXT,
    subject     TEXT,
    message     TEXT NOT NULL,
    page_url    TEXT,
    is_read     BOOLEAN DEFAULT FALSE,
    is_starred  BOOLEAN DEFAULT FALSE,
    replied_at  TIMESTAMPTZ,
    replied_by  UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reply_text  TEXT,
    ip_address  INET,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "feedback_insert_anyone"
    ON feedback FOR INSERT WITH CHECK (true);

CREATE POLICY "feedback_select_committee"
    ON feedback FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );

CREATE POLICY "feedback_update_committee"
    ON feedback FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );


-- ============================================================
-- 24. NEWSLETTER SUBSCRIBERS
-- ============================================================
CREATE TABLE newsletter_subscribers (
    id              SERIAL PRIMARY KEY,
    email           TEXT UNIQUE NOT NULL,
    full_name       TEXT,
    is_active       BOOLEAN DEFAULT TRUE,
    source          TEXT DEFAULT 'footer',
    subscribed_at   TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    confirm_token   TEXT,
    is_confirmed    BOOLEAN DEFAULT FALSE
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "newsletter_insert_anyone"
    ON newsletter_subscribers FOR INSERT WITH CHECK (true);

CREATE POLICY "newsletter_select_committee"
    ON newsletter_subscribers FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );

CREATE POLICY "newsletter_update_anyone"
    ON newsletter_subscribers FOR UPDATE USING (true);


-- ============================================================
-- 25. SETTINGS
-- ============================================================
CREATE TABLE settings (
    key         TEXT PRIMARY KEY,
    value       TEXT,
    value_ne    TEXT,
    category    TEXT DEFAULT 'general',
    description TEXT,
    updated_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_by  UUID REFERENCES profiles(id) ON DELETE SET NULL
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_select_all"
    ON settings FOR SELECT USING (true);

CREATE POLICY "settings_manage_committee"
    ON settings FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );


-- ============================================================
-- 26. AUDIT LOG
-- ============================================================
CREATE TABLE audit_log (
    id          SERIAL PRIMARY KEY,
    user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
    user_email  TEXT,
    action      TEXT NOT NULL
                CHECK (action IN ('create', 'update', 'delete', 'check_in', 'approve', 'reject', 'login', 'logout', 'export')),
    table_name  TEXT NOT NULL,
    record_id   INT,
    old_data    JSONB,
    new_data    JSONB,
    description TEXT,
    ip_address  INET,
    user_agent  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_table ON audit_log(table_name);
CREATE INDEX idx_audit_action ON audit_log(action);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_log_select_committee"
    ON audit_log FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );

CREATE POLICY "audit_log_insert_anyone"
    ON audit_log FOR INSERT WITH CHECK (true);


-- ============================================================
-- 27. CONTACT MESSAGES
-- ============================================================
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

CREATE POLICY "contact_messages_insert_anyone"
    ON contact_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "contact_messages_select_committee"
    ON contact_messages FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );

CREATE POLICY "contact_messages_update_committee"
    ON contact_messages FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );


-- ============================================================
-- 28. TAGS
-- ============================================================
CREATE TABLE tags (
    id      SERIAL PRIMARY KEY,
    name    TEXT NOT NULL UNIQUE,
    name_ne TEXT,
    slug    TEXT UNIQUE
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tags_select_all"
    ON tags FOR SELECT USING (true);

CREATE POLICY "tags_manage_committee"
    ON tags FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );


-- ============================================================
-- 29. CONTENT TAGS (polymorphic junction)
-- ============================================================
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

CREATE POLICY "content_tags_select_all"
    ON content_tags FOR SELECT USING (true);

CREATE POLICY "content_tags_manage_committee"
    ON content_tags FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );


-- ============================================================
-- 30. PAGE VIEWS (analytics)
-- ============================================================
CREATE TABLE page_views (
    id          SERIAL PRIMARY KEY,
    page_path   TEXT NOT NULL,
    page_title  TEXT,
    referrer    TEXT,
    user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
    session_id  TEXT,
    device_type TEXT,
    browser     TEXT,
    country     TEXT,
    ip_address  INET,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_page_views_path ON page_views(page_path);
CREATE INDEX idx_page_views_date ON page_views(created_at);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "page_views_insert_anyone"
    ON page_views FOR INSERT WITH CHECK (true);

CREATE POLICY "page_views_select_committee"
    ON page_views FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'committee')
    );


-- ============================================================
-- DATABASE VIEWS
-- ============================================================

-- Current committee members (active, no past term)
CREATE OR REPLACE VIEW current_committee AS
SELECT * FROM committee_members
WHERE term_id IS NULL AND is_active = TRUE
ORDER BY sort_order;

-- Active headlines (not expired)
CREATE OR REPLACE VIEW active_headlines AS
SELECT * FROM headlines
WHERE is_active = TRUE AND (expires_at IS NULL OR expires_at >= CURRENT_DATE)
ORDER BY sort_order;

-- Upcoming events
CREATE OR REPLACE VIEW upcoming_events AS
SELECT * FROM events
WHERE status = 'upcoming' AND is_published = TRUE
ORDER BY date ASC;

-- Event attendance summary
CREATE OR REPLACE VIEW event_attendance_summary AS
SELECT
    e.id AS event_id,
    e.title,
    e.title_ne,
    e.date,
    e.max_attendees,
    COUNT(er.id) FILTER (WHERE er.status != 'cancelled') AS total_registered,
    COUNT(er.id) FILTER (WHERE er.is_attended = TRUE) AS total_attended,
    COUNT(er.id) FILTER (WHERE er.is_attended = FALSE AND er.status != 'cancelled') AS total_no_show,
    CASE
        WHEN COUNT(er.id) FILTER (WHERE er.status != 'cancelled') > 0 THEN
            ROUND(
                COUNT(er.id) FILTER (WHERE er.is_attended = TRUE)::NUMERIC /
                COUNT(er.id) FILTER (WHERE er.status != 'cancelled') * 100, 1
            )
        ELSE 0
    END AS attendance_rate
FROM events e
LEFT JOIN event_registrations er ON er.event_id = e.id
GROUP BY e.id, e.title, e.title_ne, e.date, e.max_attendees;

-- Admin dashboard stats
CREATE OR REPLACE VIEW admin_dashboard_stats AS
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


-- ============================================================
-- STORAGE BUCKETS
-- Note: Run these via Supabase Dashboard > Storage or via API.
-- They cannot be created via SQL directly.
-- Included here as reference.
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES
--     ('avatars', 'avatars', true),
--     ('committee-photos', 'committee-photos', true),
--     ('event-images', 'event-images', true),
--     ('gallery', 'gallery', true),
--     ('downloads', 'downloads', true),
--     ('reports', 'reports', true),
--     ('hero-slides', 'hero-slides', true),
--     ('qr-codes', 'qr-codes', false),
--     ('membership-docs', 'membership-docs', false);
