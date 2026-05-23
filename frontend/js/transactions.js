const API_BASE_URL = "/api";

const token = localStorage.getItem("token");

if (!token) {
  alert("Please login first");
  window.location.href = "index.html";
}

let expenses = [];
let editingExpenseId = null;

// DOM elements
const tableBody = document.getElementById("transactionsTableBody");
const expenseForm = document.getElementById("expenseForm");
const expenseModal = document.getElementById("expenseModal");

const addExpenseBtn = document.getElementById("openAddModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelModalBtn");

const descriptionInput = document.getElementById("expenseDescription");
const amountInput = document.getElementById("expenseAmount");
const categoryInput = document.getElementById("expenseCategory");
const dateInput = document.getElementById("expenseDate");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("filterCategory");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const minAmountInput = document.getElementById("minAmount");
const maxAmountInput = document.getElementById("maxAmount");
const applyFilterBtn = document.getElementById("applyFilterBtn");
const clearFilterBtn = document.getElementById("clearFilterBtn");

const exportCsvBtn = document.getElementById("exportCsvBtn");
const logoutBtn = document.getElementById("logoutBtn");
const modalTitle = document.getElementById("modalTitle");

// Open modal
if (addExpenseBtn) {
  addExpenseBtn.addEventListener("click", () => {
    editingExpenseId = null;
    expenseForm.reset();

    if (modalTitle) {
      modalTitle.textContent = "Add Expense";
    }

    expenseModal.classList.remove("hidden");
  });
}

// Close modal
function closeModal() {
  expenseModal.classList.add("hidden");
  expenseForm.reset();
  editingExpenseId = null;

  if (modalTitle) {
    modalTitle.textContent = "Add Expense";
  }
}

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", closeModal);
}

if (cancelBtn) {
  cancelBtn.addEventListener("click", closeModal);
}

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });
}

// Fetch expenses from MongoDB
async function fetchExpenses() {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message || "Failed to fetch expenses");
      return;
    }

    expenses = data.expenses || [];
    renderExpenses(expenses);
  } catch (error) {
    console.error(error);
    alert("Server error while fetching expenses");
  }
}

// Render expenses table
function renderExpenses(data) {
  tableBody.innerHTML = "";

  if (!data || data.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;">No expenses found</td>
      </tr>
    `;
    return;
  }

  data.forEach((expense) => {
    const categoryName = expense.category_id?.name || "Other";
    const date = new Date(expense.expense_date).toLocaleDateString("en-IN");

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${date}</td>
      <td>${categoryName}</td>
      <td>${expense.description || "-"}</td>
      <td>₹${Number(expense.amount).toFixed(2)}</td>
      <td>
        <button class="edit-btn" onclick="editExpense('${expense._id}')">Edit</button>
        <button class="delete-btn" onclick="deleteExpense('${expense._id}')">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// Add or update expense
if (expenseForm) {
  expenseForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const expenseData = {
      amount: Number(amountInput.value),
      category: categoryInput.value,
      expense_date: dateInput.value,
      description: descriptionInput.value.trim()
    };

    if (
      !expenseData.amount ||
      !expenseData.category ||
      !expenseData.expense_date
    ) {
      alert("Please fill amount, category, and date");
      return;
    }

    try {
      let url = `${API_BASE_URL}/expenses`;
      let method = "POST";

      if (editingExpenseId) {
        url = `${API_BASE_URL}/expenses/${editingExpenseId}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(expenseData)
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message || "Failed to save expense");
        return;
      }

      alert(data.message);
      closeModal();
      fetchExpenses();
    } catch (error) {
      console.error(error);
      alert("Server error while saving expense");
    }
  });
}

// Edit expense
window.editExpense = function (id) {
  const expense = expenses.find((item) => item._id === id);

  if (!expense) return;

  editingExpenseId = id;

  amountInput.value = expense.amount;
  categoryInput.value = expense.category_id?.name || "";
  dateInput.value = expense.expense_date.split("T")[0];
  descriptionInput.value = expense.description || "";

  if (modalTitle) {
    modalTitle.textContent = "Edit Expense";
  }

  expenseModal.classList.remove("hidden");
};

// Delete expense
window.deleteExpense = async function (id) {
  const confirmDelete = confirm("Are you sure you want to delete this expense?");

  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message || "Failed to delete expense");
      return;
    }

    alert(data.message);
    fetchExpenses();
  } catch (error) {
    console.error(error);
    alert("Server error while deleting expense");
  }
};

// Search expenses
if (searchInput) {
  searchInput.addEventListener("input", applyFilters);
}

// Apply filters
if (applyFilterBtn) {
  applyFilterBtn.addEventListener("click", applyFilters);
}

function applyFilters() {
  const searchText = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;
  const minAmount = Number(minAmountInput.value);
  const maxAmount = Number(maxAmountInput.value);

  let filtered = [...expenses];

  if (searchText) {
    filtered = filtered.filter((expense) => {
      const description = (expense.description || "").toLowerCase();
      const category = (expense.category_id?.name || "").toLowerCase();

      return (
        description.includes(searchText) ||
        category.includes(searchText)
      );
    });
  }

  if (selectedCategory) {
    filtered = filtered.filter(
      (expense) => expense.category_id?.name === selectedCategory
    );
  }

  if (startDate) {
    filtered = filtered.filter((expense) => {
      return expense.expense_date.split("T")[0] >= startDate;
    });
  }

  if (endDate) {
    filtered = filtered.filter((expense) => {
      return expense.expense_date.split("T")[0] <= endDate;
    });
  }

  if (minAmount) {
    filtered = filtered.filter(
      (expense) => Number(expense.amount) >= minAmount
    );
  }

  if (maxAmount) {
    filtered = filtered.filter(
      (expense) => Number(expense.amount) <= maxAmount
    );
  }

  renderExpenses(filtered);
}

// Clear filters
if (clearFilterBtn) {
  clearFilterBtn.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "";
    startDateInput.value = "";
    endDateInput.value = "";
    minAmountInput.value = "";
    maxAmountInput.value = "";

    renderExpenses(expenses);
  });
}

// Export CSV
if (exportCsvBtn) {
  exportCsvBtn.addEventListener("click", () => {
    if (expenses.length === 0) {
      alert("No expenses to export");
      return;
    }

    let csv = "Date,Category,Description,Amount\n";

    expenses.forEach((expense) => {
      const date = new Date(expense.expense_date).toLocaleDateString("en-IN");
      const category = expense.category_id?.name || "Other";
      const description = expense.description || "-";
      const amount = Number(expense.amount).toFixed(2);

      csv += `"${date}","${category}","${description}","${amount}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();

    URL.revokeObjectURL(url);
  });
}

// Initial load
fetchExpenses();