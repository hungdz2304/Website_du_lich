require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MYSQL_URI = process.env.MYSQL_URI; // optional full URI
const MYSQL_HOST = process.env.MYSQL_HOST || "127.0.0.1";
const MYSQL_PORT = process.env.MYSQL_PORT || 3306;
const MYSQL_USER = process.env.MYSQL_USER || "root";
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || "";
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || "tour";
const PORT = parseInt(
  process.env.SERVER_PORT || process.env.PORT || "5000",
  10
);

// MySQL pool will be created at start
let pool;

function toDTO(row) {
  if (!row) return null;
  const { password, ...rest } = row;
  if (rest.id !== undefined) rest.id = rest.id.toString();
  // normalize snake_case columns to camelCase
  if (rest.image_url !== undefined && rest.imageUrl === undefined) {
    rest.imageUrl = rest.image_url;
    delete rest.image_url;
  }
  if (rest.owner_id !== undefined && rest.ownerId === undefined) {
    rest.ownerId = rest.owner_id;
    delete rest.owner_id;
  }
  if (rest.user_id !== undefined && rest.userId === undefined) {
    rest.userId = rest.user_id;
    delete rest.user_id;
  }
  if (rest.created_at !== undefined && rest.createdAt === undefined) {
    rest.createdAt = rest.created_at;
    delete rest.created_at;
  }
  if (rest.updated_at !== undefined && rest.updatedAt === undefined) {
    rest.updatedAt = rest.updated_at;
    delete rest.updated_at;
  }
  return rest;
}

