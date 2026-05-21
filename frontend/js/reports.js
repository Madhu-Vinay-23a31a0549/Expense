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

// Temporary sample data
// Later this will come from MySQL using backend API
const expenses = [
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

// DOM elements
const monthPicker = document.getElementById("monthPicker");
const selectedMonthTotal = document.getElementById("selectedMonthTotal");
const totalTransactions = document.getElementById("totalTransactions");
const highestCategory = document.getElementById("highestCategory");
const topCategoriesList = document.getElementById("topCategoriesList");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");

let categoryBarChart;
let dailyLineChart;

// Set current month by default
const today = new Date();
const currentMonth = today.toISOString().slice(0, 7);
monthPicker.value = currentMonth;

// Format currency
function formatCurrency(amount) {
  return "₹" + Number(amount).toFixed(2);
}

// Get expenses for selected month
function getExpensesByMonth(month) {
  return expenses.filter((expense) => expense.date.startsWith(month));
}

// Calculate category totals
function getCategoryTotals(monthExpenses) {
  const categoryTotals = {};

  monthExpenses.forEach((expense) => {
    if (categoryTotals[expense.category]) {
      categoryTotals[expense.category] += expense.amount;
    } else {
      categoryTotals[expense.category] = expense.amount;
    }
  });

  return categoryTotals;
}

// Calculate daily totals
function getDailyTotals(monthExpenses) {
  const dailyTotals = {};

  monthExpenses.forEach((expense) => {
    const day = expense.date.split("-")[2];

    if (dailyTotals[day]) {
      dailyTotals[day] += expense.amount;
    } else {
      dailyTotals[day] = expense.amount;
    }
  });

  return dailyTotals;
}

// Load report data
function loadReports() {
  const selectedMonth = monthPicker.value;
  const monthExpenses = getExpensesByMonth(selectedMonth);

  const monthTotal = monthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  selectedMonthTotal.textContent = formatCurrency(monthTotal);
  totalTransactions.textContent = monthExpenses.length;

  const categoryTotals = getCategoryTotals(monthExpenses);

  let topCategory = "-";
  let highestAmount = 0;

  for (let category in categoryTotals) {
    if (categoryTotals[category] > highestAmount) {
      highestAmount = categoryTotals[category];
      topCategory = category;
    }
  }

  highestCategory.textContent = topCategory;

  renderTopCategories(categoryTotals);
  renderCategoryBarChart(categoryTotals);
  renderDailyLineChart(monthExpenses);
}

// Show top categories list
function renderTopCategories(categoryTotals) {
  topCategoriesList.innerHTML = "";

  const sortedCategories = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  );

  if (sortedCategories.length === 0) {
    topCategoriesList.innerHTML = "<li>No category data available</li>";
    return;
  }

  sortedCategories.forEach(([category, amount]) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span class="category-name">${category}</span>
      <span class="category-amount">${formatCurrency(amount)}</span>
    `;

    topCategoriesList.appendChild(li);
  });
}

// Bar chart for category spending
function renderCategoryBarChart(categoryTotals) {
  const ctx = document.getElementById("categoryBarChart");

  if (categoryBarChart) {
    categoryBarChart.destroy();
  }

  categoryBarChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          label: "Category Spending",
          data: Object.values(categoryTotals),
          backgroundColor: "#2E75B6"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Line chart for daily spending trend
function renderDailyLineChart(monthExpenses) {
  const dailyTotals = getDailyTotals(monthExpenses);

  const sortedDays = Object.keys(dailyTotals).sort((a, b) => Number(a) - Number(b));

  const ctx = document.getElementById("dailyLineChart");

  if (dailyLineChart) {
    dailyLineChart.destroy();
  }

  dailyLineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: sortedDays.map((day) => "Day " + day),
      datasets: [
        {
          label: "Daily Spending",
          data: sortedDays.map((day) => dailyTotals[day]),
          borderColor: "#1F4E79",
          backgroundColor: "#2E75B6",
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Change report when month changes
monthPicker.addEventListener("change", loadReports);

// Download PDF
downloadPdfBtn.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  const selectedMonth = monthPicker.value;
  const monthExpenses = getExpensesByMonth(selectedMonth);
  const categoryTotals = getCategoryTotals(monthExpenses);

  const monthTotal = monthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  doc.setFontSize(18);
  doc.text("Expense Tracker - Monthly Report", 20, 20);

  doc.setFontSize(12);
  doc.text(`Month: ${selectedMonth}`, 20, 35);
  doc.text(`Total Expenses: ${formatCurrency(monthTotal)}`, 20, 45);
  doc.text(`Total Transactions: ${monthExpenses.length}`, 20, 55);

  doc.text("Top Categories:", 20, 75);

  let y = 85;

  Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, amount]) => {
      doc.text(`${category}: ${formatCurrency(amount)}`, 25, y);
      y += 10;
    });

  if (monthExpenses.length === 0) {
    doc.text("No expenses available for this month.", 25, y);
  }

  doc.save(`expense-report-${selectedMonth}.pdf`);
});

// Initial load
loadReports();