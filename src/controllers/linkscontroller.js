import { db } from "../db.js";

// ------------------- Utilities -------------------
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function generateCode(len = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let res = "";
  for (let i = 0; i < len; i++) {
    res += chars[Math.floor(Math.random() * chars.length)];
  }
  return res;
}

// ------------------- CREATE -------------------
export const createLink = async (req, res) => {
  try {
    const { url, code: customCode } = req.body;

    if (!url || !isValidUrl(url)) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    let code = customCode?.trim();

    if (!code) {
      code = generateCode(6);
    }

    if (!/^[A-Za-z0-9]{6,8}$/.test(code)) {
      return res
        .status(400)
        .json({ error: "Code must be 6-8 characters [A-Za-z0-9]" });
    }

    const exists = await db.query("SELECT 1 FROM links WHERE code=$1", [code]);
    if (exists.rowCount > 0) {
      return res.status(409).json({ error: "Short code already exists" });
    }

    await db.query("INSERT INTO links (code, url) VALUES ($1, $2)", [
      code,
      url,
    ]);

    return res.status(201).json({ code, url });
  } catch (err) {
    console.error("createLink error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ------------------- GET ALL -------------------
export const getAllLinks = async (req, res) => {
  try {
    const r = await db.query(`
      SELECT code, url, clicks, last_clicked 
      FROM links 
      ORDER BY last_clicked DESC NULLS LAST
    `);

    return res.json(r.rows);
  } catch (err) {
    console.error("getAllLinks error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};


// ------------------- GET ONE / STATS -------------------
export const getLink = async (req, res) => {
  try {
    const { code } = req.params;
    const r = await db.query("SELECT * FROM links WHERE code=$1", [code]);
    if (r.rowCount === 0)
      return res.status(404).json({ error: "Not Found" });

    return res.json(r.rows[0]);
  } catch (err) {
    console.error("getLink error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ------------------- DELETE -------------------
export const deleteLink = async (req, res) => {
  try {
    const { code } = req.params;
    await db.query("DELETE FROM links WHERE code=$1", [code]);
    return res.json({ success: true });
  } catch (e) {
    console.error("deleteLink error:", e);
    return res.status(500).json({ error: "Server error" });
  }
};

