// src/config/db.js
// PostgreSQL connection with automatic in-memory fallback for development

const { Pool } = require("pg");

// ── In-memory store (used when DB_URL is absent or connection fails) ──────────
const inMemoryStore = {
  users: [],
  resumes: [],
  analyses: [],
};

let pool = null;
let usingFallback = false;

/**
 * Attempts to connect to PostgreSQL.
 * If the env vars are absent or connection fails, silently switches to the
 * in-memory fallback so the server can still start and serve requests.
 */
async function connectDB() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString || connectionString.includes("password@localhost")) {
    // No real DB configured – use fallback immediately
    usingFallback = true;
    console.log(
      "⚠️  No DATABASE_URL detected – using in-memory store (development mode)"
    );
    return;
  }

  try {
    pool = new Pool({ connectionString, ssl: false });
    await pool.query("SELECT 1"); // quick connectivity test
    console.log("✅  PostgreSQL connected");
    await createTables();
  } catch (err) {
    console.warn(
      `⚠️  PostgreSQL unavailable (${err.message}) – falling back to in-memory store`
    );
    pool = null;
    usingFallback = true;
  }
}

/** Creates application tables if they don't already exist. */
async function createTables() {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name        VARCHAR(255) NOT NULL,
      email       VARCHAR(255) UNIQUE NOT NULL,
      password    VARCHAR(255) NOT NULL,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS resumes (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
      filename    VARCHAR(255) NOT NULL,
      filepath    TEXT NOT NULL,
      uploaded_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS analyses (
      id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      resume_id         UUID REFERENCES resumes(id) ON DELETE CASCADE,
      skills            JSONB,
      recommended_roles JSONB,
      readiness_score   INTEGER,
      created_at        TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await pool.query(sql);
  console.log("✅  Database tables ready");
}

// ── Thin query wrapper that routes to PG or fallback ─────────────────────────

/**
 * Execute a raw SQL query (only works when PostgreSQL is connected).
 */
async function query(text, params) {
  if (usingFallback) {
    throw new Error("query() called but running in in-memory fallback mode");
  }
  return pool.query(text, params);
}

/**
 * Returns the in-memory store. Only meaningful in fallback mode.
 */
function getStore() {
  return inMemoryStore;
}

function isUsingFallback() {
  return usingFallback;
}

module.exports = { connectDB, query, getStore, isUsingFallback };
