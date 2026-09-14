const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const loginMessage = document.getElementById("loginMessage");

emailInput.addEventListener("input", () => {

    emailInput.value = emailInput.value.toLowerCase();

    const email = emailInput.value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
        emailError.textContent = "Email is required";
        emailError.style.color = "red";
    }
    else if (!emailPattern.test(email)) {
        emailError.textContent = "Enter a valid email address";
        emailError.style.color = "red";
    }
    else {
        emailError.textContent = "";
        emailError.style.color = "green";
    }

});
passwordInput.addEventListener("input", () => {

    const password = passwordInput.value;

    if (password === "") {
        passwordError.textContent = "";
    }
    else if (password.length < 8) {
        passwordError.textContent =
            "Password must be at least 8 characters";
        passwordError.style.color = "red";
    }
    else {
        passwordError.textContent = "";
    }

});

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    
    if (!email) {
        emailError.textContent = "Email is required";
        emailError.style.color = "red";
        return;
    }

    if (email.length > 25) {
        emailError.textContent = "Email must not exceed 25 characters";
        emailError.style.color = "red";
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        emailError.textContent = "Please enter a valid email address";
        emailError.style.color = "red";
        return;
    }

    
    if (!password) {
        passwordError.textContent = "Password is required";
        passwordError.style.color = "red";
        return;
    }

    if (password.length > 15) {
        passwordError.textContent =
            "Password must not exceed 15 characters";
        passwordError.style.color = "red";
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            loginMessage.textContent = "Login Successful";
            loginMessage.style.color = "green";

            localStorage.setItem("token", data.token);

            setTimeout(() => {
                window.location.href = "todo.html";
            }, 1000);

        }
        else {

            loginMessage.textContent = data.message;
            loginMessage.style.color = "red";

        }

    }
    catch (error) {

        console.log(error);

        loginMessage.textContent =
            "Unable to connect to server";

        loginMessage.style.color = "red";
    }

});