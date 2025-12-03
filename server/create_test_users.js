const BASE = 'http://localhost:4000';

const users = [
  { fullName: 'Member User', email: 'member@cankavre.org', password: 'Password123!', role: 'member' },
  { fullName: 'Subcommittee User', email: 'subcommittee@cankavre.org', password: 'Password123!', role: 'subcommittee' },
  { fullName: 'Committee User', email: 'committee@cankavre.org', password: 'Password123!', role: 'committee' }
];

async function post(path, body) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

(async () => {
  for (const u of users) {
    const r = await post('/api/register', u);
    if (r.ok) {
      console.log(`Created ${u.email}: token=${r.data.token}`);
      continue;
    }
    console.log(`Register failed for ${u.email} (${r.status}): ${JSON.stringify(r.data)}`);
    // try login
    const l = await post('/api/login', { email: u.email, password: u.password });
    if (l.ok) {
      console.log(`Logged in ${u.email}: token=${l.data.token}`);
    } else {
      console.log(`Login failed for ${u.email} (${l.status}): ${JSON.stringify(l.data)}`);
    }
  }
})();
