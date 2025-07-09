let entries = [];
let goals = [];

document.addEventListener("DOMContentLoaded", () => {
  loadEntries();
  loadGoals();
});

function addEntry() {
  const date = document.getElementById("entryDate").value;
  const desc = document.getElementById("entryDesc").value.trim();
  const amount = parseFloat(document.getElementById("entryAmount").value);

  if (!date || !desc || isNaN(amount)) {
    alert("Please fill all fields correctly.");
    return;
  }

  const entry = { date, desc, amount };
  entries.push(entry);
  localStorage.setItem("budgetEntries", JSON.stringify(entries));
  loadEntries();

  document.getElementById("entryDate").value = "";
  document.getElementById("entryDesc").value = "";
  document.getElementById("entryAmount").value = "";
}

function loadEntries() {
  const stored = JSON.parse(localStorage.getItem("budgetEntries"));
  if (stored) entries = stored;

  const entriesList = document.getElementById("entriesList");
  entriesList.innerHTML = "";

  let balance = 0;

  entries.forEach((entry, index) => {
    balance += entry.amount;

    const li = document.createElement("li");
    li.innerHTML = `
      ${entry.date} — ${entry.desc}
      <span class="${entry.amount >= 0 ? 'income' : 'expense'}">₹${entry.amount}</span>
      <button onclick="deleteEntry(${index})">Delete</button>
    `;
    entriesList.appendChild(li);
  });

  document.getElementById("balance").innerText = balance;
}

function deleteEntry(index) {
  entries.splice(index, 1);
  localStorage.setItem("budgetEntries", JSON.stringify(entries));
  loadEntries();
}

// Savings Goals Logic

function addGoal() {
  const name = document.getElementById("goalName").value.trim();
  const target = parseFloat(document.getElementById("goalTarget").value);

  if (!name || isNaN(target) || target <= 0) {
    alert("Please enter a valid name and target amount.");
    return;
  }

  const goal = { name, target, saved: 0 };
  goals.push(goal);
  localStorage.setItem("savingsGoals", JSON.stringify(goals));
  loadGoals();

  document.getElementById("goalName").value = "";
  document.getElementById("goalTarget").value = "";
}

function loadGoals() {
  const stored = JSON.parse(localStorage.getItem("savingsGoals"));
  if (stored) goals = stored;

  const goalsList = document.getElementById("goalsList");
  goalsList.innerHTML = "";

  goals.forEach((goal, index) => {
    const percent = ((goal.saved / goal.target) * 100).toFixed(1);
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${goal.name}</strong><br>
      Saved: ₹${goal.saved} / ₹${goal.target} (${percent}%)
      <div class="progress-bar">
        <div class="progress" style="width:${percent}%"></div>
      </div>
      <button onclick="addToGoal(${index})">Add Money</button>
      <button onclick="deleteGoal(${index})">Delete</button>
    `;

    goalsList.appendChild(li);
  });
}

function addToGoal(index) {
  const amount = parseFloat(prompt("How much to add to savings?"));
  if (isNaN(amount) || amount <= 0) {
    alert("Invalid amount.");
    return;
  }

  goals[index].saved += amount;
  localStorage.setItem("savingsGoals", JSON.stringify(goals));
  loadGoals();
}

function deleteGoal(index) {
  goals.splice(index, 1);
  localStorage.setItem("savingsGoals", JSON.stringify(goals));
  loadGoals();
}
