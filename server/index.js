const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');
const { authMiddleware, requireRole, SECRET } = require('./auth');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Register
app.post('/api/register', async (req, res) => {
  const { fullName, email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const hashed = await bcrypt.hash(password, 10);
  const stmt = db.prepare('INSERT INTO users (fullName, email, password, role) VALUES (?, ?, ?, ?)');
  stmt.run(fullName || null, email, hashed, role || 'member', function (err) {
    if (err) {
      if (err.message && err.message.includes('UNIQUE')) return res.status(409).json({ error: 'Email already registered' });
      console.error(err);
      return res.status(500).json({ error: 'DB error' });
    }
    const user = { id: this.lastID, fullName, email, role: role || 'member' };
    const token = jwt.sign(user, SECRET, { expiresIn: '7d' });
    res.json({ user, token });
  });
  stmt.finalize && stmt.finalize();
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!row) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, row.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const user = { id: row.id, fullName: row.fullName, email: row.email, role: row.role };
    const token = jwt.sign(user, SECRET, { expiresIn: '7d' });
    res.json({ user, token });
  });
});

// Me
app.get('/api/users/me', authMiddleware, (req, res) => {
  const id = req.user.id;
  db.get('SELECT id, fullName, email, role, createdAt FROM users WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!row) return res.status(404).json({ error: 'User not found' });
    res.json({ user: row });
  });
});

// List users (committee only)
app.get('/api/users', authMiddleware, requireRole('committee'), (req, res) => {
  db.all('SELECT id, fullName, email, role, createdAt FROM users ORDER BY createdAt DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ users: rows });
  });
});

// ────────────────────────────────────────────────────────────────
// Programs CRUD
// ────────────────────────────────────────────────────────────────

// GET /api/programs — public, list all programs
app.get('/api/programs', (req, res) => {
  db.all(
    'SELECT * FROM programs ORDER BY deadline ASC, createdAt DESC',
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json({ programs: rows || [] });
    }
  );
});

// GET /api/programs/:id — public, single program
app.get('/api/programs/:id', (req, res) => {
  db.get('SELECT * FROM programs WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!row) return res.status(404).json({ error: 'Program not found' });
    res.json({ program: row });
  });
});

// POST /api/programs — committee only, create program
app.post('/api/programs', authMiddleware, requireRole('committee'), (req, res) => {
  const { title, titleNe, description, descriptionNe, deadline, category } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const stmt = db.prepare(
    `INSERT INTO programs (title, titleNe, description, descriptionNe, deadline, category)
     VALUES (?, ?, ?, ?, ?, ?)`
  );
  stmt.run(
    title,
    titleNe || '',
    description || '',
    descriptionNe || '',
    deadline || null,
    category || 'general',
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'DB error' });
      }
      const id = this.lastID;
      db.get('SELECT * FROM programs WHERE id = ?', [id], (err2, row) => {
        if (err2) return res.status(500).json({ error: 'DB error' });
        res.status(201).json({ program: row });
      });
    }
  );
  stmt.finalize && stmt.finalize();
});

// PUT /api/programs/:id — committee only, update program
app.put('/api/programs/:id', authMiddleware, requireRole('committee'), (req, res) => {
  const id = req.params.id;
  const fields = ['title', 'titleNe', 'description', 'descriptionNe', 'deadline', 'category'];
  const updates = [];
  const values = [];

  for (const f of fields) {
    if (req.body[f] !== undefined) {
      updates.push(`${f} = ?`);
      values.push(req.body[f]);
    }
  }

  if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });

  updates.push('updatedAt = CURRENT_TIMESTAMP');
  values.push(id);

  db.run(
    `UPDATE programs SET ${updates.join(', ')} WHERE id = ?`,
    values,
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'DB error' });
      }
      if (this.changes === 0) return res.status(404).json({ error: 'Program not found' });
      db.get('SELECT * FROM programs WHERE id = ?', [id], (err2, row) => {
        if (err2) return res.status(500).json({ error: 'DB error' });
        res.json({ program: row });
      });
    }
  );
});

// DELETE /api/programs/:id — committee only
app.delete('/api/programs/:id', authMiddleware, requireRole('committee'), (req, res) => {
  db.run('DELETE FROM programs WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Program not found' });
    res.json({ success: true });
  });
});

// ────────────────────────────────────────────────────────────────
// Generic CRUD helper
// ────────────────────────────────────────────────────────────────
function crudRoutes(table, writableFields) {
  // GET all
  app.get(`/api/${table}`, (req, res) => {
    db.all(`SELECT * FROM ${table} ORDER BY id DESC`, [], (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json({ [table]: rows || [] });
    });
  });

  // GET one
  app.get(`/api/${table}/:id`, (req, res) => {
    db.get(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id], (err, row) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      if (!row) return res.status(404).json({ error: 'Not found' });
      res.json({ item: row });
    });
  });

  // POST create (committee only)
  app.post(`/api/${table}`, authMiddleware, requireRole('committee'), (req, res) => {
    const cols = [];
    const vals = [];
    const placeholders = [];
    for (const f of writableFields) {
      if (req.body[f] !== undefined) {
        cols.push(f);
        vals.push(req.body[f]);
        placeholders.push('?');
      }
    }
    if (cols.length === 0) return res.status(400).json({ error: 'No fields provided' });
    const sql = `INSERT INTO ${table} (${cols.join(',')}) VALUES (${placeholders.join(',')})`;
    db.run(sql, vals, function (err) {
      if (err) { console.error(err); return res.status(500).json({ error: 'DB error' }); }
      db.get(`SELECT * FROM ${table} WHERE id = ?`, [this.lastID], (e2, row) => {
        if (e2) return res.status(500).json({ error: 'DB error' });
        res.status(201).json({ item: row });
      });
    });
  });

  // PUT update (committee only)
  app.put(`/api/${table}/:id`, authMiddleware, requireRole('committee'), (req, res) => {
    const updates = [];
    const vals = [];
    for (const f of writableFields) {
      if (req.body[f] !== undefined) {
        updates.push(`${f} = ?`);
        vals.push(req.body[f]);
      }
    }
    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
    vals.push(req.params.id);
    db.run(`UPDATE ${table} SET ${updates.join(', ')} WHERE id = ?`, vals, function (err) {
      if (err) { console.error(err); return res.status(500).json({ error: 'DB error' }); }
      if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
      db.get(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id], (e2, row) => {
        if (e2) return res.status(500).json({ error: 'DB error' });
        res.json({ item: row });
      });
    });
  });

  // DELETE (committee only)
  app.delete(`/api/${table}/:id`, authMiddleware, requireRole('committee'), (req, res) => {
    db.run(`DELETE FROM ${table} WHERE id = ?`, [req.params.id], function (err) {
      if (err) return res.status(500).json({ error: 'DB error' });
      if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
      res.json({ success: true });
    });
  });
}

// Register CRUD for each content type
crudRoutes('committee_members', ['name','nameNe','position','positionNe','contact','photo','sortOrder']);
crudRoutes('notices', ['title','titleNe','content','contentNe','date','priority','type']);
crudRoutes('events', ['title','titleNe','date','time','location','locationNe','description','descriptionNe','attendees','status','image']);
crudRoutes('press_releases', ['title','titleNe','excerpt','excerptNe','date','category','categoryNe','link']);

app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
});
