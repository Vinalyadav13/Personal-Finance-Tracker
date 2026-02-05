const express = require("express");
const db = require("../db");

const router = express.Router();

/* ADD INCOME */
router.post("/add", (req, res) => {
    const { userId, source, amount, date, frequency } = req.body;

    const sql = `
        INSERT INTO income (user_id, source, amount, income_date, frequency)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [userId, source, amount, date, frequency], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to add income" });
        }
        res.json({ message: "Income added" });
    });
});

/* GET INCOME */
router.get("/:userId", (req, res) => {
    const sql = `
        SELECT 
    i.id,
    i.amount,
    i.source,
    i.frequency,
    i.income_date
FROM income i
WHERE i.user_id = ?
ORDER BY i.income_date DESC

    `;

    db.query(sql, [req.params.userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching income" });
        }
        res.json(results);
    });
});

router.delete("/delete/:id", (req, res) => {
    console.log("DELETE INCOME ID:", req.params.id);

    const sql = "DELETE FROM income WHERE id = ?";

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("INCOME DELETE ERROR:", err);
            return res.status(500).json(err);
        }

        console.log("INCOME AFFECTED ROWS:", result.affectedRows);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Income not found" });
        }

        res.json({ message: "Income deleted" });
    });
});

module.exports = router;
