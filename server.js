// server.js
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Example key storage (in memory, use a DB for production)
let validKeys = [
    { key: "abc123", expires: Date.now() + 24 * 60 * 60 * 1000 }, // 24h
];

app.get("/verify", (req, res) => {
    const key = req.query.key;
    if (!key) return res.json({ valid: false, message: "No key provided" });

    const record = validKeys.find(k => k.key === key);
    if (record && record.expires > Date.now()) {
        return res.json({ valid: true });
    } else {
        return res.json({ valid: false });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
