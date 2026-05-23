const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user) {
  alert("Please login first");
  window.location.href = "index.html";
}

// Logout
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    alert("Logged out successfully");
    window.location.href = "index.html";
  });
}

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

// Real logged-in user data
if (profileName) {
  profileName.value = user.name || "";
}

if (profileEmail) {
  profileEmail.value = user.email || "";
}

// Empty categories first, no demo data
let categories = [];

// Render categories
function renderCategories() {
  if (!categoryList) return;

  categoryList.innerHTML = "";

  if (categories.length === 0) {
    categoryList.innerHTML = "<li>No categories added yet</li>";
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
if (profileForm) {
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

    if (!isValid) return;

    const updatedUser = {
      ...user,
      name,
      email
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    alert("Profile updated locally");
  });
}

// Password change
if (passwordForm) {
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

    if (!isValid) return;

    alert("Password update backend will be added later");
    passwordForm.reset();
  });
}

// Add category locally
if (addCategoryBtn) {
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

    alert("Category added locally");
  });
}

// Remove category
window.removeCategory = function (index) {
  const confirmRemove = confirm("Are you sure you want to remove this category?");

  if (!confirmRemove) return;

  categories.splice(index, 1);
  renderCategories();

  alert("Category removed");
};

// Delete account
if (deleteAccountBtn) {
  deleteAccountBtn.addEventListener("click", () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmDelete) return;

    localStorage.clear();

    alert("Account deleted locally");
    window.location.href = "index.html";
  });
}

// Initial load
renderCategories();