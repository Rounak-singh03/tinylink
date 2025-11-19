import { db } from "../db.js";

function isValidUrl(url) {
  try { new URL(url); return true; }
  catch { return false; }
}

export const createLink = async (req, res) => {
  const { url, code } = req.body;

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  const exists = await db.query("SELECT 1 FROM links WHERE code=$1", [code]);
  if (exists.rowCount > 0) {
    return res.status(409).json({ error: "Code already exists" });
  }

  await db.query(
    "INSERT INTO links (code, url) VALUES ($1, $2)",
    [code, url]
  );

  res.status(201).json({ message: "Created", code, url });
};

export const getAllLinks = async (req, res) => {
  const result = await db.query("SELECT * FROM links ORDER BY clicks DESC");
  res.json(result.rows);
};

export const getLinkStats = async (req, res) => {
  const { code } = req.params;
  const result = await db.query("SELECT * FROM links WHERE code=$1", [code]);

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json(result.rows[0]);
};

export const deleteLink = async (req, res) => {
  const { code } = req.params;

  await db.query("DELETE FROM links WHERE code=$1", [code]);

  res.json({ message: "Deleted" });
};
