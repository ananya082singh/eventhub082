# EventHub - Event Booking System

EventHub is a full-stack web application for discovering events and booking seats instantly. It features a modern, responsive user interface with glassmorphism styling, a secure JWT-based authentication system, and a robust transaction-safe booking engine.

## 🚀 Live Demo

🌐 **[https://eventhub082.vercel.app](https://eventhub082.vercel.app)**

> Frontend deployed on Vercel · Backend API deployed on vercel · Database hosted on Railway PostgreSQL

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: TailwindCSS 4 (custom colors, glassmorphism UI, smooth hover animations, skeleton loaders)
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios (configured with response interceptors for global 401 redirection and bearer token attachments)
- **Feedback**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express (v5)
- **Database ORM**: Prisma Client
- **Database**: PostgreSQL (hosted on Railway)
- **Authentication**: JWT (JSON Web Tokens) & BcryptJS
- **Validation**: Express-validator

---

## 📂 Repository Structure
```text
EventHub/
├── backend/
│   ├── prisma/             # Database schema and seed script
│   ├── src/
│   │   ├── controllers/    # API controllers (auth, bookings, events)
│   │   ├── middleware/     # Auth, errorHandler, and express-validator middleware
│   │   ├── routes/         # Express router entry points
│   │   ├── utils/          # ApiError class, JWT utilities
│   │   └── server.js       # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios instance (dynamic baseURL fallback)
│   │   ├── components/     # Reusable UI elements (Navbar, Cards, Skeletons)
│   │   ├── context/        # Authentication React Context
│   │   ├── pages/          # Home, EventDetail, MyBookings, Login, Register
│   │   ├── App.jsx         # App router config
│   │   └── main.jsx
│   └── package.json
└── vercel.json             # Monorepo deployment config (if deploying both on Vercel)
```

---

## 💻 Local Development Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **PostgreSQL** running locally

### 1. Database Setup
Ensure PostgreSQL is running on your machine. Create an empty database named `event_booking`.

### 2. Configure Environment Variables
#### Backend Setup
In the `backend` folder, create a `.env` file:
```env
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/event_booking?schema=public"
JWT_SECRET="your-jwt-secret-key"
PORT=5001
CORS_ORIGIN="http://localhost:5173"
```

#### Frontend Setup
In the `frontend` folder, create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5001/api/v1
```

### 3. Install Dependencies & Start Servers
#### Run Backend:
```bash
cd backend
npm install
npx prisma db push
npm run db:seed
npm run dev
```
The backend server will run at `http://localhost:5001` and seeds 6 test events.

#### Run Frontend:
```bash
cd ../frontend
npm install
npm run dev
```
The frontend dev server will run at `http://localhost:5173`.

---

## 🔒 Overbooking & Concurrency Prevention
To prevent race conditions where multiple users try to book the last available seats simultaneously, the booking engine utilizes **Prisma Interactive Transactions (`prisma.$transaction`)**.

When a booking is requested:
1. The database transaction starts and fetches the event record.
2. It checks if there are enough `availableSeats`.
3. If seats are available, it decrements the `availableSeats` on the event table and inserts a new `Booking` record.
4. If the seats run out before the transaction commits, the database transaction is rolled back, preventing overbooking.

---

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Registers a new user.
- `POST /api/v1/auth/login` - Authenticates user and returns JWT.

### Events (Public)
- `GET /api/v1/events` - Get list of all events (sorted by date).
- `GET /api/v1/events/:id` - Get details of a specific event.

### Bookings (Protected - JWT Required)
- `POST /api/v1/bookings` - Book seats for an event (updates seat counts safely).
- `GET /api/v1/bookings/my` - Get bookings for the authenticated user.
- `DELETE /api/v1/bookings/:id` - Cancel a booking and release seats back to the event.

---

## 🌐 Deployment Configuration

### Backend (Vercel)
- Expose the server using `PORT` (defaults to `5000`).
- Ensure variables like `DATABASE_URL` (Public PostgreSQL hostname) and `JWT_SECRET` are configured.
- Root Directory must be set to `backend` in Railway settings.

### Frontend (Vercel)
- Environment variable `VITE_API_BASE_URL` is set to `https://eventhub082-production.up.railway.app/api/v1`.
- Root Directory is set to `frontend`.

## Assumptions
- No admin panel; events are managed via the seed script directly
- A user can book the same event multiple times (each creates a separate booking)
- Cancellation is immediate with no grace period or refund logic
- Authentication tokens are stored in localStorage for simplicity

## Design Decisions
- **Prisma transactions** used for booking to prevent race conditions and overbooking
- **PostgreSQL** chosen over MongoDB for ACID guarantees on seat inventory
- **Express-validator** for input validation on all endpoints
- **Axios interceptors** handle 401 responses globally, auto-redirecting to login
- **React Context** for auth state to avoid prop drilling across pages
