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

// Temporary sample expense data
// Later this will come from MySQL using backend API
let expenses = [
  {
    id: 1,
    date: "2026-05-01",
    category: "Food",
    description: "Lunch",
    amount: 250
  },
  {
    id: 2,
    date: "2026-05-03",
    category: "Transport",
    description: "Bus pass",
    amount: 500
  },
  {
    id: 3,
    date: "2026-05-05",
    category: "Shopping",
    description: "Shoes",
    amount: 1200
  },
  {
    id: 4,
    date: "2026-05-07",
    category: "Food",
    description: "Dinner",
    amount: 350
  },
  {
    id: 5,
    date: "2026-04-15",
    category: "Utilities",
    description: "Mobile recharge",
    amount: 299
  }
];

let filteredExpenses = [...expenses];

// DOM elements
const tableBody = document.getElementById("transactionsTableBody");

const openAddModalBtn = document.getElementById("openAddModalBtn");
const expenseModal = document.getElementById("expenseModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");

const expenseForm = document.getElementById("expenseForm");
const modalTitle = document.getElementById("modalTitle");

const expenseId = document.getElementById("expenseId");
const expenseAmount = document.getElementById("expenseAmount");
const expenseCategory = document.getElementById("expenseCategory");
const expenseDate = document.getElementById("expenseDate");
const expenseDescription = document.getElementById("expenseDescription");

const searchInput = document.getElementById("searchInput");

const filterCategory = document.getElementById("filterCategory");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");
const minAmount = document.getElementById("minAmount");
const maxAmount = document.getElementById("maxAmount");

const applyFilterBtn = document.getElementById("applyFilterBtn");
const clearFilterBtn = document.getElementById("clearFilterBtn");
const exportCsvBtn = document.getElementById("exportCsvBtn");

// Error elements
const amountError = document.getElementById("amountError");
const categoryError = document.getElementById("categoryError");
const dateError = document.getElementById("dateError");
const descriptionError = document.getElementById("descriptionError");

// Format currency
function formatCurrency(amount) {
  return "₹" + Number(amount).toFixed(2);
}

// Show expenses in table
function renderTable(data) {
  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5">No expenses found</td>
      </tr>
    `;
    return;
  }

  data.forEach((expense) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${expense.date}</td>
      <td>${expense.category}</td>
      <td>${expense.description || "-"}</td>
      <td>${formatCurrency(expense.amount)}</td>
      <td>
        <button class="action-btn edit-btn" onclick="editExpense(${expense.id})">
          Edit
        </button>
        <button class="action-btn delete-btn" onclick="deleteExpense(${expense.id})">
          Delete
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// Open add modal
openAddModalBtn.addEventListener("click", () => {
  modalTitle.textContent = "Add Expense";
  expenseForm.reset();
  expenseId.value = "";
  clearErrors();
  expenseModal.classList.remove("hidden");
});

// Close modal
function closeModal() {
  expenseModal.classList.add("hidden");
  expenseForm.reset();
  clearErrors();
}

closeModalBtn.addEventListener("click", closeModal);
cancelModalBtn.addEventListener("click", closeModal);

// Clear validation errors
function clearErrors() {
  amountError.textContent = "";
  categoryError.textContent = "";
  dateError.textContent = "";
  descriptionError.textContent = "";
}

// Add or update expense
expenseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  clearErrors();

  const id = expenseId.value;
  const amount = Number(expenseAmount.value);
  const category = expenseCategory.value;
  const date = expenseDate.value;
  const description = expenseDescription.value.trim();

  let isValid = true;

  if (!amount || amount <= 0) {
    amountError.textContent = "Amount must be greater than 0";
    isValid = false;
  }

  if (category === "") {
    categoryError.textContent = "Please select a category";
    isValid = false;
  }

  if (date === "") {
    dateError.textContent = "Date is required";
    isValid = false;
  }

  if (description.length > 500) {
    descriptionError.textContent = "Description cannot exceed 500 characters";
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  // Edit existing expense
  if (id) {
    expenses = expenses.map((expense) => {
      if (expense.id === Number(id)) {
        return {
          ...expense,
          amount,
          category,
          date,
          description
        };
      }

      return expense;
    });

    alert("Expense updated successfully!");
  } 
  
  // Add new expense
  else {
    const newExpense = {
      id: Date.now(),
      amount,
      category,
      date,
      description
    };

    expenses.push(newExpense);

    alert("Expense added successfully!");
  }

  filteredExpenses = [...expenses];
  renderTable(filteredExpenses);
  closeModal();
});

// Edit expense
function editExpense(id) {
  const expense = expenses.find((item) => item.id === id);

  if (!expense) {
    alert("Expense not found");
    return;
  }

  modalTitle.textContent = "Edit Expense";

  expenseId.value = expense.id;
  expenseAmount.value = expense.amount;
  expenseCategory.value = expense.category;
  expenseDate.value = expense.date;
  expenseDescription.value = expense.description;

  clearErrors();
  expenseModal.classList.remove("hidden");
}

// Delete expense
function deleteExpense(id) {
  const confirmDelete = confirm("Are you sure you want to delete this expense?");

  if (!confirmDelete) {
    return;
  }

  expenses = expenses.filter((expense) => expense.id !== id);
  filteredExpenses = filteredExpenses.filter((expense) => expense.id !== id);

  renderTable(filteredExpenses);

  alert("Expense deleted successfully!");
}

// Search by description
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase().trim();

  filteredExpenses = expenses.filter((expense) =>
    expense.description.toLowerCase().includes(keyword)
  );

  renderTable(filteredExpenses);
});

// Apply filters
applyFilterBtn.addEventListener("click", () => {
  const selectedCategory = filterCategory.value;
  const selectedStartDate = startDate.value;
  const selectedEndDate = endDate.value;
  const selectedMinAmount = Number(minAmount.value);
  const selectedMaxAmount = Number(maxAmount.value);

  filteredExpenses = expenses.filter((expense) => {
    const matchesCategory =
      selectedCategory === "" || expense.category === selectedCategory;

    const matchesStartDate =
      selectedStartDate === "" || expense.date >= selectedStartDate;

    const matchesEndDate =
      selectedEndDate === "" || expense.date <= selectedEndDate;

    const matchesMinAmount =
      minAmount.value === "" || expense.amount >= selectedMinAmount;

    const matchesMaxAmount =
      maxAmount.value === "" || expense.amount <= selectedMaxAmount;

    return (
      matchesCategory &&
      matchesStartDate &&
      matchesEndDate &&
      matchesMinAmount &&
      matchesMaxAmount
    );
  });

  renderTable(filteredExpenses);
});

// Clear filters
clearFilterBtn.addEventListener("click", () => {
  filterCategory.value = "";
  startDate.value = "";
  endDate.value = "";
  minAmount.value = "";
  maxAmount.value = "";
  searchInput.value = "";

  filteredExpenses = [...expenses];

  renderTable(filteredExpenses);
});

// Export CSV
exportCsvBtn.addEventListener("click", () => {
  if (filteredExpenses.length === 0) {
    alert("No expenses to export");
    return;
  }

  let csvContent = "ID,Date,Category,Amount,Description\n";

  filteredExpenses.forEach((expense) => {
    csvContent += `${expense.id},${expense.date},${expense.category},${expense.amount},"${expense.description}"\n`;
  });

  const blob = new Blob([csvContent], {
    type: "text/csv"
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "expenses.csv";

  link.click();

  URL.revokeObjectURL(url);
});

// Initial table load
renderTable(filteredExpenses);