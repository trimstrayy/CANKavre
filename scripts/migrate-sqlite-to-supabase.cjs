require('dotenv').config({ path: '.env.local' });

const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const sqlitePath = path.join(__dirname, '..', 'server', 'data.sqlite3');
const sqliteDb = new sqlite3.Database(sqlitePath);

function readAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    sqliteDb.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
}

async function upsertChunked(table, rows, onConflict = 'id') {
  if (!rows.length) {
    console.log(`[${table}] no rows to migrate`);
    return;
  }

  const chunkSize = 200;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await supabase
      .from(table)
      .upsert(chunk, { onConflict });

    if (error) {
      throw new Error(`[${table}] ${error.message}`);
    }
  }

  console.log(`[${table}] migrated ${rows.length} rows`);
}

async function migrateCommitteeMembers() {
  const rows = await readAll('SELECT * FROM committee_members');
  const mapped = rows.map((r) => ({
    id: r.id,
    name: r.name,
    name_ne: r.nameNe || r.name,
    position: r.position || 'Member',
    position_ne: r.positionNe || 'सदस्य',
    contact: r.contact || null,
    photo_url: r.photo || null,
    sort_order: Number.isFinite(r.sortOrder) ? r.sortOrder : 0,
    is_active: true,
  }));
  await upsertChunked('committee_members', mapped);
}

async function migrateNotices() {
  const rows = await readAll('SELECT * FROM notices');
  const mapped = rows.map((r) => ({
    id: r.id,
    title: r.title,
    title_ne: r.titleNe || r.title,
    content: r.content || null,
    content_ne: r.contentNe || r.content || null,
    date: r.date || null,
    priority: r.priority || 'medium',
    type: r.type || 'info',
    is_published: true,
  }));
  await upsertChunked('notices', mapped);
}

async function migrateEvents() {
  const rows = await readAll('SELECT * FROM events');
  const mapped = rows.map((r) => ({
    id: r.id,
    title: r.title,
    title_ne: r.titleNe || r.title,
    date: r.date || null,
    time: r.time || null,
    location: r.location || null,
    location_ne: r.locationNe || r.location || null,
    description: r.description || null,
    description_ne: r.descriptionNe || r.description || null,
    attendees: Number.isFinite(r.attendees) ? r.attendees : 0,
    status: r.status || 'upcoming',
    image_url: r.image || null,
    is_published: true,
    organizer: 'CAN Federation Kavre',
    organizer_ne: 'क्यान महासंघ काभ्रे',
  }));
  await upsertChunked('events', mapped);
}

async function migratePressReleases() {
  const rows = await readAll('SELECT * FROM press_releases');
  const mapped = rows.map((r) => ({
    id: r.id,
    title: r.title,
    title_ne: r.titleNe || r.title,
    excerpt: r.excerpt || null,
    excerpt_ne: r.excerptNe || r.excerpt || null,
    date: r.date || null,
    link: r.link || null,
    is_published: true,
  }));
  await upsertChunked('press_releases', mapped);
}

async function migrateProgramsToUpcoming() {
  const rows = await readAll('SELECT * FROM programs');
  const mapped = rows.map((r) => ({
    id: r.id,
    title: r.title,
    title_ne: r.titleNe || r.title,
    description: r.description || null,
    description_ne: r.descriptionNe || r.description || null,
    deadline: r.deadline || null,
    category: r.category || 'general',
    is_registration_open: true,
    is_active: true,
  }));
  await upsertChunked('upcoming_programs', mapped);
}

(async () => {
  try {
    console.log('Starting SQLite -> Supabase migration...');
    await migrateCommitteeMembers();
    await migrateNotices();
    await migrateEvents();
    await migratePressReleases();
    await migrateProgramsToUpcoming();
    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error.message || error);
    console.error('If this is an RLS permission error, use a Service Role key for migration.');
    process.exitCode = 1;
  } finally {
    sqliteDb.close();
  }
})();
