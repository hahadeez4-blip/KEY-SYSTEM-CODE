// server.js
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Use a simple in-memory store for demo; replace with DB for production
let keys = {}; // { "KEY123": timestamp_in_ms }

// Generate random keys
function generateKey(length = 16) {
    return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
}

// ==============================
// Generate key
// ==============================
app.get("/generate", (req, res) => {
    const key = generateKey();
    const now = Date.now();
    keys[key] = now; // store timestamp
    console.log(`[GENERATE] Key: ${key} | Timestamp: ${now}`);
    res.json({ key, expiresInHours: 24 });
});

// ==============================
// Verify key
// ==============================
app.get("/verify", (req, res) => {
    const key = req.query.key;
    if (!key) return res.json({ valid: false });

    const timestamp = keys[key];
    if (!timestamp) return res.json({ valid: false });

    const hoursElapsed = (Date.now() - timestamp) / (1000 * 60 * 60);

    if (hoursElapsed > 24) {
        delete keys[key]; // expire the key
        console.log(`[EXPIRE] Key expired: ${key}`);
        return res.json({ valid: false, expired: true });
    }

    res.json({ valid: true, hoursLeft: (24 - hoursElapsed).toFixed(2) });
});

// ==============================
// Clean up old keys every hour
// ==============================
setInterval(() => {
    const now = Date.now();
    for (const k in keys) {
        if ((now - keys[k]) > 24 * 60 * 60 * 1000) delete keys[k];
    }
}, 60 * 60 * 1000);

app.listen(port, () => console.log(`Key system server running on port ${port}`));
