const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// In-memory store for keys
// keyId => { key: "xxxx", expires: timestamp }
const keyStore = {};

// Generate random key
function generateRandomKey(length = 16) {
    return crypto.randomBytes(length).toString("hex");
}

// Generate key endpoint (LootLink redirect hits this)
app.get("/s/:lootId", (req, res) => {
    const { lootId } = req.params;

    // Optional: validate lootId to prevent random bypass
    if (!lootId || lootId.length < 5) {
        return res.status(400).send("Invalid LootLink ID.");
    }

    // Generate the key
    const key = generateRandomKey(8); // 16 hex chars
    const now = Date.now();
    const expires = now + 24 * 60 * 60 * 1000; // 24 hours

    keyStore[lootId] = { key, expires };
    console.log(`LootLink ${lootId} generated key: ${key}`);

    // Send key to player
    res.json({ key, expires });
});

// Optional: validate key endpoint
app.get("/validate/:lootId", (req, res) => {
    const { lootId } = req.params;
    const entry = keyStore[lootId];

    if (!entry) return res.status(404).json({ valid: false, message: "Key not found" });

    const now = Date.now();
    if (entry.expires <= now) {
        delete keyStore[lootId];
        return res.status(404).json({ valid: false, message: "Key expired" });
    }

    res.json({ valid: true, key: entry.key, expires: entry.expires });
});

// Cleanup expired keys every hour
setInterval(() => {
    const now = Date.now();
    for (const lootId in keyStore) {
        if (keyStore[lootId].expires <= now) delete keyStore[lootId];
    }
}, 60 * 60 * 1000);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
