const API_BASE_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");

if (!token) {
  alert("Please login first");
  window.location.href = "index.html";
}

let expenses = [];
let categoryChart = null;
let dailyChart = null;

// DOM elements
const logoutBtn = document.getElementById("logoutBtn");
const monthPicker = document.getElementById("monthPicker");

const selectedMonthTotal = document.getElementById("selectedMonthTotal");
const totalTransactions = document.getElementById("totalTransactions");
const highestCategory = document.getElementById("highestCategory");

const categoryBarChart = document.getElementById("categoryBarChart");
const dailyLineChart = document.getElementById("dailyLineChart");

const topCategoriesList = document.getElementById("topCategoriesList");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });
}

// Set current month by default
function setCurrentMonth() {
  if (!monthPicker) return;

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  monthPicker.value = `${year}-${month}`;
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
      alert(data.message || "Failed to load reports");
      return;
    }

    expenses = data.expenses || [];

    updateReports();
  } catch (error) {
    console.error(error);
    alert("Server error while loading reports");
  }
}

// Get selected month expenses
function getSelectedMonthExpenses() {
  if (!monthPicker || !monthPicker.value) {
    return expenses;
  }

  const selectedMonth = monthPicker.value;

  return expenses.filter((expense) => {
    const expenseMonth = expense.expense_date.split("T")[0].slice(0, 7);
    return expenseMonth === selectedMonth;
  });
}

// Update reports
function updateReports() {
  const monthExpenses = getSelectedMonthExpenses();

  updateSummaryCards(monthExpenses);
  renderCategoryChart(monthExpenses);
  renderDailyChart(monthExpenses);
  renderTopCategories(monthExpenses);
}

// Summary cards
function updateSummaryCards(monthExpenses) {
  const total = monthExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  const categoryTotals = {};

  monthExpenses.forEach((expense) => {
    const category = expense.category_id?.name || "Other";
    categoryTotals[category] =
      (categoryTotals[category] || 0) + Number(expense.amount);
  });

  let topCategoryName = "No data";
  let topAmount = 0;

  Object.keys(categoryTotals).forEach((category) => {
    if (categoryTotals[category] > topAmount) {
      topAmount = categoryTotals[category];
      topCategoryName = category;
    }
  });

  if (selectedMonthTotal) {
    selectedMonthTotal.textContent = `₹${total.toFixed(2)}`;
  }

  if (totalTransactions) {
    totalTransactions.textContent = monthExpenses.length;
  }

  if (highestCategory) {
    highestCategory.textContent = topCategoryName;
  }
}

// Category-wise spending chart
function renderCategoryChart(monthExpenses) {
  if (!categoryBarChart) return;

  const categoryTotals = {};

  monthExpenses.forEach((expense) => {
    const category = expense.category_id?.name || "Other";
    categoryTotals[category] =
      (categoryTotals[category] || 0) + Number(expense.amount);
  });

  if (categoryChart) {
    categoryChart.destroy();
  }

  categoryChart = new Chart(categoryBarChart, {
    type: "bar",
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          label: "Category Spending",
          data: Object.values(categoryTotals)
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Daily spending trend chart
function renderDailyChart(monthExpenses) {
  if (!dailyLineChart) return;

  const dailyTotals = {};

  monthExpenses.forEach((expense) => {
    const date = expense.expense_date.split("T")[0];
    dailyTotals[date] = (dailyTotals[date] || 0) + Number(expense.amount);
  });

  const sortedDates = Object.keys(dailyTotals).sort();

  if (dailyChart) {
    dailyChart.destroy();
  }

  dailyChart = new Chart(dailyLineChart, {
    type: "line",
    data: {
      labels: sortedDates,
      datasets: [
        {
          label: "Daily Spending",
          data: sortedDates.map((date) => dailyTotals[date]),
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Top categories list
function renderTopCategories(monthExpenses) {
  if (!topCategoriesList) return;

  const categoryTotals = {};

  monthExpenses.forEach((expense) => {
    const category = expense.category_id?.name || "Other";
    categoryTotals[category] =
      (categoryTotals[category] || 0) + Number(expense.amount);
  });

  const sortedCategories = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  );

  topCategoriesList.innerHTML = "";

  if (sortedCategories.length === 0) {
    topCategoriesList.innerHTML = "<li>No category data found</li>";
    return;
  }

  sortedCategories.forEach(([category, amount]) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span>${category}</span>
      <strong>₹${Number(amount).toFixed(2)}</strong>
    `;

    topCategoriesList.appendChild(li);
  });
}

// Month change
if (monthPicker) {
  monthPicker.addEventListener("change", updateReports);
}

// Download PDF
if (downloadPdfBtn) {
  downloadPdfBtn.addEventListener("click", () => {
    const monthExpenses = getSelectedMonthExpenses();

    if (monthExpenses.length === 0) {
      alert("No report data to download");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Expense Tracker Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Month: ${monthPicker.value}`, 20, 32);

    let y = 45;

    monthExpenses.forEach((expense, index) => {
      const date = new Date(expense.expense_date).toLocaleDateString("en-IN");
      const category = expense.category_id?.name || "Other";
      const description = expense.description || "-";
      const amount = Number(expense.amount).toFixed(2);

      doc.text(
        `${index + 1}. ${date} | ${category} | ${description} | Rs.${amount}`,
        20,
        y
      );

      y += 8;

      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("expense-report.pdf");
  });
}

// Initial load
setCurrentMonth();
fetchExpenses();