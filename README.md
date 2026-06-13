# QuickPoll

QuickPoll is a production-ready polling platform built with React, Vite, Tailwind CSS, Express, Node.js, and MongoDB Atlas. It allows anyone with a public poll link to vote without logging in and provides a secure creator dashboard for poll management.

## Features

- Create polls with a question and 2 to 5 options
- Optional expiry date and automatic poll closure
- Shareable public poll links
- Vote without authentication
- Real-time results with vote counts and percentages
- Responsive bar chart results view
- Secure admin dashboard through private admin token
- Creator can manually close polls from the dashboard
- Cookie-based duplicate vote prevention

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Recharts
- Backend: Node.js, Express, MongoDB Atlas, Mongoose
- Deployment-ready: Vercel (frontend), Render (backend)

## Architecture

- `frontend/`: Vite-based React application
- `backend/`: Express REST API with Mongoose models
- `backend/config/`: Database connection configuration
- `backend/controllers/`: Request handling and response logic
- `backend/routes/`: API route definitions
- `backend/services/`: Business logic and data operations
- `backend/middleware/`: Validation, sanitization, and error handling
- `frontend/src/pages/`: App pages for polls, results, and admin dashboard
- `frontend/src/components/`: Reusable UI elements

## Database Design

### Poll Collection

- `_id`
- `title`
- `options[]` (array of objects with `id` and `label`)
- `expiresAt`
- `adminToken`
- `isClosed`
- `createdAt`
- `updatedAt`

### Vote Collection

- `_id`
- `pollId`
- `selectedOption`
- `voterFingerprint`
- `createdAt`

## API Documentation

### Create Poll

- `POST /api/polls`
- Body: `{ title, options, expiresAt? }`
- Returns: `pollId` and `adminToken`

### Get Poll Details

- `GET /api/polls/:pollId`
- Returns poll metadata for voting

### Submit Vote

- `POST /api/polls/:pollId/vote`
- Body: `{ selectedOption }`
- Uses cookie-based fingerprint to prevent duplicate votes

### Get Results

- `GET /api/polls/:pollId/results`
- Returns vote counts and percentages

### Creator Dashboard

- `GET /api/manage/:adminToken`
- Returns management view and result summary

### Close Poll

- `PATCH /api/manage/:adminToken/close`
- Closes the poll immediately

## Installation Steps

1. Clone the repository.
2. Create `.env` files from the examples in `backend/.env.example` and `frontend/.env.example`.
3. Install dependencies in both directories.

```bash
npm install --prefix backend
npm install --prefix frontend
```

## Environment Variables

### Backend (`backend/.env`)

- `PORT`: Server port (default `5000`)
- `MONGODB_URI`: MongoDB Atlas connection string
- `CLIENT_URL`: Frontend URL for CORS

### Frontend (`frontend/.env`)

- `VITE_API_URL`: Backend API URL

## Local Setup

1. Start the backend server:

```bash
npm run dev --prefix backend
```

2. Start the frontend development server:

```bash
npm run dev --prefix frontend
```

3. Open the frontend URL in your browser (typically `http://localhost:5173`).

## Deployment Instructions

### Frontend

- Deploy `frontend/` to Vercel.
- Set environment variable: `VITE_API_URL` to backend URL.

### Backend

- Deploy `backend/` to Render or any Node.js host.
- Set environment variables:
  - `PORT`
  - `MONGODB_URI`
  - `CLIENT_URL`

### Database

- Use MongoDB Atlas and configure `MONGODB_URI`.

## Future Improvements

- Add email notifications for poll creators
- Add poll analytics and trending polls
- Add poll impersonation protections beyond cookies
- Add optional candidate images for poll options
- Add internationalization support
