const express = require("express");
const db = require("../db");

const router = express.Router();

/* SET BUDGET */
router.post("/set", (req, res) => {
    const { userId, category, amount, month } = req.body;
    const formattedMonth = month.slice(0, 7); // YYYY-MM


    // 1️⃣ Find category_id
    const categorySql =
        "SELECT id FROM categories WHERE user_id = ? AND category_name = ?";

    db.query(categorySql, [userId, category], (err, catResult) => {
        if (err) return res.status(500).json(err);

        let categoryId;

        if (catResult.length > 0) {
            categoryId = catResult[0].id;
            insertBudget(categoryId);
        } else {
            // create category if not exists
            db.query(
                "INSERT INTO categories (user_id, category_name) VALUES (?, ?)",
                [userId, category],
                (err, result) => {
                    if (err) return res.status(500).json(err);
                    categoryId = result.insertId;
                    insertBudget(categoryId);
                }
            );
        }

        function insertBudget(categoryId) {
            const sql = `
                INSERT INTO budgets (user_id, category_id, budget_month, budget_amount)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE budget_amount = ?
            `;

            db.query(
                sql,
                [userId, categoryId, formattedMonth, amount, amount],
                err => {
                    if (err) return res.status(500).json(err);
                    res.json({ message: "Budget saved" });
                }
            );
        }
    });
});

/* 🔥 GET BUDGET STATUS (THIS WAS MISSING) */
router.get("/:userId", (req, res) => {
    const sql = `
        SELECT 
    b.id,
    c.category_name,
    b.budget_amount,
    IFNULL(SUM(e.amount), 0) AS spent

        FROM budgets b
        JOIN categories c ON b.category_id = c.id
        LEFT JOIN expenses e 
            ON e.category_id = b.category_id 
            AND DATE_FORMAT(e.expense_date, '%Y-%m') = b.budget_month
        WHERE b.user_id = ?
        GROUP BY b.id
    `;

    db.query(sql, [req.params.userId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

/* DELETE BUDGET */
router.delete("/delete/:id", (req, res) => {
    console.log("DELETE BUDGET ID:", req.params.id);

    const sql = "DELETE FROM budgets WHERE id = ?";

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("DELETE ERROR:", err);
            return res.status(500).json(err);
        }

        console.log("AFFECTED ROWS:", result.affectedRows);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Budget not found" });
        }

        res.json({ message: "Budget deleted successfully" });
    });
});

/* DELETE INCOME */
router.delete("/delete/:id", (req, res) => {
    const sql = "DELETE FROM income WHERE id = ?";

    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Income not found" });
        }

        res.json({ message: "Income deleted" });
    });
});


module.exports = router;
