const API_BASE_URL = "http://localhost:5000/api";

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// Tab switching
loginTab.addEventListener("click", () => {
  loginTab.classList.add("active");
  registerTab.classList.remove("active");

  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
});

registerTab.addEventListener("click", () => {
  registerTab.classList.add("active");
  loginTab.classList.remove("active");

  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
});

// Register
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value.trim();

  if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  if (password.length < 8) {
    alert("Password must be at least 8 characters");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message || "Registration failed");
      return;
    }

    alert("Registration successful. Please login now.");
    registerForm.reset();
    loginTab.click();
  } catch (error) {
    console.error(error);
    alert("Server error. Please try again.");
  }
});

// Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("isLoggedIn", "true");

    alert("Login successful");
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error(error);
    alert("Server error. Please try again.");
  }
});