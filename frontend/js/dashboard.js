// Temporary login protection
const isLoggedIn = localStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true") {
  alert("Please login first");
  window.location.href = "index.html";
}

// Logout functionality
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("isLoggedIn");
  alert("Logged out successfully");
  window.location.href = "index.html";
});

// Temporary sample expense data
// Later this data will come from MySQL using backend API
const expenses = [
  {
    date: "2026-05-01",
    category: "Food",
    description: "Lunch",
    amount: 250
  },
  {
    date: "2026-05-03",
    category: "Transport",
    description: "Bus pass",
    amount: 500
  },
  {
    date: "2026-05-05",
    category: "Shopping",
    description: "Shoes",
    amount: 1200
  },
  {
    date: "2026-05-07",
    category: "Food",
    description: "Dinner",
    amount: 350
  },
  {
    date: "2026-04-15",
    category: "Utilities",
    description: "Mobile recharge",
    amount: 299
  }
];

// Format amount as Indian Rupees
function formatCurrency(amount) {
  return "₹" + amount.toFixed(2);
}

// Calculate KPI cards
function loadKPICards() {
  const currentMonth = "2026-05";

  const thisMonthExpenses = expenses.filter((expense) =>
    expense.date.startsWith(currentMonth)
  );

  const thisMonthTotal = thisMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const allTimeTotal = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const today = new Date();
  const daysElapsed = today.getDate();

  const averageDailySpend = thisMonthTotal / daysElapsed;

  const categoryTotals = {};

  thisMonthExpenses.forEach((expense) => {
    if (categoryTotals[expense.category]) {
      categoryTotals[expense.category] += expense.amount;
    } else {
      categoryTotals[expense.category] = expense.amount;
    }
  });

  let topCategory = "-";
  let highestAmount = 0;

  for (let category in categoryTotals) {
    if (categoryTotals[category] > highestAmount) {
      highestAmount = categoryTotals[category];
      topCategory = category;
    }
  }

  document.getElementById("thisMonthTotal").textContent =
    formatCurrency(thisMonthTotal);

  document.getElementById("allTimeTotal").textContent =
    formatCurrency(allTimeTotal);

  document.getElementById("averageDailySpend").textContent =
    formatCurrency(averageDailySpend);

  document.getElementById("topCategory").textContent = topCategory;
}

// Load recent transactions
function loadRecentTransactions() {
  const tableBody = document.getElementById("recentTransactionsBody");

  tableBody.innerHTML = "";

  const recentExpenses = expenses.slice(0, 5);

  if (recentExpenses.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4">No recent transactions</td>
      </tr>
    `;
    return;
  }

  recentExpenses.forEach((expense) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${expense.date}</td>
      <td>${expense.category}</td>
      <td>${expense.description}</td>
      <td>${formatCurrency(expense.amount)}</td>
    `;

    tableBody.appendChild(row);
  });
}

// Monthly Bar Chart
function loadMonthlyBarChart() {
  const monthlyTotals = {
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 299,
    May: 2300,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0
  };

  const ctx = document.getElementById("monthlyBarChart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(monthlyTotals),
      datasets: [
        {
          label: "Monthly Expenses",
          data: Object.values(monthlyTotals),
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

// Category Pie Chart
function loadCategoryPieChart() {
  const categoryTotals = {};

  expenses.forEach((expense) => {
    if (categoryTotals[expense.category]) {
      categoryTotals[expense.category] += expense.amount;
    } else {
      categoryTotals[expense.category] = expense.amount;
    }
  });

  const ctx = document.getElementById("categoryPieChart");

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          label: "Category Expenses",
          data: Object.values(categoryTotals),
          backgroundColor: [
            "#1F4E79",
            "#2E75B6",
            "#1D6A3A",
            "#C62828"
          ]
        }
      ]
    },
    options: {
      responsive: true
    }
  });
}

// Quick Add Expense button
const addExpenseBtn = document.querySelector(".add-expense-btn");

addExpenseBtn.addEventListener("click", () => {
  window.location.href = "transactions.html";
});

// Run all dashboard functions
loadKPICards();
loadRecentTransactions();
loadMonthlyBarChart();
loadCategoryPieChart();