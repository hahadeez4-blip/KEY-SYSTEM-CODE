// server.js
const express = require("express");
const crypto = require("crypto");
const app = express();
const PORT = process.env.PORT || 3000;

let tokens = {}; // { token: { expires, used } }

// Generate secure random token
function generateToken(length = 8) {
    return crypto.randomBytes(length).toString("hex");
}

// Endpoint to get a new key
app.get("/getkey", (req, res) => {
    const token = generateToken(6); // short URL token
    const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    tokens[token] = { expires, used: false };

    res.json({
        message: "Key generated!",
        url: `https://yourserver.com/key/${token}`,
        expires: new Date(expires).toISOString()
    });
});

// Endpoint to verify key
app.get("/key/:token", (req, res) => {
    const { token } = req.params;
    const record = tokens[token];

    if (!record) return res.json({ valid: false, message: "Invalid token." });
    if (record.used) return res.json({ valid: false, message: "Token already used." });
    if (record.expires < Date.now()) return res.json({ valid: false, message: "Token expired." });

    record.used = true; // mark as used
    res.json({ valid: true, message: "Key verified!" });
});

// Optional cleanup every hour
setInterval(() => {
    const now = Date.now();
    for (const token in tokens) {
        if (tokens[token].used || tokens[token].expires < now) {
            delete tokens[token];
        }
    }
}, 60 * 60 * 1000);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
