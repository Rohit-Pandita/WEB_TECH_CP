# Voting System - Restaurant Lunch Voting Application

A full-stack application for voting on restaurant choices for lunch. Built with **Spring Boot** backend and **React** frontend.

## Project Structure

```
voting-system/
├── backend/          # Spring Boot REST API
│   ├── pom.xml
│   └── src/
└── frontend/         # React + Vite application
    ├── package.json
    └── src/
```

## Features

### User Features
- **Login/Authentication** - Secure JWT-based authentication
- **Vote for Restaurants** - Vote for lunch venue from available restaurants
- **Today's Dishes** - View dishes offered by each restaurant
- **Vote Update** - Change vote until 11:00 AM
- **Vote History** - Track previous votes

### Admin Features
- **Restaurant Management** - Add, edit, delete restaurants
- **Dish Management** - Create daily dishes with pricing
- **Full CRUD Operations** - Manage all system data

## Technology Stack

### Backend
- Spring Boot 2.1.2
- Spring Security with JWT
- Spring Data JPA
- HSQL Database (in-memory)
- Maven

### Frontend
- React 18
- Vite (bundler)
- Tailwind CSS
- Axios (HTTP client)
- React Router v6

## Prerequisites

- Java 8+ (for backend)
- Node.js 16+ (for frontend)
- Maven (for backend builds)
- npm or yarn (for frontend dependency management)

## Installation & Setup

### 1. Backend Setup

```bash
cd backend

# Build with Maven
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on **http://localhost:8080**

**Default Users:**
- User: `user@example.com` / `password`
- Admin: `admin@example.com` / `admin`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on **http://localhost:3000**

## API Endpoints

### Authentication
- `POST /rest/auth/login` - Login and get JWT token
- `GET /rest/auth/validate` - Validate current token

### User Operations
- `GET /rest/restaurants/dishes` - Get all restaurants with today's dishes
- `GET /rest/restaurants/searchByTitle?title=X` - Search restaurants
- `POST /rest/vote/{restaurantId}` - Vote for a restaurant
- `GET /rest/vote?date=YYYY-MM-DD` - Get user's vote for specific date
- `GET /rest/vote/history` - Get vote history with optional date range

### Admin Operations
- `GET /rest/admin/restaurants` - Get all restaurants
- `POST /rest/admin/restaurants` - Create restaurant
- `PUT /rest/admin/restaurants/{id}` - Update restaurant
- `DELETE /rest/admin/restaurants/{id}` - Delete restaurant
- `GET /rest/admin/dishes` - Get all dishes
- `POST /rest/admin/dishes` - Create dish
- `PUT /rest/admin/dishes/{id}` - Update dish
- `DELETE /rest/admin/dishes/{id}` - Delete dish

## Voting Rules

- **One vote per day** per user
- **Change vote until 11:00 AM** - Users can update their vote before 11 AM
- **After 11:00 AM** - Vote is locked for the day

## Running Both Servers

### Option 1: Run in Separate Terminals

**Terminal 1 - Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 2: Build for Production

**Backend:**
```bash
cd backend
mvn clean package
java -jar target/rs-0.0.1-SNAPSHOT.jar
```

**Frontend:**
```bash
cd frontend
npm run build
# Serve the dist folder or deploy to static hosting
```

## Development Notes

### JWT Token
- Stored in `localStorage` on the client
- Sent via `Authorization: Bearer <token>` header
- Expires after 24 hours (configurable in `application.properties`)

### CORS Configuration
- Allowed origins: `http://localhost:3000`, `http://localhost:8080`
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Update in [backend/src/main/java/top/graduation/rs/config/WebSecurityConfig.java](backend/src/main/java/top/graduation/rs/config/WebSecurityConfig.java)

### Database
- HSQL in-memory database (resets on restart)
- InitSQL scripts in `backend/src/main/resources/db/`
- Default users created on startup

## File Structure

### Backend Key Files
```
backend/src/main/java/top/graduation/rs/
├── config/
│   └── WebSecurityConfig.java      # Security & CORS config
├── model/
│   ├── User.java
│   ├── Restaurant.java
│   ├── Dish.java
│   └── Vote.java
├── security/
│   └── JwtAuthenticationFilter.java # JWT validation filter
├── service/
│   ├── UserServiceSecurity.java
│   ├── RestaurantService.java
│   ├── DishService.java
│   └── VoteService.java
├── to/
│   ├── LoginRequest.java
│   └── LoginResponse.java
├── util/
│   └── JwtTokenProvider.java       # JWT token generation
└── web/
    ├── AuthController.java          # Login endpoint
    ├── user/
    │   ├── RootController.java      # Restaurant viewing
    │   └── VoteController.java      # Voting operations
    └── admin/
        ├── RestaurantAdminController.java
        └── DishAdminController.java
```

### Frontend Key Files
```
frontend/src/
├── pages/
│   ├── Login.jsx                   # Login page
│   ├── UserDashboard.jsx           # Voting page
│   ├── AdminDashboard.jsx          # Admin page
│   └── NotFound.jsx
├── components/
│   ├── Navbar.jsx
│   ├── RestaurantManager.jsx       # Restaurant CRUD
│   └── DishManager.jsx             # Dish CRUD
├── services/
│   └── api.js                      # API service with Axios
├── App.jsx                         # Main app with routing
├── main.jsx                        # Entry point
└── index.css                       # Tailwind styles
```

## Troubleshooting

### Backend won't start
- Ensure Java 8+ is installed: `java -version`
- Check Maven: `mvn -version`
- Clear Maven cache: `mvn clean`

### Frontend npm install fails
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Use `npm install --legacy-peer-deps` if needed

### CORS errors
- Ensure both servers are running
- Check that frontend is on port 3000 and backend on 8080
- Verify CORS headers in WebSecurityConfig

### JWT token errors
- Check token expiration time in `application.properties`
- Clear localStorage and re-login if token is invalid
- Ensure token is being sent with `Authorization: Bearer <token>` header

## Future Enhancements

- Add vote results/statistics dashboard
- Implement real-time notifications
- Add email notifications for voting deadlines
- Migrate to PostgreSQL database
- Add user profile management
- Implement vote export/reporting features

## License

This is an educational project developed as part of a graduation program.
