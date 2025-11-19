import { db } from "../db.js";

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
  let result = "";
  for (let i = 0; i < len; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export const createLink = async (req, res) => {
  try {
    const { url, code: customCode } = req.body;

    // Validate URL
    if (!url || !isValidUrl(url)) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    let code = customCode?.trim();

    // If user did NOT enter a custom code → auto-generate
    if (!code) {
      code = generateCode(6);
    }

    // Validate code format
    if (!/^[A-Za-z0-9]{6,8}$/.test(code)) {
      return res.status(400).json({ error: "Code must be 6-8 characters [A-Za-z0-9]" });
    }

    // Check duplicate
    const exists = await db.query("SELECT 1 FROM links WHERE code=$1", [code]);
    if (exists.rowCount > 0) {
      return res.status(409).json({ error: "Short code already exists" });
    }

    // Insert into DB
    await db.query("INSERT INTO links (code, url) VALUES ($1, $2)", [code, url]);

    return res.status(201).json({ code, url });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
