const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// 🔑 YOUR KEYS DATABASE
const keys = {
    "Test": {
        premium: true
    }
};

// ROOT (FOR TEST)
app.get("/", (req, res) => {
    res.send("Server is running");
});

// VERIFY KEY
app.get("/verify", (req, res) => {
    const key = req.query.key;

    res.setHeader("Content-Type", "application/json");

    if (!key) {
        return res.end(JSON.stringify({
            valid: false,
            error: "No key provided"
        }));
    }

    if (keys[key]) {
        return res.end(JSON.stringify({
            valid: true,
            premium: true
        }));
    } else {
        return res.end(JSON.stringify({
            valid: false
        }));
    }
});

// START SERVER
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
