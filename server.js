// server.js
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS so Roblox can request your server
app.use(cors());
app.use(express.json());

// In-memory key storage (for demo purposes)
// Use a database in production (e.g., MongoDB, Firebase)
let keys = {}; // { "KEY123": timestamp_in_ms }

// ==============================
// Generate a new key
// ==============================
app.get("/generate", (req, res) => {
    const key = Math.random().toString(36).substring(2, 16).toUpperCase(); // 14-character key
    const now = Date.now();
    keys[key] = now; // store creation timestamp
    console.log(`Generated key: ${key}`);
    res.json({ key: key, expiresInHours: 24 });
});

// ==============================
// Verify a key
// ==============================
app.get("/verify", (req, res) => {
    const key = req.query.key;
    if (!key || !keys[key]) return res.json({ valid: false });

    const now = Date.now();
    const timestamp = keys[key];
    const hoursElapsed = (now - timestamp) / (1000 * 60 * 60);

    if (hoursElapsed > 24) {
        delete keys[key]; // key expired
        return res.json({ valid: false });
    }

    res.json({ valid: true });
});

// ==============================
// Start the server
// ==============================
app.listen(port, () => {
    console.log(`Key system server running on port ${port}`);
});
