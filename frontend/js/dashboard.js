const API_BASE_URL = "/api";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token) {
  alert("Please login first");
  window.location.href = "index.html";
}

const logoutBtn = document.getElementById("logoutBtn");
const recentTransactionsBody = document.getElementById("recentTransactionsBody");

const thisMonthTotal = document.getElementById("thisMonthTotal");
const allTimeTotal = document.getElementById("allTimeTotal");
const averageDailySpend = document.getElementById("averageDailySpend");
const topCategory = document.getElementById("topCategory");

let expenses = [];

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });
}

async function fetchExpenses() {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message || "Failed to load dashboard data");
      return;
    }

    expenses = data.expenses || [];

    updateDashboard();
    renderRecentTransactions();
    renderCharts();
  } catch (error) {
    console.error(error);
    alert("Server error while loading dashboard");
  }
}

function updateDashboard() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.expense_date);
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });

  const thisMonthTotal = thisMonthExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  const allTimeTotal = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  const averageDaily = thisMonthTotal / 30;

  const categoryTotals = {};

  expenses.forEach((expense) => {
    const category = expense.category_id?.name || "Other";
    categoryTotals[category] =
      (categoryTotals[category] || 0) + Number(expense.amount);
  });

  let highestCategory = "No data";
  let highestAmount = 0;

  Object.keys(categoryTotals).forEach((category) => {
    if (categoryTotals[category] > highestAmount) {
      highestAmount = categoryTotals[category];
      highestCategory = category;
    }
  });

  if (thisMonthAmount) thisMonthAmount.textContent = `₹${thisMonthTotal.toFixed(2)}`;
  if (allTimeAmount) allTimeAmount.textContent = `₹${allTimeTotal.toFixed(2)}`;
  if (averageDailyAmount) averageDailyAmount.textContent = `₹${averageDaily.toFixed(2)}`;
  if (topCategory) topCategory.textContent = highestCategory;
}

function renderRecentTransactions() {
  if (!recentTransactionsBody) return;

  recentTransactionsBody.innerHTML = "";

  if (expenses.length === 0) {
    recentTransactionsBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center;">No expenses found</td>
      </tr>
    `;
    return;
  }

  const recentExpenses = expenses.slice(0, 5);

  recentExpenses.forEach((expense) => {
    const date = new Date(expense.expense_date).toLocaleDateString("en-IN");
    const category = expense.category_id?.name || "Other";

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${date}</td>
      <td>${category}</td>
      <td>${expense.description || "-"}</td>
      <td>₹${Number(expense.amount).toFixed(2)}</td>
    `;

    recentTransactionsBody.appendChild(row);
  });
}

function renderCharts() {
  const monthlyChartCanvas = document.getElementById("monthlyBarChart");
  const categoryChartCanvas = document.getElementById("categoryPieChart");

  if (!monthlyChartCanvas || !categoryChartCanvas) return;

  const monthlyTotals = {};
  const categoryTotals = {};

  expenses.forEach((expense) => {
    const date = new Date(expense.expense_date);
    const month = date.toLocaleString("default", { month: "short" });
    const category = expense.category_id?.name || "Other";

    monthlyTotals[month] = (monthlyTotals[month] || 0) + Number(expense.amount);
    categoryTotals[category] = (categoryTotals[category] || 0) + Number(expense.amount);
  });

  new Chart(monthlyChartCanvas, {
    type: "bar",
    data: {
      labels: Object.keys(monthlyTotals),
      datasets: [
        {
          label: "Monthly Expenses",
          data: Object.values(monthlyTotals)
        }
      ]
    }
  });

  new Chart(categoryChartCanvas, {
    type: "doughnut",
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          data: Object.values(categoryTotals)
        }
      ]
    }
  });
}

fetchExpenses();