
document.getElementById("btnSignUp").addEventListener("click", async function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Validate input
    if (!email || !password) {
        alert("Please fill out all fields.");
        return;
    }

    try {
        // Make API call
        const response = await fetch("/api/signup", {
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

            alert("Signup successful!");
            // Redirect to login or dashboard page
            window.location.href = "/login.html"; // Or your desired page
        } else {
            const error = await response.json();
            alert(`Signup failed: ${error.message}`);
        }
    } catch (err) {
        console.error("Error during signup:", err);
        alert("An error occurred. Please try again later.");
    }
});