# QuickPoll

## Project Overview

QuickPoll is a full-stack polling application for creating, sharing, and collecting anonymous votes. Creators can build polls (title, options, optional expiry), share a unique link, and manage results via a token-protected admin dashboard. Voters can cast anonymous votes without creating an account.

## Tech Stack

- Frontend: React (Vite), React Router, Axios, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB Atlas (via Mongoose)

## Features

- Create poll (title, 2–5 options, optional expiry)
- Shareable unique poll link
- Anonymous voting (no login required)
- Results with charts and percentages
- Admin dashboard with token access for creators
- Duplicate vote prevention (cookie/fingerprint based)
- Poll expiry and automatic closure
- Backend + frontend REST integration

## How to Run Locally

Prerequisites: Node.js (16+), npm, MongoDB Atlas account (connection string).

1. Install dependencies:

```bash
npm install --prefix backend
npm install --prefix frontend
```

2. Copy environment examples to real `.env` files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Start backend and frontend (separate terminals):

```bash
npm run dev --prefix backend
npm run dev --prefix frontend
```

4. Open the frontend (default Vite URL `http://localhost:5173`).

## Environment Variables (.env.example)

The project uses example env files located at `backend/.env.example` and `frontend/.env.example`.

Required variables (no hardcoded secrets in repository):

- `MONGODB_URI` — MongoDB Atlas connection string
- `CLIENT_URL` — Frontend URL used for CORS (e.g., http://localhost:5173)
- `VITE_API_URL` — Backend API base URL used by the frontend (e.g., http://localhost:5000)
- `PORT` — Backend server port (e.g., 5000)

Ensure you never commit real secret values to the repository. Use environment variables in CI/deploy.

## Known Issues / Notes

- Real-time WebSocket updates are not implemented; results refresh after votes are submitted.
- QR code generation is optional and not included by default.
- Duplicate prevention uses cookies/fingerprinting and is not a replacement for strict authentication.

If you need help running the app locally or preparing a production build, open an issue or request specific guidance.
