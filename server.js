const express = require("express");
const app = express();

let keys = {};

// 🔑 Generate random key
function generateKey() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let key = "TPHUB-";
    for (let i = 0; i < 6; i++) {
        key += chars[Math.floor(Math.random() * chars.length)];
    }
    return key;
}

// 📥 GET KEY (LootLabs sends user here)
app.get("/getkey", (req, res) => {
    const key = generateKey();

    keys[key] = {
        used: false,
        created: Date.now()
    };

    res.send("Your Key: " + key);
});

// ✅ VERIFY KEY (Roblox checks here)
app.get("/verify", (req, res) => {
    const key = req.query.key;

    if (keys[key] && !keys[key].used) {
        keys[key].used = true;
        res.send("valid");
    } else {
        res.send("invalid");
    }
});

app.listen(3000, () => console.log("Server running"));
