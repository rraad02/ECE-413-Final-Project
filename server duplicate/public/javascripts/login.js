document.getElementById("btnLogIn").addEventListener("click", async function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Validate input
    if (!email || !password) {
        alert("Please fill out all fields.");
        return;
    }

    try {
        // Make API call
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.token;

            // Store token in localStorage
            localStorage.setItem("authToken", token);

            alert("Login successful!");
            // Redirect to another page (e.g., dashboard)
            window.location.href = "/dashboard.html";
        } else {
            const error = await response.json();
            alert(`Login failed: ${error.message}`);
        }
    } catch (err) {
        console.error("Error during login:", err);
        alert("An error occurred. Please try again later.");
    }
});