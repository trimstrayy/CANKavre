const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data.sqlite3');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open database', err);
    process.exit(1);
  }
});

// Initialize tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS programs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      titleNe TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      descriptionNe TEXT NOT NULL DEFAULT '',
      deadline DATETIME,
      category TEXT NOT NULL DEFAULT 'general',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS committee_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      nameNe TEXT NOT NULL DEFAULT '',
      position TEXT NOT NULL DEFAULT 'Member',
      positionNe TEXT NOT NULL DEFAULT 'सदस्य',
      contact TEXT DEFAULT '',
      photo TEXT DEFAULT '',
      sortOrder INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS notices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      titleNe TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      contentNe TEXT NOT NULL DEFAULT '',
      date TEXT DEFAULT '',
      priority TEXT NOT NULL DEFAULT 'medium',
      type TEXT NOT NULL DEFAULT 'info',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      titleNe TEXT NOT NULL DEFAULT '',
      date TEXT DEFAULT '',
      time TEXT DEFAULT '',
      location TEXT DEFAULT '',
      locationNe TEXT DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      descriptionNe TEXT NOT NULL DEFAULT '',
      attendees INTEGER DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'upcoming',
      image TEXT DEFAULT '',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS press_releases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      titleNe TEXT NOT NULL DEFAULT '',
      excerpt TEXT NOT NULL DEFAULT '',
      excerptNe TEXT NOT NULL DEFAULT '',
      date TEXT DEFAULT '',
      category TEXT NOT NULL DEFAULT 'Events',
      categoryNe TEXT NOT NULL DEFAULT 'कार्यक्रमहरू',
      link TEXT DEFAULT '#',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
