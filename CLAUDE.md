# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack book library management application with a React + Vite frontend and Express.js backend. The system manages books, authors, users, and reviews with role-based access control.

## Stack

**Frontend:**
- React 19 with Vite
- React Router for navigation
- Axios for API calls
- Three.js + React Three Fiber for 3D graphics
- GSAP for animations
- Tailwind-inspired styling with custom CSS
- N8N Chat integration

**Backend:**
- Express.js 5.x with ES modules
- PostgreSQL database with Prisma 7.2 ORM
- JWT-based authentication with bcryptjs
- Cloudinary for image storage
- Multer for file uploads
- Zod for validation

## Common Development Tasks

### Frontend

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm lint

# Run single file: specify in vite.config.js or use --entry flag
```

The dev server runs on `http://localhost:5173` by default.

### Backend

```bash
# Development with auto-restart (nodemon)
cd backend && npm run dev

# Production start
npm run start

# Database migrations
npx prisma migrate dev
npx prisma migrate deploy

# Generate/regenerate Prisma client
npx prisma generate

# Database seed (defined in prisma/seed.js)
npx prisma db seed
```

The backend runs on `http://localhost:3000` by default (or `PORT` env var).

### Database

- PostgreSQL connection: defined in `backend/.env` as `DATABASE_URL`
- Schema: `backend/prisma/schema.prisma`
- Migrations: `backend/prisma/migrations/`
- Prisma client generated to: `backend/src/generated/prisma/`

**Models:** User, Rol, Permission, Libro, Author, Review

## Architecture

### Backend: MVC Pattern

```
backend/src/
├── controllers/       # HTTP request handlers (authController, libroController, etc.)
├── services/          # Business logic layer (authService, libroService, etc.)
├── routes/            # Express route definitions
├── middlewares/       # Validation, auth, file upload handling
├── schemas/           # Validation schemas (likely Zod)
├── config/            # Config files (cloudinary.js for image uploads)
├── lib/               # Utility functions (prisma.js for DB client)
└── generated/         # Prisma client (auto-generated, don't edit)
```

**Request Flow:** Route → Middleware (validate, auth, file upload) → Controller → Service (business logic) → Prisma DB

### Frontend: Component-Based

```
src/
├── components/        # Reusable React components (headers, footers, cards, backgrounds, galleries)
├── pages/             # Page components (full pages routed by React Router)
├── services/          # API communication functions (calls to backend /api endpoints)
├── context/           # Context API state management
├── utils/             # Helper functions
├── assets/            # Images, icons, static files
└── compCSS/           # Component-specific CSS modules
```

## Key Patterns & Architecture Notes

### Authentication
- JWT tokens issued on login (`/api/v1/auth/login`)
- Token passed in Authorization header for protected routes
- Middleware checks auth and validates JWT
- Password hashing with bcryptjs before storage

### File Upload & Image Storage
- Multer middleware handles multipart/form-data
- Images uploaded to Cloudinary (configured in `backend/src/config/cloudinary.js`)
- Image URL stored in database, actual file in cloud storage
- Useful for scalability: images don't take up server storage

### Database Relationships
- **User → Rol**: Many-to-one (each user has one role)
- **Rol ↔ Permission**: Many-to-many (roles have permissions)
- **Author ← Libro**: One-to-many (author has many books)
- **Libro ← Review**: One-to-many (book has many reviews)
- **User ← Review**: One-to-many (user has many reviews)
- Soft deletes: `deleted` boolean field on User, Libro, Author, Review

### API Versioning
- All endpoints prefixed with `/api/v1/` (e.g., `/api/v1/auth/login`, `/api/v1/users`)
- Allows future API changes without breaking clients

## Important Implementation Details

### Prisma & Database Connection
- Using Prisma adapter for PostgreSQL (`@prisma/adapter-pg`)
- Connection pool from `pg` library
- Client generated to `backend/src/generated/prisma/` (do not edit)
- Models use soft deletes (`deleted` boolean) rather than hard deletes where applicable

### Schema Validation
- Zod schemas likely in `backend/src/schemas/`
- Middleware validates request body before reaching controllers
- Error handling for validation failures with appropriate HTTP status codes

### Cloudinary Integration
- Configured in `backend/src/config/cloudinary.js`
- Used for book cover images and other media
- Images converted to base64 and uploaded via dataURI format
- Secure URLs stored in database

### Async/Await & Error Handling
- All service and controller functions use async/await
- Try-catch blocks with specific error messages
- Prisma errors (like P2025 for not found) caught and translated to user-friendly messages

## Frontend-Backend Communication

- Axios used for all HTTP requests
- Base URL likely configured in `src/services/` (check for apiClient or similar)
- API calls made from component lifecycle or event handlers
- State updates via Context API or component state

## Development Workflow

1. Make changes to frontend or backend code
2. Frontend auto-reloads via Vite HMR on file save
3. Backend auto-restarts via nodemon on file save
4. Test via browser (`http://localhost:5173`) or API client (Postman, etc.)
5. Database changes require `prisma migrate dev` with a migration name

## Common Gotchas

- **Environment variables**: Backend reads from `backend/.env` (not versioned, keep DB credentials safe)
- **CORS**: Configured in `backend/src/app.js` — if frontend can't call backend, check CORS settings
- **Prisma client**: After schema changes, always run `npx prisma migrate dev` or `npx prisma generate`
- **Image uploads**: Requires valid Cloudinary credentials in `.env`
- **Database soft deletes**: Use `deleted` boolean in queries where needed; don't rely on hard deletes

## Component & Logic Reuse

**IMPORTANT:** Before creating any new component or implementing business logic, always:

1. **Search existing components** — Review `src/components/` and `backend/src/services/` for similar functionality
2. **Check for reusable patterns** — Look at existing component APIs, hooks, service functions
3. **Extend before creating** — If similar logic exists, refactor to make it reusable rather than duplicating
4. **Examples of reusable components:**
   - Background animations: `background_*.jsx` (home, store, books, about) — abstract common patterns
   - Cards & galleries: `card_swap.jsx`, `circular_gallery.jsx`, `croma_grid.jsx` — may be adaptable
   - Custom UI: `custom_select.jsx`, `magic_button.jsx` — study before building similar
5. **Backend services** — Each model (Libro, Author, User) has a service file with CRUD logic; extend these rather than creating parallel logic

This keeps the codebase maintainable and prevents drift in styling, behavior, and patterns.

## Debugging Tips

- **Backend errors**: Check terminal where `npm run dev` is running for nodemon restart messages and console logs
- **Frontend errors**: Check browser console (F12) and Network tab for API calls
- **Database issues**: Use `npx prisma studio` to visually browse database or run raw queries
- **Auth issues**: Verify JWT token in request headers; check middleware order in `app.js`
