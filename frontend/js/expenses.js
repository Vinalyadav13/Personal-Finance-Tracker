const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");

const userId = localStorage.getItem("userId");

/* Format date for display */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

/* Load expense history */
function loadExpenses() {
    fetch(`http://localhost:5000/api/expenses/${userId}`)
        .then(res => res.json())
        .then(data => {
            expenseList.innerHTML = "";

            if (!data || data.length === 0) {
                expenseList.innerHTML = "<li>No expenses added yet</li>";
                return;
            }

            data.forEach(expense => {
                const li = document.createElement("li");
               li.classList.add("history-card");

li.innerHTML = `
    <div>
        ${formatDate(expense.expense_date)} — ₹${expense.amount}
        (${expense.description || "No description"})
    </div>
    <button class="delete-btn" onclick="deleteExpense(${expense.id})">
        Delete
    </button>
`;

expenseList.appendChild(li);

            });
        })
        .catch(err => {
            console.error("Failed to load expenses", err);
        });
}

/* Add new expense */
expenseForm.addEventListener("submit", e => {
    e.preventDefault();

    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value;

    fetch("http://localhost:5000/api/expenses/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId,
            amount,
            category,
            date,
            description
        })
    })
        .then(res => res.json())
        .then(() => {
            expenseForm.reset();
            loadExpenses(); // 🔥 reload history
        })
        .catch(err => {
            console.error("Failed to add expense", err);
        });
});

/* Load expenses on page load */
document.addEventListener("DOMContentLoaded", loadExpenses);

/* Back button */
function goBack() {
    window.location.href = "dashboard.html";
}

function deleteExpense(expenseId) {
    if (!confirm("Delete this expense?")) return;

    fetch(`http://localhost:5000/api/expenses/delete/${expenseId}`, {
        method: "DELETE"
    })
        .then(res => res.json())
        .then(() => loadExpenses())
        .catch(err => console.error("Failed to delete expense", err));
}

