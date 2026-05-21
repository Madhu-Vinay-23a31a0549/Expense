// Get tab buttons
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

// Get forms
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// Switch to Login form
loginTab.addEventListener("click", () => {
  loginTab.classList.add("active");
  registerTab.classList.remove("active");

  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
});

// Switch to Register form
registerTab.addEventListener("click", () => {
  registerTab.classList.add("active");
  loginTab.classList.remove("active");

  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
});

// Login form submit
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const emailError = document.getElementById("loginEmailError");
  const passwordError = document.getElementById("loginPasswordError");

  emailError.textContent = "";
  passwordError.textContent = "";

  let isValid = true;

  if (email === "") {
    emailError.textContent = "Email is required";
    isValid = false;
  }

  if (password === "") {
    passwordError.textContent = "Password is required";
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  // Temporary login check
  // Later we replace this with backend API call
  localStorage.setItem("isLoggedIn", "true");

  alert("Login successful!");

  window.location.href = "dashboard.html";
});

// Register form submit
registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value.trim();

  const nameError = document.getElementById("registerNameError");
  const emailError = document.getElementById("registerEmailError");
  const passwordError = document.getElementById("registerPasswordError");

  nameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";

  let isValid = true;

  if (name === "") {
    nameError.textContent = "Full name is required";
    isValid = false;
  }

  if (email === "") {
    emailError.textContent = "Email is required";
    isValid = false;
  }

  if (password === "") {
    passwordError.textContent = "Password is required";
    isValid = false;
  } else if (password.length < 8) {
    passwordError.textContent = "Password must be at least 8 characters";
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  alert("Registration successful! Please login now.");

  // After register, show login form
  loginTab.click();

  // Clear register form
  registerForm.reset();
});