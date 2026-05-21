// Temporary login protection
const isLoggedIn = localStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true") {
  alert("Please login first");
  window.location.href = "index.html";
}

// Logout
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("isLoggedIn");
  alert("Logged out successfully");
  window.location.href = "index.html";
});

// DOM elements
const profileForm = document.getElementById("profileForm");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileNameError = document.getElementById("profileNameError");
const profileEmailError = document.getElementById("profileEmailError");

const passwordForm = document.getElementById("passwordForm");
const currentPassword = document.getElementById("currentPassword");
const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");

const currentPasswordError = document.getElementById("currentPasswordError");
const newPasswordError = document.getElementById("newPasswordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");

const categoryInput = document.getElementById("categoryInput");
const addCategoryBtn = document.getElementById("addCategoryBtn");
const categoryList = document.getElementById("categoryList");

const deleteAccountBtn = document.getElementById("deleteAccountBtn");

// Temporary default profile data
profileName.value = "Demo User";
profileEmail.value = "demo@example.com";

// Temporary categories
let categories = [
  "Food",
  "Transport",
  "Shopping",
  "Utilities",
  "Entertainment"
];

// Render categories
function renderCategories() {
  categoryList.innerHTML = "";

  if (categories.length === 0) {
    categoryList.innerHTML = "<li>No categories available</li>";
    return;
  }

  categories.forEach((category, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span class="category-name">${category}</span>
      <button class="remove-category-btn" onclick="removeCategory(${index})">
        Remove
      </button>
    `;

    categoryList.appendChild(li);
  });
}

// Profile update
profileForm.addEventListener("submit", (event) => {
  event.preventDefault();

  profileNameError.textContent = "";
  profileEmailError.textContent = "";

  const name = profileName.value.trim();
  const email = profileEmail.value.trim();

  let isValid = true;

  if (name === "") {
    profileNameError.textContent = "Name is required";
    isValid = false;
  }

  if (email === "") {
    profileEmailError.textContent = "Email is required";
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  alert("Profile updated successfully!");
});

// Password change
passwordForm.addEventListener("submit", (event) => {
  event.preventDefault();

  currentPasswordError.textContent = "";
  newPasswordError.textContent = "";
  confirmPasswordError.textContent = "";

  const current = currentPassword.value.trim();
  const newPass = newPassword.value.trim();
  const confirmPass = confirmPassword.value.trim();

  let isValid = true;

  if (current === "") {
    currentPasswordError.textContent = "Current password is required";
    isValid = false;
  }

  if (newPass === "") {
    newPasswordError.textContent = "New password is required";
    isValid = false;
  } else if (newPass.length < 8) {
    newPasswordError.textContent = "Password must be at least 8 characters";
    isValid = false;
  }

  if (confirmPass === "") {
    confirmPasswordError.textContent = "Please confirm your new password";
    isValid = false;
  } else if (newPass !== confirmPass) {
    confirmPasswordError.textContent = "Passwords do not match";
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  alert("Password updated successfully!");
  passwordForm.reset();
});

// Add category
addCategoryBtn.addEventListener("click", () => {
  const categoryName = categoryInput.value.trim();

  if (categoryName === "") {
    alert("Please enter category name");
    return;
  }

  const alreadyExists = categories.some(
    (category) => category.toLowerCase() === categoryName.toLowerCase()
  );

  if (alreadyExists) {
    alert("Category already exists");
    return;
  }

  categories.push(categoryName);
  categoryInput.value = "";

  renderCategories();

  alert("Category added successfully!");
});

// Remove category
function removeCategory(index) {
  const confirmRemove = confirm("Are you sure you want to remove this category?");

  if (!confirmRemove) {
    return;
  }

  categories.splice(index, 1);
  renderCategories();

  alert("Category removed successfully!");
}

// Delete account
deleteAccountBtn.addEventListener("click", () => {
  const confirmDelete = confirm(
    "Are you sure you want to delete your account? This action cannot be undone."
  );

  if (!confirmDelete) {
    return;
  }

  localStorage.removeItem("isLoggedIn");

  alert("Account deleted successfully!");
  window.location.href = "index.html";
});

// Initial load
renderCategories();