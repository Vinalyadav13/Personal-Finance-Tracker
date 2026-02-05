document.addEventListener("DOMContentLoaded", () => {
    console.log("auth.js loaded and DOM ready");

    const registerForm = document.getElementById("registerForm");

    if (!registerForm) {
        console.error("Register form not found");
        return;
    }

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!fullName || !email || !password) {
            alert("All fields are required");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ fullName, email, password })
            });

            const data = await response.json();
            alert(data.message);

            if (response.ok) {
                registerForm.reset();
            }

        } catch (error) {
            console.error(error);
            alert("Unable to connect to server");
        }
    });
});
/* LOGIN */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            alert(data.message);

            if (response.ok) {
                localStorage.setItem("userId", data.userId);
                localStorage.setItem("userName", data.name);
                window.location.href = "dashboard.html";
            }

        } catch (error) {
            alert("Login failed");
        }
    });
}
