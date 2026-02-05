const incomeForm = document.getElementById("incomeForm");
const incomeList = document.getElementById("incomeList");

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

/* Load income history */
function loadIncome() {
    fetch(`http://localhost:5000/api/income/${userId}`)
        .then(res => res.json())
        .then(data => {
            incomeList.innerHTML = "";

            if (!data || data.length === 0) {
                incomeList.innerHTML = "<li>No income added yet</li>";
                return;
            }

            data.forEach(income => {
                const li = document.createElement("li");
                li.classList.add("history-card");

li.innerHTML = `
    <div>
        ${formatDate(income.income_date)} — ₹${income.amount}
        (${income.source}, ${income.frequency})
    </div>
    <button class="delete-btn" onclick="deleteIncome(${income.id})">
        Delete
    </button>
`;

incomeList.appendChild(li);

            });
        })
        .catch(err => {
            console.error("Failed to load income", err);
        });
}

/* Add new income */
incomeForm.addEventListener("submit", e => {
    e.preventDefault();

    const amount = document.getElementById("amount").value;
    const source = document.getElementById("source").value;
    const date = document.getElementById("date").value;
    const frequency = document.getElementById("frequency").value;

    fetch("http://localhost:5000/api/income/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId,
            amount,
            source,
            date,
            frequency
        })
    })
        .then(res => res.json())
        .then(() => {
            incomeForm.reset();
            loadIncome(); // 🔥 reload history
        })
        .catch(err => {
            console.error("Failed to add income", err);
        });
});

/* Load income on page load */
document.addEventListener("DOMContentLoaded", loadIncome);

/* Back button */
function goBack() {
    window.location.href = "dashboard.html";
}

function deleteIncome(incomeId) {
    if (!confirm("Delete this income?")) return;

    fetch(`http://localhost:5000/api/income/delete/${incomeId}`, {
        method: "DELETE"
    })
        .then(res => res.json())
        .then(() => loadIncome())
        .catch(err => console.error("Failed to delete income", err));
}
