const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");

const router = express.Router();

/* REGISTER USER */
router.post("/register", async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (full_name, email, password_hash)
            VALUES (?, ?, ?)
        `;

        db.query(sql, [fullName, email, hashedPassword], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "User already exists" });
            }

            res.json({ message: "Registration successful" });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
/* LOGIN USER */
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.json({
            message: "Login successful",
            userId: user.id,
            name: user.full_name
        });
    });
});

module.exports = router;
