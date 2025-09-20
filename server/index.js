// server/index.js
import express from "express";
import cors from "cors";
import multer from "multer";
import vision from "@google-cloud/vision";

const app = express();
app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });
const client = new vision.ImageAnnotatorClient();

/** --- very simple text parsers (works for common receipts) --- */
function parseDate(text) {
  // 2025-09-15 or 09/15/2025 or 15-09-2025
  const m =
    text.match(/\b(20\d{2})[-/](\d{1,2})[-/](\d{1,2})\b/) ||
    text.match(/\b(\d{1,2})[-/](\d{1,2})[-/](20\d{2})\b/);
  if (!m) return null;
  // normalize to YYYY-MM-DD
  if (m[1].length === 4) {
    const [_, y, mm, dd] = m;
    return `${y}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
  } else {
    const [_, mm, dd, y] = m;
    return `${y}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
  }
}

function parseMoney(label, text) {
  const r = new RegExp(`${label}\\s*[:]?\\s*\\$?\\s*([0-9]+(?:\\.[0-9]{2})?)`, "i");
  const m = text.match(r);
  return m ? Number(m[1]) : null;
}

function parseTotal(text) {
  // try TOTAL first, then balance / amount due fallback
  return (
    parseMoney("TOTAL", text) ??
    parseMoney("Amount Due", text) ??
    parseMoney("Balance", text)
  );
}

function parseSubtotal(text) {
  return parseMoney("Subtotal", text);
}
function parseTax(text) {
  return parseMoney("Tax", text);
}

function guessMerchant(text) {
  // first non-empty line that isn't an order/store header
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  for (const l of lines) {
    if (/order|store|receipt|number|transaction/i.test(l)) continue;
    if (l.length < 3) continue;
    return l;
  }
  return "Unknown Merchant";
}

function parseLineItems(text) {
  // stupid-simple: lines like "Item Name .... $12.34"
  const items = [];
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/(.+?)\s+\$([0-9]+(?:\.[0-9]{2})?)/);
    if (m) {
      const name = m[1].trim();
      const amount = Number(m[2]);
      items.push({ name, amount });
    }
  }
  return items;
}

/**
 * Convert parsed fields to your normalized transaction JSON shape.
 * NOTE: You can tweak category logic / ids as you like.
 */
function toNormalizedJSON({ text, merchant, date, total }) {
  const now = new Date().toISOString();
  return {
    id: Math.floor(Math.random() * 1000000),
    user_id: 1,
    plaid_item_id: null,
    external_id: `ocr-${crypto.randomUUID?.() || Date.now()}`,
    account_id: "GreenBucks Demo Account",
    date: date || new Date().toISOString().slice(0, 10),
    name: merchant,
    merchant_name: merchant,
    amount: total != null ? total.toFixed(2) : null,
    iso_currency_code: "USD",
    category: ["Shopping", "General"],
    location: { country: "USA" },
    created_at: now,
    updated_at: now,
    // raw text included for reference/debug
    _raw_text: text
  };
}

app.post("/ocr", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file" });

    const [result] = await client.textDetection(req.file.buffer);
    const detections = result.textAnnotations;
    const text = detections?.[0]?.description || "";

    // --- parse common fields ---
    const merchant = guessMerchant(text);
    const date = parseDate(text);
    const subtotal = parseSubtotal(text);
    const tax = parseTax(text);
    const total = parseTotal(text);
    const items = parseLineItems(text);

    const normalized = toNormalizedJSON({ text, merchant, date, total });

    res.json({
      text,
      parsed: { merchant, date, subtotal, tax, total, items },
      normalized, // <= your target JSON shape
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err?.message || "OCR failed" });
  }
});

app.listen(8787, () =>
  console.log("Server running on http://localhost:8787")
);
