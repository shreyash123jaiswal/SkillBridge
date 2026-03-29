# SkillBridge Backend – Complete Documentation

> A production-ready Node.js backend that bridges a React frontend with a Python FastAPI AI engine.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Folder Structure](#folder-structure)
4. [How It All Connects](#how-it-all-connects)
5. [Environment Variables](#environment-variables)
6. [API Endpoints Reference](#api-endpoints-reference)
7. [File-by-File Breakdown](#file-by-file-breakdown)
8. [Database Layer](#database-layer)
9. [Authentication Flow](#authentication-flow)
10. [AI Service Integration](#ai-service-integration)
11. [File Upload Flow](#file-upload-flow)
12. [Error Handling Strategy](#error-handling-strategy)
13. [How to Run](#how-to-run)
14. [Frontend Integration Guide](#frontend-integration-guide)

---

## Overview

SkillBridge backend is a **Node.js / Express** server that sits between three systems:

| System | Role |
|---|---|
| React Frontend | Sends requests (upload resume, chat, get jobs) |
| Node.js Backend | Validates, routes, persists, and orchestrates |
| Python FastAPI | Does all AI/ML processing |

The golden rule: **Node never does AI. Python never talks to the DB. React never calls Python directly.**

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     React Frontend                       │
│         (ResumeAnalyzer.jsx, Chatbot.jsx, etc.)         │
└────────────────────────┬────────────────────────────────┘
                         │  HTTP requests
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Node.js / Express Backend                   │
│                   PORT: 5000                             │
│                                                          │
│   ┌──────────┐  ┌────────────┐  ┌──────────────────┐   │
│   │  Routes  │→ │Controllers │→ │    Services       │   │
│   └──────────┘  └────────────┘  │  aiService.js     │   │
│                      │          │  jobService.js     │   │
│                      │          └──────────────────┬─┘   │
│                      ▼                             │     │
│                 ┌─────────┐                        │     │
│                 │ Models  │                        │     │
│                 │ (DB)    │                        │     │
│                 └────┬────┘                        │     │
└──────────────────────┼─────────────────────────────┼─────┘
                       │                             │
                       ▼                             ▼
             ┌──────────────────┐      ┌──────────────────────┐
             │   PostgreSQL     │      │  Python FastAPI       │
             │   (or in-memory  │      │  PORT: 8000           │
             │    fallback)     │      │  /analyze             │
             └──────────────────┘      │  /career-pivot        │
                                       │  /chat                │
                                       └──────────────────────┘
```

---

## Folder Structure

```
backend/
│
├── server.js                  ← Entry point. Boots DB + HTTP server.
├── .env                       ← All config lives here (never commit this)
├── package.json
│
└── src/
    ├── app.js                 ← Express setup, middleware, route mounting
    │
    ├── config/
    │   └── db.js              ← PostgreSQL connection + in-memory fallback
    │
    ├── middleware/
    │   └── authMiddleware.js  ← JWT verification, token signing
    │
    ├── models/
    │   ├── userModel.js       ← User CRUD (create, find by email/id)
    │   └── resumeModel.js     ← Resume + analysis persistence
    │
    ├── services/
    │   ├── aiService.js       ← ALL calls to Python FastAPI live here
    │   └── jobService.js      ← Job data (static catalogue → swap with DB)
    │
    ├── controllers/
    │   ├── resumeController.js    ← Handles resume upload logic
    │   ├── jobController.js       ← Handles job listing logic
    │   ├── careerController.js    ← Handles career pivot logic
    │   ├── chatController.js      ← Handles chatbot messages
    │   └── dashboardController.js ← Aggregates dashboard data
    │
    └── routes/
        ├── authRoutes.js          ← /api/auth/register, /api/auth/login
        ├── resumeRoutes.js        ← /api/upload-resume
        ├── jobRoutes.js           ← /api/jobs/*
        ├── careerRoutes.js        ← /api/career-pivot
        ├── chatRoutes.js          ← /api/chat
        └── dashboardRoutes.js     ← /api/dashboard
```

---

## How It All Connects

Here is the complete request lifecycle for a **resume upload**:

```
1. React sends:  POST /api/upload-resume  (FormData with file)
                            │
2. resumeRoutes.js          │  multer saves file to /uploads/
   receives the request     │  and attaches req.file
                            ▼
3. resumeController.js      Validates file exists
                            Calls saveResume() → stores filename in DB
                            │
                            ▼
4. aiService.js             Calls Python FastAPI:
                            POST http://localhost:8000/analyze
                            { file_path: "/uploads/12345.pdf" }
                            │
                            ▼
5. Python AI responds       { skills: [...], recommended_roles: [...], readiness_score: 87 }
                            │
                            ▼
6. resumeController.js      Calls saveAnalysis() → stores AI result in DB
                            Calls getRecommendedJobs(skills) → matches jobs
                            │
                            ▼
7. React receives:          {
                              resume: { id, filename },
                              analysis: { skills, recommended_roles, readiness_score },
                              recommended_jobs: [...]
                            }
```

---

## Environment Variables

All config is in `.env`. **Never hardcode these values in code.**

```env
# Server
PORT=5000
NODE_ENV=development

# JWT – change this secret before going to production
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# Python AI Service URL
AI_SERVICE_URL=http://localhost:8000

# PostgreSQL – leave default to use in-memory fallback
DATABASE_URL=postgresql://postgres:password@localhost:5432/skillbridge

# File uploads
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=10

# CORS – must match your frontend URL
CORS_ORIGIN=http://localhost:3000
```

---

## API Endpoints Reference

### Auth

| Method | Endpoint | Body | Returns |
|---|---|---|---|
| POST | `/api/auth/register` | `{ name, email, password }` | `{ token, user }` |
| POST | `/api/auth/login` | `{ email, password }` | `{ token, user }` |

### Resume

| Method | Endpoint | Body | Returns |
|---|---|---|---|
| POST | `/api/upload-resume` | `FormData: resume (file)` | `{ analysis, recommended_jobs }` |

### Jobs

| Method | Endpoint | Query / Body | Returns |
|---|---|---|---|
| GET | `/api/jobs/trending` | `?skill=React` (optional) | `{ count, jobs[] }` |
| GET | `/api/jobs/:id` | — | `{ job }` |
| POST | `/api/jobs/recommended` | `{ skills: [] }` | `{ count, jobs[] }` |

### Career Pivot

| Method | Endpoint | Body | Returns |
|---|---|---|---|
| POST | `/api/career-pivot` | `{ currentSkills: [], targetRole }` | `{ missingSkills, readinessScore, difficulty }` |

### Chat

| Method | Endpoint | Body | Returns |
|---|---|---|---|
| POST | `/api/chat` | `{ message, history: [] }` | `{ reply }` |

### Dashboard

| Method | Endpoint | Auth | Returns |
|---|---|---|---|
| GET | `/api/dashboard` | Optional | `{ skills, progress, recommended_jobs, job_readiness_score }` |

### Health Check

| Method | Endpoint | Returns |
|---|---|---|
| GET | `/health` | `{ status: "ok" }` |

---

## File-by-File Breakdown

### `server.js` – Entry Point

The very first file Node runs. It does three things in order:

1. Calls `connectDB()` to set up the database (or activate in-memory mode)
2. Pings the Python AI service and logs whether it's reachable
3. Calls `app.listen()` to start accepting HTTP traffic

It intentionally contains **no business logic** — just bootstrapping.

---

### `src/app.js` – Express Application

Configures the entire Express app:

- **CORS** — allows requests from `CORS_ORIGIN` (your React dev server)
- **Body parsers** — parses JSON and URL-encoded request bodies
- **Static files** — serves the `/uploads` folder so files are accessible via URL
- **Request logger** — logs every request in development mode
- **Route mounting** — maps URL prefixes to route files
- **404 handler** — returns clean JSON for unknown routes
- **Global error handler** — catches all errors thrown by controllers and returns appropriate HTTP status codes

---

### `src/config/db.js` – Database Layer

Manages the PostgreSQL connection pool. The key feature is its **automatic fallback**:

- If `DATABASE_URL` is set and reachable → uses PostgreSQL
- If PostgreSQL is unavailable → switches silently to an in-memory JavaScript object

This means the server always starts successfully, even without a database running. The in-memory store resets on every server restart (not for production use).

When PostgreSQL is connected, it also runs `CREATE TABLE IF NOT EXISTS` to create the three tables (`users`, `resumes`, `analyses`) automatically.

---

### `src/middleware/authMiddleware.js` – JWT Auth

Exports three things:

**`requireAuth`** — Middleware that blocks a request if there is no valid JWT token in the `Authorization: Bearer <token>` header. Used on routes that must be protected.

**`optionalAuth`** — Middleware that reads the token if present but never blocks. Used on routes like `/dashboard` and `/chat` where guest access is allowed but logged-in users get richer data.

**`signToken(userId)`** — Helper that creates a JWT, called during login and registration.

---

### `src/models/userModel.js` – User Persistence

Three functions that work with both PostgreSQL and the in-memory fallback:

- `createUser({ name, email, password })` — hashes the password with bcrypt, then saves
- `findUserByEmail(email)` — used during login to retrieve the stored hash for comparison
- `findUserById(id)` — used by auth middleware to confirm the token's user still exists

---

### `src/models/resumeModel.js` – Resume & Analysis Persistence

- `saveResume({ userId, filename, filepath })` — saves upload metadata
- `saveAnalysis({ resumeId, skills, recommendedRoles, readinessScore })` — saves AI results
- `getLatestAnalysisByUserId(userId)` — fetches the most recent analysis for dashboard display

---

### `src/services/aiService.js` – Python AI Bridge

**This is the only file that talks to Python.** It creates a shared `axios` instance pointing at `AI_SERVICE_URL` and exports three functions:

- `analyzeResume(filePath)` → calls `POST /analyze`
- `getCareerPivot(currentSkills, targetRole)` → calls `POST /career-pivot`
- `chat(message, history)` → calls `POST /chat`
- `ping()` → calls `GET /health` to check if Python is alive

If Python is offline (`ECONNREFUSED`), the error is caught here and rethrown with a clean `503` status code so the controller can handle it gracefully.

---

### `src/services/jobService.js` – Job Data

Contains a static catalogue of 8 jobs that mirrors the shape of the old `trending.js` file on the frontend. Each job has `title, company, salary_range, match_percentage, skills_required`, etc.

Three exported functions:

- `getTrendingJobs(skillFilter?)` — returns all jobs, optionally filtered by a skill keyword
- `getJobById(id)` — returns a single job
- `getRecommendedJobs(skills, limit)` — scores each job by how many of its required skills overlap with the user's skills, sorts by overlap, and returns the top results

**To swap with a real database:** replace these functions with DB queries — the controllers and routes don't need to change.

---

### `src/controllers/resumeController.js`

Orchestrates the resume upload flow:

1. Checks `req.file` exists (multer attaches it)
2. Saves the upload record via `resumeModel`
3. Calls `aiService.analyzeResume()` — wraps in try/catch so an AI outage returns a warning instead of a crash
4. Saves the analysis via `resumeModel`
5. Calls `jobService.getRecommendedJobs()` to attach relevant jobs
6. Returns the combined response to the frontend

---

### `src/controllers/jobController.js`

Three thin handlers that call `jobService` and return JSON. No business logic — just input validation and response formatting.

---

### `src/controllers/careerController.js`

Validates that `currentSkills` is a non-empty array and `targetRole` is a non-empty string, then delegates entirely to `aiService.getCareerPivot()`. Returns a 503 if the AI service is down.

---

### `src/controllers/chatController.js`

Validates that `message` is a non-empty string, then forwards it (along with optional conversation `history`) to `aiService.chat()`. Returns `{ reply: string }` to the frontend.

---

### `src/controllers/dashboardController.js`

Aggregates data for the user's dashboard:

1. Fetches the latest resume analysis from the DB (if the user is logged in)
2. Builds a `skillProgress` array showing current vs target proficiency
3. Fetches recommended jobs based on extracted skills
4. Computes overall progress percentages
5. Returns the full dashboard payload

Works for both guests (empty state) and authenticated users (personalised data).

---

### Route Files

Each route file is intentionally minimal — it just maps HTTP methods + paths to controller functions and optionally applies middleware.

| Route file | Middleware applied |
|---|---|
| `resumeRoutes.js` | `optionalAuth` + `multer.single("resume")` |
| `jobRoutes.js` | None (public) |
| `careerRoutes.js` | `optionalAuth` |
| `chatRoutes.js` | `optionalAuth` |
| `dashboardRoutes.js` | `optionalAuth` |
| `authRoutes.js` | None (public) |

---

## Database Layer

### Tables

```sql
users
  id          UUID  PRIMARY KEY
  name        VARCHAR(255)
  email       VARCHAR(255) UNIQUE
  password    VARCHAR(255)   ← bcrypt hash, never plain text
  created_at  TIMESTAMPTZ

resumes
  id          UUID  PRIMARY KEY
  user_id     UUID  → users.id  (nullable for guest uploads)
  filename    VARCHAR(255)
  filepath    TEXT
  uploaded_at TIMESTAMPTZ

analyses
  id                UUID  PRIMARY KEY
  resume_id         UUID  → resumes.id
  skills            JSONB
  recommended_roles JSONB
  readiness_score   INTEGER
  created_at        TIMESTAMPTZ
```

### In-Memory Fallback

When PostgreSQL is unavailable, `db.js` uses a plain JavaScript object:

```js
const inMemoryStore = {
  users: [],
  resumes: [],
  analyses: [],
}
```

All model functions check `isUsingFallback()` and switch their implementation accordingly. **Data is lost on server restart** — this is intentional for local development.

---

## Authentication Flow

```
Register                              Login
   │                                    │
POST /api/auth/register             POST /api/auth/login
{ name, email, password }           { email, password }
   │                                    │
   ▼                                    ▼
bcrypt.hash(password, 12)         findUserByEmail(email)
   │                               bcrypt.compare(password, hash)
   ▼                                    │
saveUser to DB                          ▼
   │                               signToken(user.id)
   ▼                                    │
signToken(user.id)                      ▼
   │                              { token, user }
   ▼
{ token, user }

──────────────────────────────────────────────────────
Subsequent authenticated requests:

Frontend sends:  Authorization: Bearer <token>
                        │
                 authMiddleware.js
                 jwt.verify(token, JWT_SECRET)
                        │
                 findUserById(payload.id)
                        │
                 req.user = user  ← attached to request
                        │
                 Controller runs with req.user available
```

---

## AI Service Integration

All calls to Python FastAPI go through `src/services/aiService.js`. The Python service must expose these three endpoints:

```
POST http://localhost:8000/analyze
  Request:  { file_path: string }
  Response: { skills: string[], recommended_roles: string[], readiness_score: number }

POST http://localhost:8000/career-pivot
  Request:  { current_skills: string[], target_role: string }
  Response: { missing_skills: string[], readiness_score: number, difficulty: string, learning_roadmap: string[] }

POST http://localhost:8000/chat
  Request:  { message: string, history: [{ role, content }] }
  Response: { reply: string }

GET  http://localhost:8000/health
  Response: { status: "ok" }
```

If Python is offline, the backend responds with `503 Service Unavailable` — it never crashes.

---

## File Upload Flow

```
React Frontend sends FormData:
  key: "resume"
  value: <PDF / DOC / DOCX file>
        │
        ▼
multer (resumeRoutes.js)
  - Validates file type (PDF, DOC, DOCX only)
  - Rejects invalid or missing files
  - Saves file to /uploads/
  - Attaches file to req.file
        │
        ▼
resumeController.js
  - Validates req.file exists
  - Saves resume metadata to DB
  - Extracts file path (req.file.path)
        │
        ▼
aiService.js (Backend → AI Bridge)
  - Sends request to Python FastAPI:
    POST http://localhost:8000/analyze
    {
      file_path: "/uploads/<filename>"
    }
        │
        ▼
Python FastAPI AI Service
  - Reads file from shared filesystem
  - Processes resume using AI/ML
  - Extracts:
      • skills
      • recommended roles
      • readiness score
  - Returns structured response
        │
        ▼
aiService.js
  - Receives AI response
  - Handles failures (returns 503 if AI is down)
        │
        ▼
resumeController.js
  - Stores AI analysis in DB
  - Calls jobService to match jobs using extracted skills
        │
        ▼
jobService.js
  - Compares user skills with job dataset
  - Returns top matching jobs
        │
        ▼
Final Response to Frontend:
  {
    resume: { id, filename },
    analysis: {
      skills: [...],
      recommended_roles: [...],
      readiness_score: number
    },
    recommended_jobs: [...]
  }
```

> **Important:** Python FastAPI and Node must share the same filesystem so Python can read the file from the path Node sends. In Docker, this means mounting the same volume. In local dev, they both run on the same machine so it works automatically.

---

## Error Handling Strategy

All errors funnel to the global error handler in `app.js`. Controllers use `next(err)` to pass errors up.

| Scenario | HTTP Status | How it's handled |
|---|---|---|
| File too large | `413` | Multer throws `LIMIT_FILE_SIZE`, caught in global handler |
| Wrong file type | `415` | Multer `fileFilter` rejects with custom error |
| Missing required field | `400` | Controller validates and returns early |
| Invalid/expired JWT | `401` | `authMiddleware` catches and returns message |
| User not found | `401` | `authMiddleware` checks DB after verifying token |
| Email already exists | `409` | `userModel` detects duplicate and throws |
| AI service offline | `503` | `aiService` catches `ECONNREFUSED` and rethrows cleanly |
| AI service error | `502` | `aiService` catches non-2xx and rethrows with status |
| Unknown route | `404` | Catch-all handler at bottom of `app.js` |
| Unexpected crash | `500` | Global handler, stack trace logged in dev only |

---

## How to Run

### Prerequisites

- Node.js 18+
- npm
- Python FastAPI running on port 8000 (optional – backend starts without it)
- PostgreSQL (optional – in-memory fallback activates automatically)

### Steps

```bash
# 1. Enter the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Configure environment
# Open .env and update:
#   JWT_SECRET → any long random string
#   DATABASE_URL → your PostgreSQL URL (or leave as-is for in-memory mode)
#   AI_SERVICE_URL → URL where your Python service runs
#   CORS_ORIGIN → URL where your React app runs

# 4. Start in development mode (auto-restarts on file changes)
npm run dev

# 5. Or start in production mode
npm start
```

You should see:
```
⚠️  No DATABASE_URL detected – using in-memory store (development mode)
✅  Python AI service reachable at http://localhost:8000

🚀  SkillBridge backend running on http://localhost:5000
   Health check → http://localhost:5000/health
   API base     → http://localhost:5000/api
```

---

## Frontend Integration Guide

### Replace `trending.js` with API

```js
// Before (static file)
import jobs from './trending.js'

// After (API call)
const res = await fetch('http://localhost:5000/api/jobs/trending')
const { jobs } = await res.json()
```

### Resume Upload (`ResumeAnalyzer.jsx`)

```js
const formData = new FormData()
formData.append('resume', selectedFile)   // key must be "resume"

const res = await fetch('http://localhost:5000/api/upload-resume', {
  method: 'POST',
  body: formData,
  // Do NOT set Content-Type — browser sets it with boundary automatically
})
const data = await res.json()
// data.analysis.skills       → string[]
// data.analysis.readiness_score → number
// data.recommended_jobs      → job[]
```

### Chatbot (`Chatbot.jsx`)

```js
const res = await fetch('http://localhost:5000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: userInput, history: conversationHistory })
})
const { reply } = await res.json()
```

### Authenticated Requests

```js
// After login, store the token
localStorage.setItem('token', data.token)

// Send it with protected requests
const token = localStorage.getItem('token')
fetch('http://localhost:5000/api/dashboard', {
  headers: { Authorization: `Bearer ${token}` }
})
```

---

*Generated for SkillBridge – Intelligent Career Guidance Platform*