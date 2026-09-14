const registerForm = document.getElementById("registerForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const registerMessage = document.getElementById("registerMessage");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

nameInput.addEventListener("input", () => {

    nameInput.value = nameInput.value.replace(/[^A-Za-z]/g, "");

    const name = nameInput.value.trim();

    const namePattern = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;

    if (name === "") {
        nameError.textContent = "";
    }
    else if (!namePattern.test(name)) {
        nameError.textContent = "Name can contain only letters";
    }
    else {
        nameError.textContent = "";
    }

});

emailInput.addEventListener("input", () => {
    emailInput.value = emailInput.value.trim().toLowerCase();
emailInput.value = emailInput.value.replace(/[^a-z0-9@._-]/g, "");
    const email = emailInput.value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
        emailError.textContent = "";
    }
    else if (!emailPattern.test(email)) {
        emailError.textContent =
            "Enter a valid email. Example: name@gmail.com";
    }
    else {
        emailError.textContent = "";
    }

});


passwordInput.addEventListener("input", () => {

    const password = passwordInput.value;

    if (password === "") {
        passwordError.textContent = "";
    }
    else if (password.length < 8) {
        passwordError.textContent =
            "Password must contain at least 8 characters";
            passwordError.style.color = "red";
    }
    else if (!/[A-Z]/.test(password)) {
        passwordError.textContent =
            "Password must contain at least one uppercase letter";
        passwordError.style.color = "red";
    }
    else if (!/[a-z]/.test(password)) {
        passwordError.textContent =
            "Password must contain at least one lowercase letter";
        passwordError.style.color = "red";
    }
    else if (!/[0-9]/.test(password)) {
        passwordError.textContent =
            "Password must contain at least one number";
        passwordError.style.color = "red";
    }
    else if (!/[^A-Za-z0-9]/.test(password)) {
        passwordError.textContent =
            "Password must contain at least one special character";
        passwordError.style.color = "red";
    }
    else {
        passwordError.textContent = "Strong password";
        passwordError.style.color = "green";
    }

});

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;
        if (!name) {
    alert("Name is required");
    return;
}

if (name.length < 2) {
    alert("Name must be at least 2 characters");
    return;
}

if (name.length > 25) {
    alert("Name must not exceed 25 characters");
    return;
}

const namePattern = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;

if (!namePattern.test(name)) {
    alert("Name can contain only letters, spaces, hyphen or apostrophe");
    return;
}

    if (!email.includes("@") || !email.includes(".")) {
        alert("Please enter a valid email");
        return;
    }
    if (!email) {
    alert("Email is required");
    return;
}

if (email.length > 25) {
    alert("Email must not exceed 25 characters");
    return;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(email)) {
    alert("Please enter a valid email address");
    return;
}

   if (password.length < 8) {
    alert("Password must be at least 8 characters");
    return;
}

if (password.length > 15) {
    alert("Password must not exceed 15 characters");
    return;
}

if (!/[A-Z]/.test(password)) {
    alert("Password must contain at least one uppercase letter");
    return;
}

if (!/[a-z]/.test(password)) {
    alert("Password must contain at least one lowercase letter");
    return;
}

if (!/[0-9]/.test(password)) {
    alert("Password must contain at least one number");
    return;
}

if (!/[^A-Za-z0-9]/.test(password)) {
    alert("Password must contain at least one special character");
    return;
}


    if (password !== confirmPassword) {
        registerMessage.textContent = "Passwords do not match";
        registerMessage.style.color = "red";
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:5000/api/auth/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

if (response.ok) {

    registerMessage.textContent = "Registration Successful";
    registerMessage.style.color = "green";

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1000);

} else {

    registerMessage.textContent =
        "Registration Failed: " + data.message;

    registerMessage.style.color = "red";
}

    } catch (error) {
        console.log(error);
        alert("Something went wrong");
    }
});