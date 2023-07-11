const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Category-wise limits
let limits = {};

// Prompt user to enter category-wise limits
for (let category of ['food', 'travel', 'entertainment','other']) {
  const limit = prompt(`Enter ${category} limit:`);
  limits[category] = parseFloat(limit);
}

// Category-wise expenses
const expenses = {
  food: 0,
  travel: 0,
  entertainment: 0,
  other: 0
};

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a text and amount');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
      category: getCategory(text.value)
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);

    updateValues();

    checkLimits(transaction);

    updateLocalStorage();

    text.value = '';
    amount.value = '';

    showPopup();
  }
}

function showPopup() {
  const popup = document.getElementById('popup');
  popup.classList.add('popup-show');
  setTimeout(() => {
    popup.classList.remove('popup-show');
  }, 6000);
}



// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  // Get sign
  const sign = transaction.amount < 0 ? '-' : '+';

  const item = document.createElement('li');

  // Add class based on value
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span> <button class="delete-btn" onclick="removeTransaction(${
    transaction.id
  })">x</button>
  `;

  list.appendChild(item);
}

// Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);

  updateLocalStorage();

  init();
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init app
function init() {
  list.innerHTML = '';

  transactions.forEach(addTransactionDOM);
  updateValues();
}

function getCategory(text) {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('food') || lowerText.includes('restaurant')|| lowerText.includes('parties')) {
  return 'food';
  } else if (lowerText.includes('travel') || lowerText.includes('transportation')) {
  return 'travel';
  } else if (lowerText.includes('entertainment') || lowerText.includes('movies') || lowerText.includes('games')) {
  return 'entertainment';
  } else if (lowerText.includes('grocery') || lowerText.includes('vegitables') || lowerText.includes('fee')) {
  return 'other';
  }
  }
  
  // Check if the transaction exceeds the limit for its category
  function checkLimits(transaction) {
    if (transaction.amount < 0) {
      const category = transaction.category;
      const expense = Math.abs(transaction.amount);
      const totalExpense = expenses[category] + expense;
      if (totalExpense > limits[category]) {
        alert(`You have exceeded the limit for ${category} category`);
      }
      expenses[category] = totalExpense;
    }
  }
  function showPopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'block';
    setTimeout(() => {
      popup.style.display = 'none';
    }, 2000);
  }
  
  

form.addEventListener('submit', addTransaction);

init();  