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

app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
});
