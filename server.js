const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// Your valid keys
const keys = {
    "Test": {
        premium: true
    }
};

// VERIFY ENDPOINT
app.get("/verify", (req, res) => {
    const key = req.query.key;

    if (!key) {
        return res.json({ valid: false, error: "No key" });
    }

    if (keys[key]) {
        return res.json({
            valid: true,
            premium: true
        });
    } else {
        return res.json({
            valid: false
        });
    }
});

// ROOT TEST
app.get("/", (req, res) => {
    res.send("Key system running");
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
