# LibraTrack — Smart Library Management System

A full-stack Library Management System with Smart Rack Locator, built with React, Node.js/Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on port 27017, or Atlas URI)

### Backend Setup
```bash
cd backend
npm install
npm run seed    # Seeds admin, student, and 15 sample books
npm run dev     # Starts on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev     # Starts on http://localhost:5173
```

### Default Credentials (after seeding)
| Role    | Email              | Password    |
|---------|--------------------|-------------|
| Admin   | admin@library.com  | admin123    |
| Student | john@student.com   | student123  |

## 📁 Project Structure

```
lib/
├── backend/              # Node.js + Express API
│   ├── config/           # DB connection
│   ├── controllers/      # Business logic (MVC)
│   ├── middleware/        # Auth & role guards
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API route definitions
│   ├── seed.js           # Database seeder
│   └── server.js         # Entry point
│
├── frontend/             # React + Vite
│   └── src/
│       ├── api/          # Axios instance
│       ├── components/   # Reusable UI components
│       ├── context/      # Auth context (JWT)
│       ├── pages/        # Route pages
│       └── utils/        # Helpers
│
└── README.md
```

## 🔑 Features
- **JWT Authentication** with role-based access (Admin / Student)
- **Book CRUD** — Add, edit, delete, browse books
- **Smart Rack Locator** — Real-time availability and rack location display
- **Issue & Return** — Admin can issue/return books with due date tracking
- **Search & Filter** — Search by title/author/ISBN, filter by category and availability
- **Dashboard** — Admin stats overview, student borrow tracking
- **Overdue Detection** — Automatic overdue status updates
- **Responsive Design** — Works on desktop and mobile

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Current user

### Books
- `GET /api/books` — List (with search/filter)
- `GET /api/books/:id` — Single book
- `POST /api/books` — Add (admin)
- `PUT /api/books/:id` — Update (admin)
- `DELETE /api/books/:id` — Delete (admin)
- `GET /api/books/search/suggestions` — Autocomplete

### Transactions
- `POST /api/transactions/issue` — Issue book (admin)
- `POST /api/transactions/return/:id` — Return (admin)
- `GET /api/transactions` — All (admin)
- `GET /api/transactions/my` — My books (student)

### Dashboard
- `GET /api/dashboard/stats` — Statistics
