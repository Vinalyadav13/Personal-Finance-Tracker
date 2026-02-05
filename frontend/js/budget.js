const budgetForm = document.getElementById("budgetForm");
const budgetList = document.getElementById("budgetList");

const userId = localStorage.getItem("userId");

/* Load budget status */
function loadBudget() {
    fetch(`http://localhost:5000/api/budget/${userId}`)
        .then(res => res.json())
        .then(data => {
            budgetList.innerHTML = "";

            if (!data || data.length === 0) {
                budgetList.innerHTML = "<li>No budget set yet</li>";
                return;
            }

            data.forEach(budget => {
                console.log("Budget row:", budget);
                const percentUsed =
                    budget.budget_amount > 0
                        ? ((budget.spent / budget.budget_amount) * 100).toFixed(1)
                        : 0;

                const li = document.createElement("li");
li.classList.add("budget-card");

li.innerHTML = `
    <div>
        <strong>${budget.category_name}</strong><br>
        Budget: ₹${budget.budget_amount} |
        Spent: ₹${budget.spent} |
        ${percentUsed}% used
    </div>
    <button class="delete-btn" onclick="deleteBudget(${budget.id})">
        Delete
    </button>
`;

budgetList.appendChild(li);

            });
        })
        .catch(err => {
            console.error("Failed to load budget", err);
        });
}

/* Set budget */
budgetForm.addEventListener("submit", e => {
    e.preventDefault();

    const category = document.getElementById("category").value;
    const amount = document.getElementById("budgetAmount").value;
    const month = document.getElementById("month").value;

    fetch("http://localhost:5000/api/budget/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId,
            category,
            amount,
            month
        })
    })
        .then(res => res.json())
        .then(() => {
            budgetForm.reset();
            loadBudget(); // 🔥 reload budget status
        })
        .catch(err => {
            console.error("Failed to set budget", err);
        });
});

/* Load budget on page load */
document.addEventListener("DOMContentLoaded", loadBudget);

/* Back button */
function goBack() {
    window.location.href = "dashboard.html";
}

function deleteBudget(budgetId) {
    if (!confirm("Delete this budget?")) return;

    fetch(`http://localhost:5000/api/budget/delete/${budgetId}`, {
        method: "DELETE"
    })
        .then(res => res.json())
        .then(() => loadBudget())
        .catch(err => console.error("Delete failed", err));
}
