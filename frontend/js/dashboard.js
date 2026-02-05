document.addEventListener("DOMContentLoaded", () => {
    const userName = localStorage.getItem("userName");

    if (!userName) {
        // Not logged in
        window.location.href = "login.html";
        return;
    }

    document.getElementById("welcomeText").innerText =
        `Welcome, ${userName}`;
});

function goTo(page) {
    window.location.href = page;
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}
