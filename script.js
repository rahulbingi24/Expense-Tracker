let data = loadFromLocalStorage();

displayTable();
updateSummary();

function submit() {
  const type = document.querySelector("#transaction-type").value;
  const dateStr = document.querySelector("#date").value;
  const amountInput = document.querySelector("#amount").value.trim();

  if (!amountInput || !dateStr || !type) {
    alert("Please fill all the fields.");
    return;
  }

  const amount = type === "Expense" ? -Math.abs(amountInput) : +amountInput;
  const date = new Date(dateStr);

  const newEntry = {
    amount,
    transactionType: type,
    date,
    
  };

  data.unshift(newEntry);
  saveToLocalStorage();
  displayTable();
  updateSummary();
  cleanInputs();
}

function displayTable() {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  data.forEach((item, index) => {
    const row = tbody.insertRow(); // Amount

    row.insertCell().textContent =
      item.amount < 0 ? `-₹${Math.abs(item.amount)}` : `₹${item.amount}`; // Transaction Type

    row.insertCell().textContent = item.transactionType; // Date as DD/MM/YYYY

    const formattedDate =
      item.date instanceof Date
        ? item.date.toLocaleDateString("en-GB")
        : new Date(item.date).toLocaleDateString("en-GB");

    row.insertCell().textContent = formattedDate; // Delete button

    row.insertCell().innerHTML = `<button class="delete-btn" data-index="${index}">Delete</button>`;
  });
}

document.querySelector("tbody").addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-btn")) {
    const index = e.target.dataset.index;
    data.splice(index, 1);
    saveToLocalStorage();
    displayTable();
    updateSummary();
  }
});

function saveToLocalStorage() {
  localStorage.setItem("expenseData", JSON.stringify(data));
}

function loadFromLocalStorage() {
  const stored = localStorage.getItem("expenseData");
  if (stored) {
    const parsed = JSON.parse(stored);
    parsed.forEach((item) => (item.date = new Date(item.date)));
    return parsed;
  }
  return [];
}

function totalIncome() {
  return data.reduce((sum, item) => {
    return item.transactionType === "Income" ? sum + Number(item.amount) : sum;
  }, 0);
}

function totalExpense() {
  return data.reduce((sum, item) => {
    return item.transactionType === "Expense"
      ? sum + Math.abs(Number(item.amount))
      : sum;
  }, 0);
}

function updateSummary() {
  const incomeEl = document.querySelector("#total-income");
  const expenseEl = document.querySelector("#total-expense");
  const balanceEl = document.querySelector("#balance");

  const income = totalIncome();
  const expense = totalExpense();
  const balance = income - expense;

  incomeEl.textContent = `₹${income}`;
  expenseEl.textContent = `₹${expense}`;
  balanceEl.textContent = `₹${balance}`;
}

function cleanInputs() {
  const type = document.querySelector("#transaction-type");
  const dateStr = document.querySelector("#date");
  const amountInput = document.querySelector("#amount");

  type.value = ""
  dateStr.value = ""
  amountInput.value = ""
}