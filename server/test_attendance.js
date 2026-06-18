const db = require('./db');
const crypto = require('crypto');

async function run() {
  db.serialize(() => {
    // Ensure there's at least one program
    db.get('SELECT id, title FROM programs LIMIT 1', [], (err, program) => {
      if (err) { console.error('DB error:', err); process.exit(1); }
      const ensureProgram = (cb) => cb(program);

      if (!program) {
        db.run("INSERT INTO programs (title) VALUES (?)", ['Test Program'], function (e) {
          if (e) { console.error('Failed to create program', e); process.exit(1); }
          db.get('SELECT id, title FROM programs WHERE id = ?', [this.lastID], (er, p) => {
            if (er) { console.error(er); process.exit(1); }
            ensureProgram(() => p);
          });
        });
      }

      ensureProgram((p) => {
        const programId = p ? p.id : (program && program.id);
        const registrationCode = `TEST-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

        // Insert registration
        db.run(
          'INSERT INTO program_registrations (programId, name, email, location, registrationCode) VALUES (?, ?, ?, ?, ?)',
          [programId, 'Automated Tester', 'tester+automated@example.com', 'Test Location', registrationCode],
          function (insErr) {
            if (insErr) { console.error('Failed to insert registration', insErr); process.exit(1); }
            console.log('Inserted registration with code:', registrationCode);

            // Read it back
            db.get('SELECT * FROM program_registrations WHERE registrationCode = ?', [registrationCode], (gErr, row) => {
              if (gErr) { console.error(gErr); process.exit(1); }
              console.log('Registration row:', row);

              // Simulate check-in (mark attended)
              const now = new Date().toISOString();
              db.run('UPDATE program_registrations SET isAttended = 1, attendedAt = ? WHERE registrationCode = ?', [now, registrationCode], function (uErr) {
                if (uErr) { console.error('Failed to update attendance', uErr); process.exit(1); }
                db.get('SELECT * FROM program_registrations WHERE registrationCode = ?', [registrationCode], (rErr, updated) => {
                  if (rErr) { console.error(rErr); process.exit(1); }
                  console.log('Updated registration (checked-in):', updated);

                  // Counts
                  db.get('SELECT COUNT(*) AS total, SUM(isAttended) AS attended FROM program_registrations WHERE programId = ?', [programId], (cErr, counts) => {
                    if (cErr) { console.error(cErr); process.exit(1); }
                    console.log('Counts for program:', counts);
                    process.exit(0);
                  });
                });
              });
            });
          }
        );
      });
    });
  });
}

run();
