# Voting System Backend (Node.js + Express + MySQL)

A RESTful API built with Node.js, Express, and MySQL for managing restaurant voting, meals, and users.

> **Voting system for deciding where to have lunch.**
> Only one vote per day per person. User chooses restaurant based upon today's dish.

## Technology Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **Authentication:** Session-based with cookies
- **Password Hashing:** bcryptjs

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create MySQL Database
Run the initialization script to create the database and tables:
```bash
mysql -u root -p < db/init.sql
```

If you have a password for MySQL, use:
```bash
mysql -u root -pYOUR_PASSWORD < db/init.sql
```

### 3. Configure Environment Variables
Edit the `.env` file and set your database credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=voting_system
DB_PORT=3306
PORT=5000
SESSION_SECRET=your_secret_key_change_this_in_production
```

### 4. Start the Server
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user

### Votes
- `GET /api/votes/results` - Get today's voting results
- `GET /api/votes/voted-today` - Check if user voted today
- `GET /api/votes/history` - Get user's vote history
- `POST /api/votes/vote` - Submit a vote

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `POST /api/restaurants` - Create restaurant (admin only)
- `PUT /api/restaurants/:id` - Update restaurant (admin only)
- `DELETE /api/restaurants/:id` - Delete restaurant (admin only)

### Meals
- `GET /api/meals` - Get meals for today or specific date
- `POST /api/meals` - Create meal (admin only)
- `PUT /api/meals/:id` - Update meal (admin only)
- `DELETE /api/meals/:id` - Delete meal (admin only)

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)

## Database Schema

### Users
- Stores user information with email/password authentication
- Linked to roles (ROLE_ADMIN, ROLE_USER)
- Timestamps for registration and updates

### Restaurants
- List of available restaurants for voting
- Multiple restaurants for daily voting

### Meals
- Daily meals with pricing and descriptions
- Associated with specific restaurants
- Date-based queries for today's offerings

### Votes
- One vote per user per day
- Unique constraint on user_id + vote_date
- Tracks voting history

### Roles
- ROLE_ADMIN - Full access
- ROLE_USER - Regular user access

## Features
✅ Session-based authentication with cookies
✅ User registration and login with password hashing
✅ Vote management (one vote per user per day)
✅ Restaurant and meal management (admin only)
✅ Vote results tracking with aggregation
✅ User history tracking
✅ MySQL database with proper relationships and constraints
✅ CORS enabled for frontend communication
