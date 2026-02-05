const express = require("express");
const db = require("../db");

const router = express.Router();

/* ADD EXPENSE */
router.post("/add", (req, res) => {
    const { userId, amount, category, date, description } = req.body;

    // 1️⃣ Find existing category
    const findCategorySql =
        "SELECT id FROM categories WHERE user_id = ? AND category_name = ?";

    db.query(findCategorySql, [userId, category], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.length > 0) {
            // Category exists → use it
            insertExpense(result[0].id);
        } else {
            // Create category
            const insertCategorySql =
                "INSERT INTO categories (user_id, category_name) VALUES (?, ?)";

            db.query(insertCategorySql, [userId, category], (err, catResult) => {
                if (err) return res.status(500).json(err);
                insertExpense(catResult.insertId);
            });
        }
    });

    function insertExpense(categoryId) {
        const insertExpenseSql = `
            INSERT INTO expenses (user_id, category_id, amount, expense_date, description)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
            insertExpenseSql,
            [userId, categoryId, amount, date, description],
            err => {
                if (err) return res.status(500).json(err);
                res.json({ message: "Expense added" });
            }
        );
    }
});


/* GET EXPENSES */
router.get("/:userId", (req, res) => {
    const sql = `
        SELECT 
    e.id,
    e.amount,
    e.description,
    e.expense_date
FROM expenses e
WHERE e.user_id = ?
ORDER BY e.expense_date DESC

    `;

    db.query(sql, [req.params.userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching expenses" });
        }
        res.json(results);
    });
});

router.delete("/delete/:id", (req, res) => {
    console.log("DELETE EXPENSE ID:", req.params.id);

    const sql = "DELETE FROM expenses WHERE id = ?";

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("EXPENSE DELETE ERROR:", err);
            return res.status(500).json(err);
        }

        console.log("EXPENSE AFFECTED ROWS:", result.affectedRows);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.json({ message: "Expense deleted" });
    });
});


module.exports = router;
