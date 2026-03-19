// server.js
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// In-memory key store: key => { created: timestamp, expires: timestamp }
const keyStore = {};

// Helper to generate random string
function generateRandomKey(length = 10) {
    return crypto.randomBytes(length).toString("hex");
}

// Middleware to clean expired keys every hour
setInterval(() => {
    const now = Date.now();
    for (const key in keyStore) {
        if (keyStore[key].expires <= now) {
            delete keyStore[key];
        }
    }
}, 60 * 60 * 1000); // every hour

// Generate a new key
app.get("/getkey", (req, res) => {
    const key = generateRandomKey(8); // 16 hex chars
    const now = Date.now();
    const expires = now + 24 * 60 * 60 * 1000; // 24 hours

    keyStore[key] = { created: now, expires };
    console.log(`Generated key: ${key} (expires in 24h)`);

    res.json({ key });
});

// Optional endpoint to validate key (if needed)
app.get("/validate/:key", (req, res) => {
    const { key } = req.params;
    const entry = keyStore[key];

    if (!entry) {
        return res.status(404).json({ valid: false, message: "Key not found or expired" });
    }

    const now = Date.now();
    if (entry.expires <= now) {
        delete keyStore[key];
        return res.status(404).json({ valid: false, message: "Key expired" });
    }

    res.json({ valid: true, expires: entry.expires });
});

// Start server
app.listen(PORT, () => {
    console.log(`Key system server running on port ${PORT}`);
});
