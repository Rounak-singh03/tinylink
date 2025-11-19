import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import linksRouter from "./routes/links.js";
import { db } from "./db.js";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());

// serve static files
app.use(express.static(path.join(__dirname, "..", "public")));

// API routes
app.use("/api/links", linksRouter);

// health
app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true, version: "1.0" });
});

// IMPORTANT: serve stats.html at /code/:code BEFORE generic redirect
app.get("/code/:code", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "stats.html"));
});

// generic redirect for /:code (must be last route)
app.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const r = await db.query("SELECT url FROM links WHERE code=$1", [code]);
    if (r.rowCount === 0) return res.status(404).send("Not Found");

    const url = r.rows[0].url;
    await db.query("UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE code=$1", [code]);

    return res.redirect(302, url);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