async function start() {
  try {
    // create MySQL pool
    if (MYSQL_URI) {
      pool = mysql.createPool(MYSQL_URI);
    } else {
      pool = mysql.createPool({
        host: MYSQL_HOST,
        port: MYSQL_PORT,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        timezone: "Z",
      });
    }

    const initAuth = require("./auth");
    const {
      router: authRouter,
      authenticate,
      requireRole,
    } = initAuth(pool, process.env.JWT_SECRET || "change_this_secret");
    app.use("/auth", authRouter);

    //bill
    app.post("/bills", authenticate, async (req, res) => {
      try {
        // Validate body
        if (!req.body || Object.keys(req.body).length === 0) {
          return res.status(400).json({
            error:
              "Empty request body. Set Content-Type: application/json and send JSON.",
          });
        }

        const userId = req.user && req.user.id;
        const { tourId, quantity } = req.body;

        if (!userId) return res.status(401).json({ error: "Unauthorized" });
        if (!tourId)
          return res
            .status(400)
            .json({ error: "Missing required field: tourId" });
        const qty = parseInt(quantity || "1", 10);
        if (isNaN(qty) || qty <= 0)
          return res.status(400).json({ error: "Invalid quantity" });

        // Validate tour exists and get price (MySQL)
        const [tourRows] = await pool.execute(
          "SELECT * FROM tours WHERE id = ?",
          [tourId]
        );
        const tourDoc = tourRows[0];
        if (!tourDoc) return res.status(404).json({ error: "Tour not found" });

        const totalPrice = (tourDoc.price || 0) * qty;

        const [ins] = await pool.execute(
          "INSERT INTO bills (user_id, tour_id, quantity, total_price, created_at) VALUES (?, ?, ?, ?, NOW())",
          [userId, tourId, qty, totalPrice]
        );
        const insertedId = ins.insertId;
        const [rows] = await pool.execute("SELECT * FROM bills WHERE id = ?", [
          insertedId,
        ]);
        res.status(201).json(toDTO(rows[0]));
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.get("/bills", authenticate, async (req, res) => {
      const userId = req.user.id;
      try {
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const [rows] = await pool.execute(
          `SELECT b.*, t.id AS tour_id, t.name AS tour_name, t.description AS tour_description, t.price AS tour_price, t.image_url AS tour_image_url
           FROM bills b
           LEFT JOIN tours t ON b.tour_id = t.id
           WHERE b.user_id = ?
           ORDER BY b.id DESC`,
          [userId]
        );

        const result = rows.map((b) => ({
          id: b.id.toString(),
          userId: b.user_id,
          tourId: b.tour_id,
          quantity: b.quantity,
          totalPrice: b.total_price,
          createdAt: b.created_at,
          tour: b.tour_id
            ? {
                id: b.tour_id.toString(),
                name: b.tour_name,
                description: b.tour_description,
                price: b.tour_price,
                imageUrl: b.tour_image_url,
              }
            : null,
        }));

        return res.json(result);
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    });

    // health / connection test
    app.get("/api/db-test", async (req, res) => {
      try {
        // simple query to verify connection
        const [rows] = await pool.execute("SELECT 1 AS ok");
        res.json({ ok: true, rows: rows });
      } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
      }
    });

    // get all tours
    app.get("/tours", async (req, res) => {
      try {
        // support query params: search (name/description), departure
        const { search, departure } = req.query || {};

        let sql = "SELECT * FROM tours";
        const where = [];
        const params = [];

        if (search) {
          // case-insensitive search on name and description
          where.push("(name LIKE ? OR description LIKE ?)");
          const term = `%${search}%`;
          params.push(term, term);
        }

        if (departure) {
          where.push("departure LIKE ?");
          params.push(`%${departure}%`);
        }

        if (where.length > 0) {
          sql += " WHERE " + where.join(" AND ");
        }

        sql += " ORDER BY id DESC";

        const [rows] = await pool.execute(sql, params);
        res.json(rows.map(toDTO));
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // get single tour
    app.get("/tours/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const [rows] = await pool.execute("SELECT * FROM tours WHERE id = ?", [
          id,
        ]);
        const doc = rows[0];
        if (!doc) return res.status(404).json({ error: "Not found" });
        res.json(toDTO(doc));
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // create tour (with body guard)
    app.post(
      "/tours",
      authenticate,
      requireRole("poster"),
      async (req, res) => {
        try {
          if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
              error:
                "Empty request body. Set Content-Type: application/json and send JSON.",
            });
          }

          const { name, description, price, imageUrl, departure, spots } =
            req.body;
          if (!name)
            return res
              .status(400)
              .json({ error: "Missing required field: name" });

          const ownerId = req.user.id;
          const [ins] = await pool.execute(
            `INSERT INTO tours (owner_id, name, description, price, image_url, departure, spots, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
            [
              ownerId,
              name,
              description || "",
              price || 0,
              imageUrl || "",
              departure || "",
              spots || 0,
            ]
          );
          const insertedId = ins.insertId;
          const [rows] = await pool.execute(
            "SELECT * FROM tours WHERE id = ?",
            [insertedId]
          );
          res.status(201).json(toDTO(rows[0]));
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      }
    );

    // update tour
    app.put(
      "/tours/:id",
      authenticate,
      requireRole("poster"),
      async (req, res) => {
        try {
          const id = req.params.id;
          const { name, description, price, imageUrl, departure, spots } =
            req.body;

          // check ownership
          const [ownerRows] = await pool.execute(
            "SELECT owner_id FROM tours WHERE id = ?",
            [id]
          );
          const owner = ownerRows[0];
          if (!owner) return res.status(404).json({ error: "Not found" });
          if (
            owner.owner_id.toString() !== req.user.id &&
            req.user.role !== "admin"
          ) {
            return res.status(403).json({ error: "Forbidden" });
          }

          const parts = [];
          const params = [];
          if (name !== undefined) {
            parts.push("name = ?");
            params.push(name);
          }
          if (description !== undefined) {
            parts.push("description = ?");
            params.push(description);
          }
          if (price !== undefined) {
            parts.push("price = ?");
            params.push(price);
          }
          if (imageUrl !== undefined) {
            parts.push("image_url = ?");
            params.push(imageUrl);
          }
          if (departure !== undefined) {
            parts.push("departure = ?");
            params.push(departure);
          }
          if (spots !== undefined) {
            parts.push("spots = ?");
            params.push(spots);
          }
          if (parts.length === 0)
            return res.status(400).json({ error: "No fields to update" });
          parts.push("updated_at = NOW()");

          const sql = `UPDATE tours SET ${parts.join(", ")} WHERE id = ?`;
          params.push(id);
          await pool.execute(sql, params);
          const [rows] = await pool.execute(
            "SELECT * FROM tours WHERE id = ?",
            [id]
          );
          res.json(toDTO(rows[0]));
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      }
    );

    // delete tour
    app.delete(
      "/tours/:id",
      authenticate,
      requireRole("poster"),
      async (req, res) => {
        try {
          const id = req.params.id;
          const [rows] = await pool.execute(
            "SELECT * FROM tours WHERE id = ?",
            [id]
          );
          const before = rows[0];
          if (!before) return res.status(404).json({ error: "Not found" });
          if (
            before.owner_id.toString() !== req.user.id &&
            req.user.role !== "admin"
          ) {
            return res.status(403).json({ error: "Forbidden" });
          }
          await pool.execute("DELETE FROM tours WHERE id = ?", [id]);
          res.json({ deleted: toDTO(before) });
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      }
    );

    app.listen(PORT, () => {
      console.log(`API server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
// ...existing code...
