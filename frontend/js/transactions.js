document.addEventListener("DOMContentLoaded", () => {
    loadTransactions();
});

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function loadTransactions() {
    const userId = localStorage.getItem("userId");

    fetch(`http://localhost:5000/api/transactions/${userId}`)
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById("transactionList");
            list.innerHTML = "";

            data.forEach(tx => {
                const li = document.createElement("li");
                li.innerText =
                    `${formatDate(tx.date)} - ${tx.type} - ₹${tx.amount} (${tx.description})`
                list.appendChild(li);
            });
        });
}

function goBack() {
    window.location.href = "dashboard.html";
}
