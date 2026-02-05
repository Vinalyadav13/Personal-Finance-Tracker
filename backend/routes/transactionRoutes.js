const express = require("express");
const db = require("../db");

const router = express.Router();

/* GET TRANSACTIONS */
router.get("/:userId", (req, res) => {
    const sql = `
        SELECT 'Expense' AS type, amount, expense_date AS date, description
        FROM expenses
        WHERE user_id = ?
        UNION ALL
        SELECT 'Income' AS type, amount, income_date AS date, source AS description
        FROM income
        WHERE user_id = ?
        ORDER BY date DESC
    `;

    db.query(sql, [req.params.userId, req.params.userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching transactions" });
        }
        res.json(results);
    });
});

module.exports = router;
