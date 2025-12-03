# CANKavre Local Auth Server

This is a minimal Express + SQLite server to support local registration, login and role-based verification (member / subcommittee / committee) for development and testing.

Quick start

1. Open a terminal and install dependencies:

```powershell
cd server
npm install
```

2. Start the server:

```powershell
npm start
```

3. Default server URL: `http://localhost:4000`

API endpoints

- `POST /api/register` { fullName, email, password, role } -> registers a user and returns `{ user, token }`.
- `POST /api/login` { email, password } -> returns `{ user, token }`.
- `GET /api/users/me` (Authorization: Bearer TOKEN) -> returns current user.
- `GET /api/users` (Authorization + committee role) -> list users.

Notes

- The server uses a local SQLite database at `server/data.sqlite3`.
- JWT secret: set `JWT_SECRET` env var in production. Default is `change_this_secret_for_dev` for development only.
- This server is intended for local development and testing only. For production use, secure config, HTTPS, proper session management, and production-ready DB are required.
