const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { SECRET } = require('./auth');
const jwt = require('jsonwebtoken');

const API = 'http://localhost:4000';

async function run() {
  try {
    // 1) get programs
    const pRes = await fetch(`${API}/api/programs`);
    const pJson = await pRes.json();
    const program = (pJson.programs && pJson.programs[0]);
    if (!program) return console.error('No program found to register against');
    console.log('Using program:', program.id, program.title);

    // 2) register attendee
    const regBody = { name: 'E2E Tester', email: `e2e+${Date.now()}@example.com`, programId: program.id };
    const regRes = await fetch(`${API}/api/programs/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(regBody) });
    const regJson = await regRes.json();
    if (!regJson || !regJson.registrationCode) return console.error('Registration failed', regJson);
    console.log('Registered code:', regJson.registrationCode);

    // 3) generate committee JWT
    const payload = { id: 9999, fullName: 'E2E Committee', email: 'e2e-committee@example.com', role: 'committee' };
    const token = jwt.sign(payload, SECRET, { expiresIn: '1h' });
    console.log('Generated committee JWT (first 32 chars):', token.slice(0,32) + '...');

    // 4) check-in using API
    const chkRes = await fetch(`${API}/api/programs/checkin`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ registrationCode: regJson.registrationCode }) });
    const chkJson = await chkRes.json();
    console.log('Check-in result:', chkJson);

    // 5) fetch registrations for program
    const listRes = await fetch(`${API}/api/programs/registrations/${program.id}`, { headers: { 'Authorization': 'Bearer ' + token } });
    const listJson = await listRes.json();
    console.log('Registrations count for program:', (listJson.registrations || []).length);
    const found = (listJson.registrations || []).find(r => r.registrationCode === regJson.registrationCode);
    console.log('Found registration after check-in:', found);

  } catch (err) {
    console.error('E2E error:', err);
    process.exit(1);
  }
}

run();
