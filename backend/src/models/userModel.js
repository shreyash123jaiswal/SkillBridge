// src/models/userModel.js
// Abstracts user persistence – works with PostgreSQL or the in-memory fallback.

const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { query, getStore, isUsingFallback } = require("../config/db");

/**
 * Creates a new user and returns the persisted record (without password).
 */
async function createUser({ name, email, password }) {
  const hashed = await bcrypt.hash(password, 12);

  if (isUsingFallback()) {
    const store = getStore();
    const existing = store.users.find((u) => u.email === email);
    if (existing) throw Object.assign(new Error("Email already registered"), { statusCode: 409 });

    const user = { id: uuidv4(), name, email, password: hashed, created_at: new Date().toISOString() };
    store.users.push(user);
    const { password: _pw, ...safe } = user;
    return safe;
  }

  const { rows } = await query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name, email, hashed]
  );
  return rows[0];
}

/**
 * Finds a user by email. Returns full record including hashed password.
 */
async function findUserByEmail(email) {
  if (isUsingFallback()) {
    return getStore().users.find((u) => u.email === email) || null;
  }
  const { rows } = await query("SELECT * FROM users WHERE email = $1", [email]);
  return rows[0] || null;
}

/**
 * Finds a user by id. Returns record without password.
 */
async function findUserById(id) {
  if (isUsingFallback()) {
    const user = getStore().users.find((u) => u.id === id);
    if (!user) return null;
    const { password: _pw, ...safe } = user;
    return safe;
  }
  const { rows } = await query(
    "SELECT id, name, email, created_at FROM users WHERE id = $1",
    [id]
  );
  return rows[0] || null;
}

module.exports = { createUser, findUserByEmail, findUserById };
