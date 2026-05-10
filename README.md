# Voting System

A full-stack voting app for restaurants and meals. Users can log in, view available meals, and cast a vote. Admins can manage restaurants, meals, and users through the dashboard.

## Tech Stack

- Backend: Node.js, Express, MySQL, express-session
- Frontend: React, Vite, React Router, Axios, Tailwind CSS

## Features

- Session-based authentication
- Vote submission and daily vote tracking
- Meal and restaurant management
- Admin dashboard for CRUD operations
- Responsive React frontend

## Project Structure

```text
voting-system/
├── backend/
└── frontend/
```

## Requirements

- Node.js 16+
- npm
- MySQL

## Setup

### 1. Backend

Create a `.env` file in `backend/` with your database settings:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=voting_system
DB_PORT=3306
SESSION_SECRET=your_secret
```

Install and run:

```bash
cd backend
npm install
npm run dev
```

The backend runs at `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

If needed, set `VITE_API_URL` in the frontend environment. By default, the app uses `http://localhost:5000/api`.

## API Base

Backend routes are available under `/api`:

- `/api/auth`
- `/api/votes`
- `/api/restaurants`
- `/api/meals`
- `/api/admin`

## Notes

- CORS is configured for local development with credentials enabled.
- Sessions are stored server-side using `express-session`.
- The frontend sends requests with `withCredentials: true`.

## Run Both

Open two terminals and run the backend and frontend commands above.
