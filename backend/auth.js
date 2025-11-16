const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function toDTO(user) {
  if (!user) return null;
  const { password, ...rest } = user;
  // MySQL rows already have `id` field
  return { ...rest, id: rest.id ? rest.id.toString() : undefined };
}

// initAuth(pool, jwtSecret) -> { router, authenticate, requireRole, toDTO }
// Expects `pool` to be a `mysql2/promise` pool or connection with `execute`.
function initAuth(pool, jwtSecret) {
  if (!pool) throw new Error("db pool is required");
  if (!jwtSecret) throw new Error("jwtSecret is required");

  const router = express.Router();

  async function hashPassword(password) {
    return bcrypt.hash(password, 10);
  }
  async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
  function signToken(payload) {
    return jwt.sign(payload, jwtSecret, { expiresIn: "7d" });
  }

  function authenticate(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer "))
      return res.status(401).json({ error: "Missing token" });
    const token = auth.slice(7);
    try {
      const data = jwt.verify(token, jwtSecret);
      req.user = data;
      return next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  }

  function requireRole(role) {
    return (req, res, next) => {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      if (req.user.role !== role)
        return res.status(403).json({ error: "Forbidden" });
      next();
    };
  }

  // Routes: /auth/register, /auth/login, /auth/me
  router.post("/register", async (req, res) => {
    try {
      const { username, password, role } = req.body;
      if (!username || !password)
        return res
          .status(400)
          .json({ error: "username and password required" });
      if (!["poster", "finder"].includes(role))
        return res
          .status(400)
          .json({ error: "role must be 'poster' or 'finder'" });

      const [rows] = await pool.execute(
        "SELECT id FROM users WHERE username = ?",
        [username]
      );
      if (rows.length > 0)
        return res.status(409).json({ error: "username already exists" });

      const pwdHash = await hashPassword(password);
      const [result] = await pool.execute(
        "INSERT INTO users (username, password, role, created_at) VALUES (?, ?, ?, NOW())",
        [username, pwdHash, role]
      );
      const insertedId = result.insertId;
      const [createdRows] = await pool.execute(
        "SELECT id, username, role, created_at FROM users WHERE id = ?",
        [insertedId]
      );
      res.status(201).json(toDTO(createdRows[0]));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password)
        return res
          .status(400)
          .json({ error: "username and password required" });

      const [rows] = await pool.execute(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );
      const user = rows[0];
      if (!user) return res.status(401).json({ error: "Invalid credentials" });

      const ok = await verifyPassword(password, user.password);
      if (!ok) return res.status(401).json({ error: "Invalid credentials" });

      const token = signToken({
        id: user.id.toString(),
        username: user.username,
        role: user.role,
      });
      res.json({ token, user: toDTO(user) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get("/me", authenticate, async (req, res) => {
    try {
      const id = req.user && req.user.id;
      if (!id)
        return res.status(400).json({ error: "Missing user id in token" });
      const [rows] = await pool.execute(
        "SELECT id, username, role, created_at FROM users WHERE id = ?",
        [id]
      );
      if (!rows || rows.length === 0)
        return res.status(404).json({ error: "Not found" });
      res.json(toDTO(rows[0]));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return { router, authenticate, requireRole, toDTO };
}

module.exports = initAuth;
